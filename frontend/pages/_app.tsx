import '../styles/globals.css'

import { Amplify } from 'aws-amplify'
import type { AppProps } from 'next/app'

const amplifyConfig = {
	Auth: {
		region: `${process.env.NEXT_PUBLIC_USER_POOL_ID}`.split('_')[0],
		userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
		userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
		mandatorySignIn: true
	},
	aws_appsync_graphqlEndpoint: process.env.NEXT_PUBLIC_APP_API_URL,
	aws_appsync_region: `${process.env.NEXT_PUBLIC_USER_POOL_ID}`.split('_')[0],
	aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
	API: {
		graphql_endpoint: process.env.NEXT_PUBLIC_APP_API_URL,
		aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
		graphql_endpoint_iam_region:
			`${process.env.NEXT_PUBLIC_USER_POOL_ID}`.split('_')[0]
	}
}

if (typeof window !== 'undefined') {
	Amplify.configure(amplifyConfig)
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	return <Component {...pageProps} />
}

export default MyApp
