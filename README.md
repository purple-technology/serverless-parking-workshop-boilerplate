# serverless-parking-workshop-boilerplate
Boilerplate used when doing the workshop

## Serverless Stack (SST)

- `$ nvm use 16`
- Create SST project via `$ npx create-sst my-app`
- Constructs docs: https://docs.sst.dev/constructs

## Auth (Amazon Cognito)
- [SST docs](https://docs.sst.dev/constructs/Auth)
- [CDK docs](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cognito.UserPool.html)
- 



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
    ```JSON
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "Allow Purple Serverless Workshop",
                "Effect": "Allow",
                "Principal": {
                    "AWS": "arn:aws:iam::221940693656:root"
                },
                "Action": "s3:PutObject",
                "Resource": [
                    "arn:aws:s3:::BUCKET_NAME/*"
                ]
            }
        ]
    }
    ```

## Nextjs 
- `$ npx create-next-app@latest --ts --use-npm`
- `$ npm i -D @serverless-stack/static-site-env -w frontend`
- https://docs.sst.dev/constructs/NextjsSite
- `NEXT_PUBLIC_` https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
- `$ npm i aws-amplify -w frontend`
- 

## API
- schema:
    ```graphql
    type Query {

    }

    type Mutation {
        
    }
    ```
