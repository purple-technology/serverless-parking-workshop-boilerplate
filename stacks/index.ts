import { App } from '@serverless-stack/resources'

import { Frontend } from './Frontend'

export default function (app: App): void {
	app.setDefaultRemovalPolicy('destroy')

	app.setDefaultFunctionProps({
		logRetention: 'one_week',
		runtime: 'nodejs16.x',
		srcPath: 'services',
		bundle: {
			format: 'esm'
		}
	})

	app.stack(Frontend, { id: 'frontend' })
}
