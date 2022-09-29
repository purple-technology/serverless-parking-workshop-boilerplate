# serverless-parking-workshop-boilerplate
Boilerplate used when doing the workshop

## Node.js
- [Official download page](https://nodejs.org/en/download/)
- [Or via `nvm`](https://github.com/nvm-sh/nvm#installing-and-updating)

## AWS CLI
- [Official installation guildelines](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- Setup configuration via `$ aws configure --profile workshop`
- Add credentials to `$ nano ~/.aws/credentials`

## Serverless Stack (SST)

- `$ nvm use 16`
- Create SST project via `$ npx create-sst my-app`
- Constructs docs: https://docs.sst.dev/constructs
- How SST works with AWS profiles: https://docs.sst.dev/working-with-your-team#aws-account-per-environment 
- Cross stack references via `use`: https://docs.sst.dev/advanced/cross-stack-references

## Auth (Amazon Cognito)
- [SST docs](https://docs.sst.dev/constructs/Auth)
- [CDK docs](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cognito.UserPool.html)

## API (AWS AppSync)
- [Authorization & Authentication docs](https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html)
- [AppSyncApi SST docs](https://docs.sst.dev/constructs/AppSyncApi)

## Machine Learning
- License plate regex `/^[0-9][A-Z]{2} [0-9]{4}$/.test`

## Frontend

- Create Next.js project in `frontend` folder via Next.js CLI `$ npx create-next-app@latest --ts --use-npm`
- Install [local frontend development tool from SST](https://docs.sst.dev/constructs/NextjsSite#while-developing) `$ npm i -D @serverless-stack/static-site-env -w frontend`
- Add to `frontend/package.json` a line `"dev": "sst-env -- next dev"`
- Install `$ npm i -D @sls-next/lambda-at-edge` to the root `package.json` as mentioned in the [SST docs](https://docs.sst.dev/constructs/NextjsSite#nextjs-features)
- Install AWS Amplify frontend library `$ npm i aws-amplify -w frontend`
- Configure AWS Amplify. More about the configuration in [Amplify docs](https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/) and more about environment variables in [Next.js docs](https://nextjs.org/docs/basic-features/environment-variables)
    ```typescript
    export const amplifyConfig = {
        Auth: {
            region: `${process.env.NEXT_PUBLIC_USER_POOL_ID}`.split('_')[0],
            userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
            userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
            mandatorySignIn: true
        },
        aws_appsync_graphqlEndpoint: process.env.NEXT_PUBLIC_APP_API_URL,
        aws_appsync_region: `${process.env.NEXT_PUBLIC_USER_POOL_ID}`.split(
            '_'
        )[0],
        aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
        API: {
            graphql_endpoint: process.env.NEXT_PUBLIC_APP_API_URL,
            aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
            graphql_endpoint_iam_region: `${process.env.NEXT_PUBLIC_USER_POOL_ID}`.split('_')[0]
        }
    }
    ```

## S3 Camera images

- Paths `Entrance, Exit, ParkingLot`
- Resource Policy
    ```typescript
    bucket.cdk.bucket.addToResourcePolicy(
		new PolicyStatement({
			effect: Effect.ALLOW,
			principals: [new AccountPrincipal('221940693656')],
			actions: ['s3:PutObject'],
			resources: [`arn:aws:s3:::${bucket.bucketName}/*`]
		})
	)
    ```

## EventBridge connection

-   ```typescript
    new CfnEventBusPolicy(stack, 'EventBusPolicy', {
		eventBusName: eventBus.eventBusName,
		statementId: stack.stackName,
		action: 'events:PutEvents',
		principal: '221940693656'
	})
    ```
