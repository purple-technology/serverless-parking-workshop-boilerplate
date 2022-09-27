import { API } from 'aws-amplify'
import { useEffect, useState } from 'react'

export const GateControls: React.FC = () => {
	const openGate = async (gate: 'Entry' | 'Exit'): Promise<void> => {
		await API.graphql({
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
	}

	const [spots, setSpots] = useState<
		| {
				total: number
				taken: number
		  }
		| undefined
	>()
	const fetchSpots = async (): Promise<void> => {
		const resp = (await API.graphql({
			query: /* GraphQL */ `
				query {
					spots {
						taken
						total
					}
				}
			`
		})) as {
			data: {
				spots: {
					total: number
					taken: number
				}
			}
		}
		setSpots(resp.data.spots)
	}

	useEffect(() => {
		if (typeof spots === 'undefined') {
			fetchSpots()
		}
	}, [spots])

	console.log(spots)

	return (
		<div>
			<h2>Gate controls</h2>

			<div>
				Free spots:
				{typeof spots === 'undefined'
					? '0/0'
					: `${spots.total - spots.taken}/${spots.total}`}
			</div>

			<button
				disabled={
					typeof spots === 'undefined' || spots.total - spots.taken === 0
				}
				onClick={(): Promise<void> => openGate('Entry')}
			>
				Open Entrance Gate
			</button>

			<button onClick={(): Promise<void> => openGate('Exit')}>
				Open Exit Gate
			</button>
			<br />

			<button onClick={(): Promise<void> => fetchSpots()}>Reload</button>
		</div>
	)
}
