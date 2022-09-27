import { API } from 'aws-amplify'
import { useEffect, useState } from 'react'

export const Reservations: React.FC = () => {
	const [spot, setSpot] = useState<string>('1')
	const [time, setTime] = useState<string>('')
	const [licensePlate, setLicensePlate] = useState<string>('')

	const createReservation = async (): Promise<void> => {
		await API.graphql({
			query: /* GraphQL */ `
				mutation ($spot: ID!, $licensePlate: String!, $time: Int!) {
					createReservation(
						spot: $spot
						licensePlate: $licensePlate
						time: $time
					) {
						success
					}
				}
			`,
			variables: {
				spot,
				licensePlate,
				time: Number(time)
			}
		})
	}

	const cancelReservation = async (
		spot: string,
		licensePlate: string
	): Promise<void> => {
		await API.graphql({
			query: /* GraphQL */ `
				mutation ($spot: ID!, $licensePlate: String!) {
					cancelReservation(spot: $spot, licensePlate: $licensePlate) {
						success
					}
				}
			`,
			variables: {
				spot,
				licensePlate
			}
		})
	}

	const [reservations, setReservations] = useState<
		| {
				spot: string
				licensePlate: string
				creationTimestamp: string
				expirationTimestamp: string
				carArrived: boolean
		  }[]
		| undefined
	>()
	const fetchReservations = async (): Promise<void> => {
		const resp = (await API.graphql({
			query: /* GraphQL */ `
				query {
					reservations {
						spot
						licensePlate
						creationTimestamp
						expirationTimestamp
						carArrived
					}
				}
			`
		})) as {
			data: {
				reservations: {
					spot: string
					licensePlate: string
					creationTimestamp: string
					expirationTimestamp: string
					carArrived: boolean
				}[]
			}
		}
		setReservations(resp.data.reservations)
	}

	useEffect(() => {
		if (typeof reservations === 'undefined') {
			fetchReservations()
		}
	}, [reservations])

	return (
		<div>
			<h2>Reservations</h2>
			<h3>New reservation</h3>
			<form
				onSubmit={(event): void => {
					event.preventDefault()
				}}
			>
				Spot:
				<select onChange={(event): void => setSpot(event.target.value)}>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
					<option value="7">7</option>
					<option value="8">8</option>
				</select>
				Time:
				<input
					type="number"
					min={0}
					max={300}
					onChange={(event): void => setTime(event.target.value)}
				/>
				License Plate:
				<input
					type="text"
					onChange={(event): void => setLicensePlate(event.target.value)}
				/>
				<button
					type="submit"
					onClick={async (): Promise<void> => {
						await createReservation()
						await fetchReservations()
					}}
				>
					Create reservation
				</button>
			</form>

			<h3>Reservations list</h3>
			<table border={1}>
				<thead>
					<tr>
						<th>Spot</th>
						<th>License Plate</th>
						<th>Booking creation time</th>
						<th>Expiration time</th>
						<th>Car arrived</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{(reservations ?? []).map(
						(
							{
								spot,
								licensePlate,
								creationTimestamp,
								expirationTimestamp,
								carArrived
							},
							i
						) => (
							<tr key={i}>
								<td>{spot}</td>
								<td>{licensePlate}</td>
								<td>{creationTimestamp}</td>
								<td>{carArrived ? '' : expirationTimestamp}</td>
								<td>{carArrived ? 'Yes' : 'No'}</td>
								<td>
									<button
										onClick={async () => {
											await cancelReservation(spot, licensePlate)
											await fetchReservations()
										}}
									>
										Cancel
									</button>
								</td>
							</tr>
						)
					)}
					<tr>
						<td colSpan={6}>
							<button onClick={() => fetchReservations()}>Reload</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}
