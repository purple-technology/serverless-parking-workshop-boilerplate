import { Fn, RemovalPolicy } from 'aws-cdk-lib'
import { CfnEventBusPolicy } from 'aws-cdk-lib/aws-events'
import { AccountPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { ObjectOwnership } from 'aws-cdk-lib/aws-s3'
import { Bucket, Cognito, EventBus, StackContext, Table } from 'sst/constructs'

type ResourcesStackOutput = {
	cognito: Cognito
	reservationsTable: Table
	occupancyTable: Table
	parkingLotTable: Table
}

export function Resources({ stack, app }: StackContext): ResourcesStackOutput {
	const eventBus = new EventBus(stack, 'EventBus', {})

	new CfnEventBusPolicy(stack, 'EventBusPolicy', {
		eventBusName: eventBus.eventBusName,
		statementId: stack.stackName,
		action: 'events:PutEvents',
		principal: '221940693656'
	})

	const cognito = new Cognito(stack, 'Auth', {
		login: ['email'],
		cdk: {
			userPool: {
				autoVerify: {
					email: true
				},
				passwordPolicy: {
					minLength: 6,
					requireDigits: false,
					requireLowercase: false,
					requireSymbols: false,
					requireUppercase: false
				}
			}
		}
	})

	const reservationsTable = new Table(stack, 'ReservationsTable', {
		fields: {
			spotNumber: 'string',
			licensePlate: 'string'
		},
		primaryIndex: {
			partitionKey: 'spotNumber'
		},
		globalIndexes: {
			byLicensePlate: {
				partitionKey: 'licensePlate',
				projection: 'all'
			}
		}
	})

	const occupancyTable = new Table(stack, 'OccupancyTable', {
		fields: {
			licensePlate: 'string'
		},
		primaryIndex: {
			partitionKey: 'licensePlate'
		}
	})

	const parkingLotTable = new Table(stack, 'ParkingLotTable', {
		fields: {
			pk: 'string'
		},
		primaryIndex: {
			partitionKey: 'pk'
		}
	})

	const bucket = new Bucket(stack, 'Bucket', {
		name: `${stack.stackName}.photos`,
		cdk: {
			bucket: {
				objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
				autoDeleteObjects: true,
				removalPolicy: app.defaultRemovalPolicy as RemovalPolicy
			}
		},
		defaults: {
			function: {
				bind: [occupancyTable, parkingLotTable, reservationsTable],
				environment: {
					OCCUPANCY_TABLE_NAME: occupancyTable.tableName,
					PARKING_LOT_TABLE: parkingLotTable.tableName,
					RESERVATIONS_TABLE: reservationsTable.tableName
				},
				permissions: [
					new PolicyStatement({
						effect: Effect.ALLOW,
						actions: ['rekognition:DetectText', 'rekognition:DetectLabels'],
						resources: ['*']
					}),
					new PolicyStatement({
						effect: Effect.ALLOW,
						actions: ['dynamodb:Query'],
						resources: [`${reservationsTable.tableArn}/index/byLicensePlate`]
					})
				]
			}
		},
		notifications: {
			entrance: {
				function: {
					handler: 'services/s3/entrance.handler'
				},
				filters: [
					{
						prefix: 'Entrance/'
					}
				],
				events: ['object_created']
			},
			exit: {
				function: 'services/s3/exit.handler',
				filters: [
					{
						prefix: 'Exit/'
					}
				],
				events: ['object_created']
			},
			carsCount: {
				function: 'services/s3/carsCount.handler',
				filters: [
					{
						prefix: 'ParkingLot/'
					}
				],
				events: ['object_created']
			}
		}
	})

	bucket.cdk.bucket.addToResourcePolicy(
		new PolicyStatement({
			effect: Effect.ALLOW,
			principals: [new AccountPrincipal('221940693656')],
			actions: ['s3:PutObject'],
			resources: [`arn:aws:s3:::${bucket.bucketName}/*`]
		})
	)

	bucket.attachPermissions([
		new PolicyStatement({
			effect: Effect.ALLOW,
			actions: ['s3:GetObject'],
			resources: [Fn.join('', [bucket.bucketArn, '/*'])]
		})
	])

	eventBus.addRules(stack, {
		expiration: {
			pattern: {
				source: ['parking-service'],
				detailType: ['spot-expired']
			},
			targets: {
				expiration: {
					function: {
						handler: 'services/eventBus/expiration.handler',
						bind: [reservationsTable],
						environment: {
							RESERVATIONS_TABLE: reservationsTable.tableName
						}
					}
				}
			}
		}
	})

	return {
		cognito,
		occupancyTable,
		parkingLotTable,
		reservationsTable
	}
}
