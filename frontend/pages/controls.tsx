import type { NextPage } from 'next'

import { GateControls } from '../components/GateControls'
import { ParkedCars } from '../components/ParkedCars'
import { Reservations } from '../components/Reservations'

const Controls: NextPage = () => {
	return (
		<div>
			<GateControls />
			<ParkedCars />
			<Reservations />
		</div>
	)
}

export default Controls
