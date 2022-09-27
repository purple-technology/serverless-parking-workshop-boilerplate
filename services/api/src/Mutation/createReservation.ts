import { AppSyncResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'
import axios from 'axios'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export const handler: AppSyncResolverHandler<
	{ spot: string; licensePlate: string; time: number },
	{ success: boolean }
> = async (event) => {
	const date = new Date()
	const expiryDate = new Date(Date.now() + event.arguments.time * 1000)

	const { data } = await axios.post(
		'https://n6cn5an5dnaedlthyeqrvh7pla.appsync-api.eu-central-1.amazonaws.com/graphql',
		{
			query: /* GraphQL */ `
				mutation ($spot: ID!, $time: Int!) {
					occupySpot(spot: $spot, timeSeconds: $time) {
						success
					}
				}
			`,
			variables: {
				spot: event.arguments.spot,
				time: event.arguments.time
			}
		},
		{
			headers: {
				'x-api-key': 'da2-3cv5r6iyhnbb5hsix5u2iegriy'
			}
		}
	)

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
