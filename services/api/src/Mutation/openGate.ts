import { AppSyncResolverHandler } from 'aws-lambda'
import axios from 'axios'

export const handler: AppSyncResolverHandler<
	{ gate: string },
	{ success: boolean }
> = async (event) => {
	await axios.post(
		'https://n6cn5an5dnaedlthyeqrvh7pla.appsync-api.eu-central-1.amazonaws.com/graphql',
		{
			query: `
				mutation($gate: Gate!) {
					openGate(gate: $gate) {
						success
					}
				}`,
			variables: {
				gate: event.arguments.gate
			}
		},
		{
			headers: {
				'x-api-key': 'da2-p7mourlpivhv5metkdociqoe5q'
			}
		}
	)

	return {
		success: true
	}
}
