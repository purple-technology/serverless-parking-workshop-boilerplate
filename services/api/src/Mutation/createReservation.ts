import { AppSyncResolverHandler } from 'aws-lambda'
import AWS from 'aws-sdk'

import { occupySpotApi } from '../../../utils/graphql'
import { Mutation, MutationCreateReservationArgs } from '../types'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export const handler: AppSyncResolverHandler<
	MutationCreateReservationArgs,
	Mutation['createReservation']
> = async (event) => {
	return {
		success: false
	}
}
