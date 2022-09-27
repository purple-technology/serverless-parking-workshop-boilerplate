import { EventBridgeHandler } from 'aws-lambda'
import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export const handler: EventBridgeHandler<
	'spot-expired',
	{
		spotNumber: number
	},
	void
> = async (event) => {
	console.log('expiration')
	await dynamoDb
		.delete({
			TableName: `${process.env.RESERVATIONS_TABLE}`,
			Key: {
				spotNumber: `${event.detail.spotNumber}`
			}
		})
		.promise()
}
