import { AppSyncResolverHandler } from 'aws-lambda'
import axios from 'axios'

export const handler: AppSyncResolverHandler<
	{ spot: string; subject: string; time: number },
	{ success: boolean }
> = async (event) => {
	const data = await axios.post(
		'https://n6cn5an5dnaedlthyeqrvh7pla.appsync-api.eu-central-1.amazonaws.com/graphql',
		{
			query: `
			mutation($spot: ID!, $subject: String!, $time: Int!) {
				reserveSpot(spot: $spot, subject: $subject, timeSeconds: $time) {
					success
				}
			}`,
			variables: {
				spot: event.arguments.spot,
				subject: event.arguments.subject,
				time: event.arguments.time
			}
		},
		{
			headers: {
				'x-api-key': 'da2-p7mourlpivhv5metkdociqoe5q'
			}
		}
	)

	return {
		success: data.data.data.reserveSpot.success
	}
}
