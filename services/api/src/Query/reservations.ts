import { AppSyncResolverHandler } from 'aws-lambda'
import axios from 'axios'

export const handler: AppSyncResolverHandler<
	{},
	{
		spot: string
		subject: string
		creationTimestamp: string
		expirationTimestamp: string
	}[]
> = async () => {
	const data = await axios.post(
		'https://n6cn5an5dnaedlthyeqrvh7pla.appsync-api.eu-central-1.amazonaws.com/graphql',
		{
			query: /* GraphQL */ `
				query {
					parkingLot {
						reservations {
							spot
							subject
							creationTimestamp
							expirationTimestamp
						}
					}
				}
			`
		},
		{
			headers: {
				'x-api-key': 'da2-p7mourlpivhv5metkdociqoe5q'
			}
		}
	)

	return data.data.data.parkingLot.reservations
}
