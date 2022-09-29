import { AppSyncResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export const handler: AppSyncResolverHandler<
	{},
	{ licensePlate: string; arrival: number }[]
> = async () => {
	const x = await dynamoDb
		.scan({
			TableName: `${process.env.OCCUPANCY_TABLE}`
		})
		.promise()

	return (x.Items ?? []).map(({ arrival, licensePlate }) => ({
		arrival,
		licensePlate
	}))
}
