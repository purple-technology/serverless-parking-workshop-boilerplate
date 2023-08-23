import { S3Handler } from 'aws-lambda'
import AWS from 'aws-sdk'

import { freeSpotApi, openGateApi } from '../utils/graphql'

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

		const data = await dynamoDb
			.get({
				TableName: `${process.env.OCCUPANCY_TABLE_NAME}`,
				Key: {
					licensePlate: licensePlate.DetectedText
				}
			})
			.promise()

		const arrival = data.Item?.arrival

		const diff = Math.round(Date.now() / 1000) - arrival

		console.log(`Time spent ${diff}s`)

		await dynamoDb
			.delete({
				TableName: `${process.env.OCCUPANCY_TABLE_NAME}`,
				Key: {
					licensePlate: licensePlate.DetectedText
				}
			})
			.promise()

		await openGateApi({ gate: 'Exit' })

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
			await freeSpotApi({ spot: reservation.Items[0].spotNumber })

			await dynamoDb
				.delete({
					TableName: `${process.env.RESERVATIONS_TABLE}`,
					Key: {
						spotNumber: reservation.Items[0].spotNumber
					}
				})
				.promise()
		}
	}
}
