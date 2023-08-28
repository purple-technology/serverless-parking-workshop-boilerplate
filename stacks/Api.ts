import {
	AuthorizationType,
	UserPoolDefaultAction
} from 'aws-cdk-lib/aws-appsync'
import { AppSyncApi, StackContext, use } from 'sst/constructs'

import { Resources } from './Resources'

export type ApiStackOutput = {
	api: AppSyncApi
}

export function Api({ stack }: StackContext): ApiStackOutput {
	const resources = use(Resources)

	const api = new AppSyncApi(stack, 'Api', {
		schema: 'services/api/schema.graphql',
		defaults: {
			function: {
				bind: [
					resources.occupancyTable,
					resources.parkingLotTable,
					resources.reservationsTable
				],
				environment: {
					OCCUPANCY_TABLE: resources.occupancyTable.tableName,
					PARKING_LOT_TABLE: resources.parkingLotTable.tableName,
					RESERVATIONS_TABLE: resources.reservationsTable.tableName
				}
			}
		},

		resolvers: {
			'Mutation     openGate': 'services/api/src/Mutation/openGate.handler',
			'Mutation     cancelReservation':
				'services/api/src/Mutation/cancelReservation.handler',
			'Mutation     createReservation':
				'services/api/src/Mutation/createReservation.handler',
			'Query        parkedCars': 'services/api/src/Query/parkedCars.handler',
			'Query        reservations':
				'services/api/src/Query/reservations.handler',
			'Query        spots': 'services/api/src/Query/spots.handler'
		},
		cdk: {
			graphqlApi: {
				authorizationConfig: {
					defaultAuthorization: {
						authorizationType: AuthorizationType.USER_POOL,
						userPoolConfig: {
							userPool: resources.cognito.cdk.userPool,
							appIdClientRegex:
								resources.cognito.cdk.userPoolClient.userPoolClientId,
							defaultAction: UserPoolDefaultAction.ALLOW
						}
					}
				}
			}
		}
	})

	return {
		api
	}
}
