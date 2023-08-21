import axios, { AxiosResponse } from 'axios'

const apiKey = 'da2-someapikeyhere'

const apiUrl =
	'https://n6cn5an5dnaedlthyeqrvh7pla.appsync-api.eu-central-1.amazonaws.com/graphql'

type OpneGateApiResponse = { data: { openGate: { success: boolean } } }
export const openGateApi = async ({
	gate
}: {
	gate: string
}): Promise<AxiosResponse<OpneGateApiResponse>> =>
	await axios.post<OpneGateApiResponse>(
		apiUrl,
		{
			query: /* GraphQL */ `
				mutation ($gate: Gate!) {
					openGate(gate: $gate) {
						success
					}
				}
			`,
			variables: {
				gate
			}
		},
		{
			headers: {
				'x-api-key': apiKey
			}
		}
	)

type OccupySpotApiResponse = { data: { occupySpot: { success: boolean } } }
export const occupySpotApi = async ({
	spot,
	time
}: {
	spot: string
	time?: number
}): Promise<AxiosResponse<OccupySpotApiResponse>> =>
	await axios.post<OccupySpotApiResponse>(
		apiUrl,
		{
			query:
				typeof time === 'undefined'
					? /* GraphQL */ `
							mutation ($spot: ID!) {
								occupySpot(spot: $spot) {
									success
								}
							}
					  `
					: /* GraphQL */ `
							mutation ($spot: ID!, $time: Int!) {
								occupySpot(spot: $spot, timeSeconds: $time) {
									success
								}
							}
					  `,
			variables:
				typeof time === 'undefined'
					? {
							spot
					  }
					: {
							spot,
							time
					  }
		},
		{
			headers: {
				'x-api-key': apiKey
			}
		}
	)

type FreeSpotApiResponse = { data: { freeSpot: { success: boolean } } }
export const freeSpotApi = async ({
	spot
}: {
	spot: string
}): Promise<AxiosResponse<FreeSpotApiResponse>> =>
	await axios.post<FreeSpotApiResponse>(
		apiUrl,
		{
			query: /* GraphQL */ `
				mutation ($spot: ID!) {
					freeSpot(spot: $spot) {
						success
					}
				}
			`,
			variables: {
				spot
			}
		},
		{
			headers: {
				'x-api-key': apiKey
			}
		}
	)

type NavigateToSpotApiResponse = {
	data: { navigateToSpot: { success: boolean } }
}
export const navigateToSpotApi = async ({
	spot
}: {
	spot: string
}): Promise<AxiosResponse<NavigateToSpotApiResponse>> =>
	await axios.post<NavigateToSpotApiResponse>(
		apiUrl,
		{
			query: /* GraphQL */ `
				mutation ($spot: ID!) {
					navigateToSpot(spot: $spot) {
						success
					}
				}
			`,
			variables: {
				spot
			}
		},
		{
			headers: {
				'x-api-key': apiKey
			}
		}
	)
