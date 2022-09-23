import { App } from '@serverless-stack/resources'

import { Api } from './Api'
import { Frontend } from './Frontend'
import { Resources } from './Resources'

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

	app.stack(Resources, { id: 'resources' })
	app.stack(Api, { id: 'api' })
	app.stack(Frontend, { id: 'frontend' })
}
