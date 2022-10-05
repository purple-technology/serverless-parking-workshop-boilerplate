import { AppSyncResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'

import { occupySpotApi } from '../../../utils/graphql'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export const handler: AppSyncResolverHandler<
	{ spot: string; licensePlate: string; time: number },
	{ success: boolean }
> = async (event) => {
	const date = new Date()
	const expiryDate = new Date(Date.now() + event.arguments.time * 1000)

	const { data } = await occupySpotApi({
		spot: event.arguments.spot,
		time: event.arguments.time
	})

	if (data.data.occupySpot.success === true) {
		try {
			await dynamodb
				.put({
					TableName: `${process.env.RESERVATIONS_TABLE}`,
					Item: {
						spotNumber: event.arguments.spot,
						licensePlate: event.arguments.licensePlate,
						createdAt: date.toISOString(),
						expiresAt: expiryDate.toISOString(),
						carArrived: false
					},
					ConditionExpression: 'attribute_not_exists(spotNumber)'
				})
				.promise()
		} catch (err) {
			return {
				success: false
			}
		}
	}

	return {
		success: data.data.occupySpot.success
	}
}
