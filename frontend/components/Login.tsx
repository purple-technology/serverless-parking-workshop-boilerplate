import { Auth } from 'aws-amplify'
import { useState } from 'react'

export const Login: React.FC = () => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const register = async (): Promise<void> => {
		try {
			const resp = await Auth.signUp({
				username: email,
				password
			})
			console.log(resp)
		} catch (err) {
			console.log(err)
		}
	}

	const login = async (): Promise<void> => {
		try {
			const resp = await Auth.signIn({
				username: email,
				password
			})
			console.log(resp)
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div>
			<h2>Login</h2>
			<form
				onSubmit={(event): void => {
					event.preventDefault()
				}}
			>
				email:
				<input
					type="text"
					onChange={(event): void => setEmail(event.target.value)}
				/>
				password:
				<input
					type="password"
					onChange={(event): void => setPassword(event.target.value)}
				/>
				<button type="submit" onClick={(): Promise<void> => register()}>
					Register
				</button>
				<button type="submit" onClick={(): Promise<void> => login()}>
					Login
				</button>
			</form>
		</div>
	)
}
