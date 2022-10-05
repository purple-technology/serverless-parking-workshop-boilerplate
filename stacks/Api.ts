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

		resolvers: {
			'Mutation     openGate': 'api/src/Mutation/openGate.handler',
			'Mutation     cancelReservation':
				'api/src/Mutation/cancelReservation.handler',
			'Mutation     createReservation':
				'api/src/Mutation/createReservation.handler',
			'Query        parkedCars': 'api/src/Query/parkedCars.handler',
			'Query        reservations': 'api/src/Query/reservations.handler',
			'Query        spots': 'api/src/Query/spots.handler'
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
