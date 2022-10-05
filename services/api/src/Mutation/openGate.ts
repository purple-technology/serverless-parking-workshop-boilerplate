import { AppSyncResolverHandler } from 'aws-lambda'

import { openGateApi } from '../../../utils/graphql'

export const handler: AppSyncResolverHandler<
	{ gate: string },
	{ success: boolean }
> = async (event) => {
	const {
		data: { data }
	} = await openGateApi({ gate: event.arguments.gate })

	return {
		success: data.openGate.success
	}
}
