import { S3Handler } from 'aws-lambda'
import AWS from 'aws-sdk'

import { navigateToSpotApi, occupySpotApi, openGateApi } from '../utils/graphql'

const rekognition = new AWS.Rekognition()
const dynamoDb = new AWS.DynamoDB.DocumentClient()

export const handler: S3Handler = async (event) => {
	for (const record of event.Records) {
		const result = await rekognition
			.detectText({
				Image: {
					S3Object: {
						Bucket: record.s3.bucket.name,
						Name: record.s3.object.key
					}
				}
			})
			.promise()

		const licensePlate = result.TextDetections?.find((det) =>
			/^[0-9][A-Z]{2} [0-9]{4}$/.test(`${det.DetectedText}`)
		)

		if (typeof licensePlate === 'undefined') {
			console.log('No result!')
			return
		}

		await dynamoDb
			.put({
				TableName: `${process.env.OCCUPANCY_TABLE_NAME}`,
				Item: {
					licensePlate: licensePlate.DetectedText,
					arrival: Math.round(Date.now() / 1000)
				}
			})
			.promise()

		const reservation = await dynamoDb
			.query({
				TableName: `${process.env.RESERVATIONS_TABLE}`,
				IndexName: 'byLicensePlate',
				ExpressionAttributeValues: {
					':licensePlate': licensePlate.DetectedText
				},
				KeyConditionExpression: 'licensePlate = :licensePlate'
			})
			.promise()

		if (
			typeof reservation.Items !== 'undefined' &&
			reservation.Items.length > 0 &&
			typeof reservation.Items[0].spotNumber === 'string'
		) {
			await occupySpotApi({ spot: reservation.Items[0].spotNumber })
			await navigateToSpotApi({ spot: reservation.Items[0].spotNumber })

			await dynamoDb
				.update({
					TableName: `${process.env.RESERVATIONS_TABLE}`,
					Key: {
						spotNumber: reservation.Items[0].spotNumber
					},
					ExpressionAttributeValues: {
						':carArrived': true
					},
					UpdateExpression: 'SET carArrived = :carArrived'
				})
				.promise()
		}

		await openGateApi({ gate: 'Entry' })
	}
}
