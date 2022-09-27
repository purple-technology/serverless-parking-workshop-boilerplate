import { AppSyncResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'
import axios from 'axios'

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

	await axios.post(
		'https://n6cn5an5dnaedlthyeqrvh7pla.appsync-api.eu-central-1.amazonaws.com/graphql',
		{
			query: /* GraphQL */ `
				mutation ($spot: ID!) {
					freeSpot(spot: $spot) {
						success
					}
				}
			`,
			variables: {
				spot: event.arguments.spot
			}
		},
		{
			headers: {
				'x-api-key': 'da2-3cv5r6iyhnbb5hsix5u2iegriy'
			}
		}
	)

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
