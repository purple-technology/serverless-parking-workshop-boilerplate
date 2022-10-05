import { AppSyncResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'

import { Query } from '../types'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export const handler: AppSyncResolverHandler<
	{},
	Query['reservations']
> = async () => {
	return [
		{
			carArrived: false,
			creationTimestamp: new Date().toISOString(),
			expirationTimestamp: new Date().toISOString(),
			licensePlate: '2AB 1234',
			spot: '1'
		}
	]
}
