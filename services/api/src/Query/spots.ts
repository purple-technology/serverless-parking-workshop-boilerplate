import { AppSyncResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export const handler: AppSyncResolverHandler<
	{},
	{ total: number; taken: number }
> = async () => {
	const carsCount = await dynamoDb
		.get({
			TableName: `${process.env.PARKING_LOT_TABLE}`,
			Key: {
				pk: 'carsCount'
			}
		})
		.promise()

	if (typeof carsCount.Item?.value === 'undefined') {
		throw new Error('No cars count')
	}

	const reservations = await dynamoDb
		.scan({
			TableName: `${process.env.RESERVATIONS_TABLE}`,
			ExpressionAttributeValues: {
				':carArrived': false
			},
			FilterExpression: 'carArrived = :carArrived'
		})
		.promise()

	return {
		taken: carsCount.Item?.value + (reservations.Items ?? []).length,
		total: 8
	}
}
