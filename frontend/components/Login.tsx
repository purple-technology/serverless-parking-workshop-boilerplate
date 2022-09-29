import { Auth } from 'aws-amplify'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const Login: React.FC = () => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const router = useRouter()

	const register = async (): Promise<void> => {
		try {
			const resp = await Auth.signUp({
				username: email,
				password
			})
			console.log(resp)
		} catch (err) {
			console.error(err)
		}
	}

	const verify = async (): Promise<void> => {
		try {
			const resp = await Auth.confirmSignUp(
				email,
				window.prompt('Auth code') ?? ''
			)
			console.log(resp)
		} catch (err) {
			console.error(err)
		}
	}

	const login = async (): Promise<void> => {
		try {
			const resp = await Auth.signIn({
				username: email,
				password
			})
			console.log(resp)
			router.push('/controls')
		} catch (err) {
			console.error(err)
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
				<br />
				<button type="submit" onClick={(): Promise<void> => register()}>
					Register
				</button>
				<br />
				<button type="submit" onClick={(): Promise<void> => verify()}>
					Verify
				</button>
				<br />
				<button type="submit" onClick={(): Promise<void> => login()}>
					Login
				</button>
			</form>
		</div>
	)
}
