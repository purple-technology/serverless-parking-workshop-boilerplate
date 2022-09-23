import { API } from 'aws-amplify'
import format from 'format-duration'
import { useEffect, useState } from 'react'

export const ParkedCars: React.FC = () => {
	const [activeCars, setActiveCars] = useState<
		| { licensePlate: string; arrival: number; elapsedSeconds?: number }[]
		| undefined
	>()
	const fetchActiveCars = async (): Promise<void> => {
		const resp = (await API.graphql({
			query: /* GraphQL */ `
				query {
					activeCars {
						licensePlate
						arrival
					}
				}
			`
		})) as { data: { activeCars: { licensePlate: string; arrival: number }[] } }
		setActiveCars(resp.data.activeCars)
	}

	useEffect(() => {
		if (typeof activeCars === 'undefined') {
			fetchActiveCars()
		}
	}, [activeCars])

	useEffect(() => {
		const interval = setInterval(() => {
			if (typeof activeCars !== 'undefined') {
				const date = Date.now()
				setActiveCars(
					activeCars.map((car) => {
						car.elapsedSeconds = Math.round((date - car.arrival * 1000) / 1000)
						return car
					})
				)
			}
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [activeCars])

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
					{(activeCars ?? []).map(
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
							<button onClick={() => fetchActiveCars()}>Reload</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}
