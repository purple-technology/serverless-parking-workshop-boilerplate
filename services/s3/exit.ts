import { S3Handler } from 'aws-lambda'
import AWS from 'aws-sdk'

import { freeSpotApi, openGateApi } from '../utils/graphql'

const rekognition = new AWS.Rekognition()
const dynamoDb = new AWS.DynamoDB.DocumentClient()

export const handler: S3Handler = async (event) => {
	for (const record of event.Records) {
	}
}
