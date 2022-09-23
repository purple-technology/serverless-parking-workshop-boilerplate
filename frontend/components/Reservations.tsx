import { API } from 'aws-amplify'
import { useEffect, useState } from 'react'

export const Reservations: React.FC = () => {
	const [spot, setSpot] = useState<string>('1')
	const [time, setTime] = useState<string>('')
	const [subject, setSubject] = useState<string>('')

	const createReservaton = async (): Promise<void> => {
		const resp = await API.graphql({
			query: /* GraphQL */ `
				mutation ($spot: ID!, $subject: String!, $time: Int!) {
					createReservation(spot: $spot, subject: $subject, time: $time) {
						success
					}
				}
			`,
			variables: {
				spot,
				subject,
				time: Number(time)
			}
		})
		console.log(resp)
	}

	const [reservations, setReservations] = useState<
		| {
				spot: string
				subject: string
				creationTimestamp: string
				expirationTimestamp: string
		  }[]
		| undefined
	>()
	const fetchReservations = async (): Promise<void> => {
		const resp = (await API.graphql({
			query: /* GraphQL */ `
				query {
					reservations {
						spot
						subject
						creationTimestamp
						expirationTimestamp
					}
				}
			`
		})) as {
			data: {
				reservations: {
					spot: string
					subject: string
					creationTimestamp: string
					expirationTimestamp: string
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
				Subject:
				<input
					type="text"
					onChange={(event): void => setSubject(event.target.value)}
				/>
				<button
					type="submit"
					onClick={async (): Promise<void> => {
						await createReservaton()
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
						<th>Subject</th>
						<th>Booking creation time</th>
						<th>Expiration time</th>
					</tr>
				</thead>
				<tbody>
					{(reservations ?? []).map(
						({ spot, subject, creationTimestamp, expirationTimestamp }, i) => (
							<tr key={i}>
								<td>{spot}</td>
								<td>{subject}</td>
								<td>{creationTimestamp}</td>
								<td>{expirationTimestamp}</td>
							</tr>
						)
					)}
					<tr>
						<td colSpan={4}>
							<button onClick={() => fetchReservations()}>Reload</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}
