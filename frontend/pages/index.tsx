import type { NextPage } from 'next'

import { GateControls } from '../components/GateControls'
import { Login } from '../components/Login'
import { ParkedCars } from '../components/ParkedCars'
import { Reservations } from '../components/Reservations'

const Home: NextPage = () => {
	return (
		<div>
			<Login />
			<GateControls />
			<ParkedCars />
			<Reservations />
		</div>
	)
}

export default Home
