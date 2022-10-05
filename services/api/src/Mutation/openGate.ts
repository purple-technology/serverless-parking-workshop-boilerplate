import { AppSyncResolverHandler } from 'aws-lambda'

import { openGateApi } from '../../../utils/graphql'
import { Mutation, MutationOpenGateArgs } from '../types'

export const handler: AppSyncResolverHandler<
	MutationOpenGateArgs,
	Mutation['openGate']
> = async (event) => {
	return {
		success: false
	}
}
