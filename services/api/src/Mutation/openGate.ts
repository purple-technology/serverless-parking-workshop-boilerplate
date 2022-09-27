import { AppSyncResolverHandler } from 'aws-lambda'
import axios from 'axios'

export const handler: AppSyncResolverHandler<
	{ gate: string },
	{ success: boolean }
> = async (event) => {
	await axios.post(
		'https://n6cn5an5dnaedlthyeqrvh7pla.appsync-api.eu-central-1.amazonaws.com/graphql',
		{
			query: /* GraphQL */ `
				mutation ($gate: Gate!) {
					openGate(gate: $gate) {
						success
					}
				}
			`,
			variables: {
				gate: event.arguments.gate
			}
		},
		{
			headers: {
				'x-api-key': 'da2-3cv5r6iyhnbb5hsix5u2iegriy'
			}
		}
	)

	return {
		success: true
	}
}
