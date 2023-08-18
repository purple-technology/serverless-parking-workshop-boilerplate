import { NextjsSite, StackContext } from 'sst/constructs'

export function Frontend({ stack }: StackContext): void {
	new NextjsSite(stack, 'NextSite', {
		path: 'frontend',
		environment: {
			NEXT_PUBLIC_USER_POOL_ID: '',
			NEXT_PUBLIC_USER_POOL_CLIENT_ID: '',
			NEXT_PUBLIC_APP_API_URL: ''
		}
	})
}
