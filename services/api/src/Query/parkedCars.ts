import { AppSyncResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export const handler: AppSyncResolverHandler<
	{},
	{ licensePlate: string; arrival: number }[]
> = async () => {
	return [
		{
			arrival: Date.now() / 1000,
			licensePlate: '1CD 4321'
		}
	]
}
