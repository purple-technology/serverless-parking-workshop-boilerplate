import { S3Handler } from 'aws-lambda'
import AWS from 'aws-sdk'

const rekognition = new AWS.Rekognition()
const dynamodb = new AWS.DynamoDB.DocumentClient()

export const handler: S3Handler = async (event) => {
	for (const record of event.Records) {
		const result = await rekognition
			.detectLabels({
				Image: {
					S3Object: {
						Bucket: record.s3.bucket.name,
						Name: record.s3.object.key
					}
				}
			})
			.promise()

		const numberOfCars = result.Labels?.find(({ Name }) => Name === 'Car')
			?.Instances?.length

		if (typeof numberOfCars !== 'undefined') {
			await dynamodb
				.put({
					TableName: `${process.env.PARKING_LOT_TABLE}`,
					Item: {
						pk: 'carsCount',
						value: numberOfCars
					}
				})
				.promise()
		}
	}
}
