import { Auth, StackContext, Table } from '@serverless-stack/resources'
import { Bucket } from '@serverless-stack/resources'
import { Fn } from 'aws-cdk-lib'
import { AccountPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { ObjectOwnership } from 'aws-cdk-lib/aws-s3'

type ResourcesStackOutput = {
	auth: Auth
	occupancyTable: Table
	parkingLotTable: Table
	billingTable: Table
}

export function Resources({ stack }: StackContext): ResourcesStackOutput {
	const auth = new Auth(stack, 'Auth', {
		login: ['email'],
		cdk: {
			userPool: {
				passwordPolicy: {
					minLength: 6,
					requireDigits: false,
					requireLowercase: false,
					requireSymbols: false,
					requireUppercase: false
				}
			}
		},
		triggers: {
			preSignUp: {
				handler: 'cognito/preSignUp.handler'
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

	const billingTable = new Table(stack, 'BillingTable', {
		fields: {
			licensePlate: 'string'
		},
		primaryIndex: {
			partitionKey: 'licensePlate'
		}
	})

	const bucket = new Bucket(stack, 'Bucket', {
		name: `${stack.stackName}.photos`,
		cdk: {
			bucket: {
				objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED
			}
		},
		defaults: {
			function: {
				environment: {
					OCCUPANCY_TABLE_NAME: occupancyTable.tableName,
					PARKING_LOT_TABLE: parkingLotTable.tableName,
					BILLING_TABLE: billingTable.tableName
				},
				permissions: [
					new PolicyStatement({
						effect: Effect.ALLOW,
						actions: ['rekognition:DetectText', 'rekognition:DetectLabels'],
						resources: ['*']
					}),
					new PolicyStatement({
						effect: Effect.ALLOW,
						actions: [
							'dynamodb:DeleteItem',
							'dynamodb:PutItem',
							'dynamodb:GetItem'
						],
						resources: [
							occupancyTable.tableArn,
							parkingLotTable.tableArn,
							billingTable.tableArn
						]
					})
				]
			}
		},
		notifications: {
			entrance: {
				function: {
					handler: 's3/entrance.handler'
				},
				filters: [
					{
						prefix: 'Entrance/'
					}
				],
				events: ['object_created']
			},
			exit: {
				function: 's3/exit.handler',
				filters: [
					{
						prefix: 'Exit/'
					}
				],
				events: ['object_created']
			},
			carsCount: {
				function: 's3/carsCount.handler',
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

	return {
		auth,
		occupancyTable,
		parkingLotTable,
		billingTable
	}
}
