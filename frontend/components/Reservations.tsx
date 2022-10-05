import { API } from 'aws-amplify'
import { Button, Card, Label, Select, Table, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'

export const Reservations: React.FC = () => {
	const [spot, setSpot] = useState<string>('1')
	const [time, setTime] = useState<string>('')
	const [licensePlate, setLicensePlate] = useState<string>('')

	const createReservation = async (): Promise<void> => {
		const resp = await API.graphql({
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
		console.log(resp)
	}

	const cancelReservation = async (
		spot: string,
		licensePlate: string
	): Promise<void> => {
		const resp = await API.graphql({
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
		console.log(resp)
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
		console.log(resp)
	}

	useEffect(() => {
		if (typeof reservations === 'undefined') {
			fetchReservations()
		}
	}, [reservations])

	return (
		<div className="mx-auto w-3/5 pt-10 pb-20 2xl:w-1/2">
			<Card>
				<h2 className="text-2xl">Reservations</h2>
				<form
					className="pb-5"
					onSubmit={(event): void => {
						event.preventDefault()
					}}
				>
					<div>
						<Label value="Spot:" />
						<Select onChange={(event): void => setSpot(event.target.value)}>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
						</Select>
					</div>
					<div className="pt-2">
						<Label value="Time:" />
						<TextInput
							type="number"
							min={0}
							max={300}
							onChange={(event): void => setTime(event.target.value)}
						/>
					</div>
					<div className="pt-2">
						<Label value="License plate:" />
						<TextInput
							type="text"
							onChange={(event): void => setLicensePlate(event.target.value)}
						/>
					</div>
					<div className="flex justify-center pt-2">
						<Button
							color="gray"
							type="submit"
							onClick={async (): Promise<void> => {
								await createReservation()
								await fetchReservations()
							}}
						>
							Create reservation
						</Button>
					</div>
				</form>
				<Table>
					<Table.Head>
						<Table.HeadCell>Spot</Table.HeadCell>
						<Table.HeadCell>License Plate</Table.HeadCell>
						<Table.HeadCell>Booking creation time</Table.HeadCell>
						<Table.HeadCell>Expiration time</Table.HeadCell>
						<Table.HeadCell>Car arrived</Table.HeadCell>
						<Table.HeadCell>Action</Table.HeadCell>
					</Table.Head>
					<Table.Body className="divide-y">
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
								<Table.Row key={i} className="text-black">
									<Table.Cell>{spot}</Table.Cell>
									<Table.Cell>{licensePlate}</Table.Cell>
									<Table.Cell>
										{creationTimestamp.replace('T', '\n')}
									</Table.Cell>
									<Table.Cell>
										{carArrived ? '' : expirationTimestamp.replace('T', '\n')}
									</Table.Cell>
									<Table.Cell>{carArrived ? 'Yes' : 'No'}</Table.Cell>
									<Table.Cell>
										<Button
											color="gray"
											size="xs"
											onClick={async () => {
												await cancelReservation(spot, licensePlate)
												await fetchReservations()
											}}
										>
											Cancel
										</Button>
									</Table.Cell>
								</Table.Row>
							)
						)}
						{(reservations ?? []).length === 0 ? (
							<Table.Row>
								<Table.Cell className="text-center" colSpan={6}>
									No data
								</Table.Cell>
							</Table.Row>
						) : null}
					</Table.Body>
				</Table>
				<div className="flex justify-end">
					<Button color="gray" onClick={() => fetchReservations()}>
						Reload
					</Button>
				</div>
			</Card>
		</div>
	)
}
