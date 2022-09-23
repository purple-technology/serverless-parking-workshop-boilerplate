import { S3Handler } from 'aws-lambda'
import AWS from 'aws-sdk'
import axios from 'axios'

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

		await axios.post(
			'https://n6cn5an5dnaedlthyeqrvh7pla.appsync-api.eu-central-1.amazonaws.com/graphql',
			{
				query: `
						mutation($gate: Gate!) {
							openGate(gate: $gate) {
								success
							}
						}`,
				variables: {
					gate: 'Entry'
				}
			},
			{
				headers: {
					'x-api-key': 'da2-p7mourlpivhv5metkdociqoe5q'
				}
			}
		)
	}
}
