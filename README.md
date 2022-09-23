# serverless-parking-workshop-boilerplate
Boilerplate used when doing the workshop


## SST setup

- `$ nvm use 16`
- Installation: `$ npx create-sst my-app`
- Constructs: https://docs.sst.dev/constructs


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
- https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/
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


## API
- schema:
    ```graphql
    type Query {

    }

    type Mutation {
        
    }
    ```
