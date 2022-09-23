import { NextjsSite, StackContext, use } from '@serverless-stack/resources'

import { Api } from './Api'
import { Resources } from './Resources'

export function Frontend({ stack }: StackContext): void {
	const resources = use(Resources)
	const api = use(Api)

	new NextjsSite(stack, 'NextSite', {
		path: 'frontend',
		environment: {
			NEXT_PUBLIC_USER_POOL_ID: resources.auth.cdk.userPool.userPoolId,
			NEXT_PUBLIC_USER_POOL_CLIENT_ID:
				resources.auth.cdk.userPoolClient.userPoolClientId,
			NEXT_PUBLIC_APP_API_URL: api.api.url
		}
	})
}
