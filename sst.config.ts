import type { SSTConfig } from 'sst'

import { Frontend } from './stacks/Frontend'

const config: SSTConfig = {
	config() {
		return {
			name: 'parkinglot',
			region: 'eu-central-1',
			// profile: 'purple-workshops',
			stage: 'dev'
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

		app.stack(Frontend, { id: 'frontend' })
	}
}

export default config
