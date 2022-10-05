import type { NextPage } from 'next'

import { Login } from '../components/Login'

const Home: NextPage = () => {
	return (
		<div className="text-black">
			<Login />
		</div>
	)
}

export default Home
