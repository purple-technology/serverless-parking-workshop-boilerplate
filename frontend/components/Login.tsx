import { Auth } from 'aws-amplify'
import { Button, Card, Label, TextInput } from 'flowbite-react'
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
		<div className="mx-auto w-2/5 pt-20 2xl:w-1/4">
			<Card>
				<h2 className="text-2xl">Login</h2>
				<form
					onSubmit={(event): void => {
						event.preventDefault()
					}}
				>
					<div className="mb-2 block">
						<Label value="Email" />
					</div>
					<TextInput
						type="email"
						onChange={(event): void => setEmail(event.target.value)}
					/>
					<div className="mb- block">
						<Label value="Password" />
					</div>
					<TextInput
						type="password"
						onChange={(event): void => setPassword(event.target.value)}
					/>
					<div className="flex justify-center pt-4">
						<Button.Group>
							<Button
								color="gray"
								type="submit"
								onClick={(): Promise<void> => register()}
							>
								Register
							</Button>
							<Button
								color="gray"
								type="submit"
								onClick={(): Promise<void> => verify()}
							>
								Verify
							</Button>
							<Button
								color="gray"
								type="submit"
								onClick={(): Promise<void> => login()}
							>
								Login
							</Button>
						</Button.Group>
					</div>
				</form>
			</Card>
		</div>
	)
}
