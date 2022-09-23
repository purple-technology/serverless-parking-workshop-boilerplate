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
					OCCUPANCY_TABLE: resources.occupancyTable.tableName
				},
				permissions: [
					new PolicyStatement({
						effect: Effect.ALLOW,
						actions: ['dynamodb:Scan'],
						resources: [resources.occupancyTable.tableArn]
					})
				]
			}
		},
		dataSources: {
			openGate: 'api/src/Mutation/openGate.handler',
			createReservation: 'api/src/Mutation/createReservation.handler',
			activeCars: 'api/src/Query/activeCars.handler',
			reservations: 'api/src/Query/reservations.handler'
		},
		resolvers: {
			'Mutation     openGate': 'openGate',
			'Mutation     createReservation': 'createReservation',
			'Query        activeCars': 'activeCars',
			'Query        reservations': 'reservations'
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
