import { API } from 'aws-amplify'

export const GateControls: React.FC = () => {
	const openGate = async (gate: 'Entry' | 'Exit'): Promise<void> => {
		const resp = await API.graphql({
			query: /* GraphQL */ `
				mutation ($gate: Gate!) {
					openGate(gate: $gate) {
						success
					}
				}
			`,
			variables: {
				gate
			}
		})
		console.log(resp)
	}

	return (
		<div>
			<h2>Gate controls</h2>

			<button onClick={(): Promise<void> => openGate('Entry')}>
				Open Entrance Gate
			</button>

			<button onClick={(): Promise<void> => openGate('Exit')}>
				Open Exit Gate
			</button>
		</div>
	)
}
