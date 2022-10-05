import { API } from 'aws-amplify'
import { Button, Card, Table } from 'flowbite-react'
import format from 'format-duration'
import { useEffect, useState } from 'react'

export const ParkedCars: React.FC = () => {
	const [parkedCars, setParkedCars] = useState<
		| { licensePlate: string; arrival: number; elapsedSeconds?: number }[]
		| undefined
	>()
	const fetchParkedCars = async (): Promise<void> => {
		const resp = (await API.graphql({
			query: /* GraphQL */ `
				query {
					parkedCars {
						licensePlate
						arrival
					}
				}
			`
		})) as { data: { parkedCars: { licensePlate: string; arrival: number }[] } }
		setParkedCars(resp.data.parkedCars)
		console.log(resp)
	}

	useEffect(() => {
		if (typeof parkedCars === 'undefined') {
			fetchParkedCars()
		}
	}, [parkedCars])

	useEffect(() => {
		const interval = setInterval(() => {
			if (typeof parkedCars !== 'undefined') {
				const date = Date.now()
				setParkedCars(
					parkedCars.map((car) => {
						car.elapsedSeconds = Math.round((date - car.arrival * 1000) / 1000)
						return car
					})
				)
			}
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [parkedCars])

	return (
		<div className="mx-auto w-2/5 pt-10 2xl:w-1/4">
			<Card>
				<h2 className="text-2xl">Parked cars</h2>
				<Table>
					<Table.Head>
						<Table.HeadCell>License Plate</Table.HeadCell>
						<Table.HeadCell>Arrival</Table.HeadCell>
						<Table.HeadCell>Elapsed time</Table.HeadCell>
					</Table.Head>
					<Table.Body className="divide-y">
						{(parkedCars ?? []).map(
							({ arrival, licensePlate, elapsedSeconds }, i) => (
								<Table.Row key={i} className="text-black">
									<Table.Cell>{licensePlate}</Table.Cell>
									<Table.Cell>
										{new Date(arrival * 1000).toISOString()}
									</Table.Cell>
									<Table.Cell>
										{typeof elapsedSeconds === 'undefined'
											? ''
											: format(elapsedSeconds * 1000)}
									</Table.Cell>
								</Table.Row>
							)
						)}
						{(parkedCars ?? []).length === 0 ? (
							<Table.Row>
								<Table.Cell className="text-center" colSpan={3}>
									No data
								</Table.Cell>
							</Table.Row>
						) : null}
					</Table.Body>
				</Table>
				<div className="flex justify-end">
					<Button color="gray" onClick={() => fetchParkedCars()}>
						Reload
					</Button>
				</div>
			</Card>
		</div>
	)
}
