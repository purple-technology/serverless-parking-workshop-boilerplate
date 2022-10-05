import { API } from 'aws-amplify'
import { Button, Card } from 'flowbite-react'
import { useEffect, useState } from 'react'

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
		console.log(resp)
	}

	useEffect(() => {
		if (typeof spots === 'undefined') {
			fetchSpots()
		}
	}, [spots])

	return (
		<div className="mx-auto w-2/5 pt-20 2xl:w-1/4">
			<Card>
				<h2 className="text-2xl">Gate</h2>
				<div>
					<span className="font-medium">Free spots: &nbsp;</span>
					{typeof spots === 'undefined'
						? '-/-'
						: `${spots.total - spots.taken}/${spots.total}`}
				</div>
				<div className="flex justify-center">
					<Button.Group>
						<Button
							color="gray"
							disabled={
								typeof spots !== 'undefined' && spots.total - spots.taken === 0
							}
							onClick={(): Promise<void> => openGate('Entry')}
						>
							Open Entrance Gate
						</Button>

						<Button
							color="gray"
							onClick={(): Promise<void> => openGate('Exit')}
						>
							Open Exit Gate
						</Button>

						<Button color="gray" onClick={(): Promise<void> => fetchSpots()}>
							Reload
						</Button>
					</Button.Group>
				</div>
			</Card>
		</div>
	)
}
