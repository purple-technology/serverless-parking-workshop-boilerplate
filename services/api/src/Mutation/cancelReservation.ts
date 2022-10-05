import { AppSyncResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'

import { freeSpotApi } from '../../../utils/graphql'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export const handler: AppSyncResolverHandler<
	{ spot: string; licensePlate: string },
	{ success: boolean }
> = async (event) => {
	const reservation = await dynamodb
		.get({
			TableName: `${process.env.RESERVATIONS_TABLE}`,
			Key: {
				spotNumber: event.arguments.spot
			}
		})
		.promise()

	if (reservation?.Item?.licensePlate !== event.arguments.licensePlate) {
		return {
			success: false
		}
	}

	await freeSpotApi({ spot: event.arguments.spot })

	await dynamodb
		.delete({
			TableName: `${process.env.RESERVATIONS_TABLE}`,
			Key: {
				spotNumber: event.arguments.spot
			}
		})
		.promise()

	return {
		success: true
	}
}
