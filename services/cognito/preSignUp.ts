import { PreSignUpTriggerHandler } from 'aws-lambda'

export const handler: PreSignUpTriggerHandler = async (event) => {
	event.response = {
		autoConfirmUser: true,
		autoVerifyEmail: false,
		autoVerifyPhone: false
	}

	return event
}
