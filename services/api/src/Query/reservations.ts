import { AppSyncResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export const handler: AppSyncResolverHandler<
	{},
	{
		spot: string
		licensePlate: string
		creationTimestamp: string
		expirationTimestamp: string
		carArrived: boolean
	}[]
> = async () => {
	const reservations = await dynamoDb
		.scan({
			TableName: `${process.env.RESERVATIONS_TABLE}`
		})
		.promise()

	return (reservations.Items ?? []).map(
		({ spotNumber, createdAt, expiresAt, licensePlate, carArrived }) => ({
			spot: spotNumber,
			creationTimestamp: createdAt,
			expirationTimestamp: expiresAt,
			licensePlate,
			carArrived
		})
	)
}
