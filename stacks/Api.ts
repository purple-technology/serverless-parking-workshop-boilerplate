import {
	AuthorizationType,
	UserPoolDefaultAction
} from '@aws-cdk/aws-appsync-alpha'
import { AppSyncApi, StackContext, use } from '@serverless-stack/resources'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'

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
				environment: {
					OCCUPANCY_TABLE: resources.occupancyTable.tableName,
					PARKING_LOT_TABLE: resources.parkingLotTable.tableName,
					RESERVATIONS_TABLE: resources.reservationsTable.tableName
				},
				permissions: [
					new PolicyStatement({
						effect: Effect.ALLOW,
						actions: ['dynamodb:Scan'],
						resources: [resources.occupancyTable.tableArn]
					}),
					new PolicyStatement({
						effect: Effect.ALLOW,
						actions: ['dynamodb:GetItem'],
						resources: [resources.parkingLotTable.tableArn]
					}),
					new PolicyStatement({
						effect: Effect.ALLOW,
						actions: [
							'dynamodb:PutItem',
							'dynamodb:GetItem',
							'dynamodb:Scan',
							'dynamodb:DeleteItem'
						],
						resources: [resources.reservationsTable.tableArn]
					})
				]
			}
		},
		dataSources: {
			openGate: 'api/src/Mutation/openGate.handler',
			createReservation: 'api/src/Mutation/createReservation.handler',
			cancelReservation: 'api/src/Mutation/cancelReservation.handler',
			activeCars: 'api/src/Query/activeCars.handler',
			reservations: 'api/src/Query/reservations.handler',
			spots: 'api/src/Query/spots.handler'
		},
		resolvers: {
			'Mutation     openGate': 'openGate',
			'Mutation     cancelReservation': 'cancelReservation',
			'Mutation     createReservation': 'createReservation',
			'Query        activeCars': 'activeCars',
			'Query        reservations': 'reservations',
			'Query        spots': 'spots'
		},
		cdk: {
			graphqlApi: {
				authorizationConfig: {
					defaultAuthorization: {
						authorizationType: AuthorizationType.USER_POOL,
						userPoolConfig: {
							userPool: resources.auth.cdk.userPool,
							appIdClientRegex:
								resources.auth.cdk.userPoolClient.userPoolClientId,
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
