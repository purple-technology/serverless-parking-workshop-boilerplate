import { API } from 'aws-amplify'
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
		<div>
			<h2>Parked cars</h2>

			<table border={1}>
				<thead>
					<tr>
						<th>License Plate</th>
						<th>Arrival</th>
						<th>Elapsed time</th>
					</tr>
				</thead>
				<tbody>
					{(parkedCars ?? []).map(
						({ arrival, licensePlate, elapsedSeconds }, i) => (
							<tr key={i}>
								<td>{licensePlate}</td>
								<td>{new Date(arrival * 1000).toISOString()}</td>
								<td>
									{typeof elapsedSeconds === 'undefined'
										? ''
										: format(elapsedSeconds * 1000)}
								</td>
							</tr>
						)
					)}
					<tr>
						<td colSpan={3}>
							<button onClick={() => fetchParkedCars()}>Reload</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}
