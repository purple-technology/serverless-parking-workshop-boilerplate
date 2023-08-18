import { App } from 'sst/constructs'

import { Frontend } from './Frontend'

export default function (app: App): void {
	app.setDefaultRemovalPolicy('destroy')

	app.setDefaultFunctionProps({
		logRetention: 'one_week',
		runtime: 'nodejs16.x',
		nodejs: {
			format: 'esm'
		}
	})

	app.stack(Frontend, { id: 'frontend' })
}
