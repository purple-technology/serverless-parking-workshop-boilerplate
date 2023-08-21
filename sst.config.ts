import type { SSTConfig } from 'sst'

import { Api } from './stacks/Api'
import { Frontend } from './stacks/Frontend'
import { Resources } from './stacks/Resources'

const config: SSTConfig = {
	config() {
		return {
			name: 'parkinglot',
			region: 'eu-central-1',
			profile: 'purple-workshops',
			stage: 'wp' //'dev'
		}
	},
	stacks(app) {
		app.setDefaultRemovalPolicy('destroy')

		app.setDefaultFunctionProps({
			logRetention: 'one_week',
			runtime: 'nodejs16.x',
			architecture: 'arm_64',
			nodejs: {
				format: 'esm'
			}
		})

		app.stack(Resources, { id: 'resources' })
		app.stack(Api, { id: 'api' })
		app.stack(Frontend, { id: 'frontend' })
	}
}

export default config
