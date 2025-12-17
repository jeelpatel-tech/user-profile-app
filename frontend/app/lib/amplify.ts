
import { Amplify } from "aws-amplify";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
            userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string,
            identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID as string,
        },
    },
    Storage: {
        S3: {
            bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
            region: process.env.NEXT_PUBLIC_AWS_REGION as string,
        },
    },
    API: {
        GraphQL: {
            endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT as string,
            region: process.env.NEXT_PUBLIC_AWS_REGION as string,
            defaultAuthMode: 'apiKey',
            apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
        },
    },
});