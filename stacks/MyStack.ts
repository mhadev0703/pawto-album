import { StackContext, Api, StaticSite, Config, Table, Bucket } from 'sst/constructs';
//import * as iam from 'sst/node_modules/aws-cdk-lib/aws-iam';
import * as iam from 'aws-cdk-lib/aws-iam';

export function API({ stack }: StackContext) {
    const UploadsBucket = new Bucket(stack, 'Uploads', {
        cors: [
            {
                maxAge: '1 day', 
                allowedOrigins: ['*'], 
                allowedHeaders: ['*'], 
                allowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            },
        ],
    });

    const CollectionsTable = new Table(stack, 'Collections', {
        fields: {
            collectionId: 'string',
            email: 'string',
        },
        primaryIndex: { partitionKey: 'collectionId' },  
        globalIndexes: {  
            emailIndex: { partitionKey: 'email' },  
        },
    });

    const SENDER_EMAIL = new Config.Secret(stack, 'SENDER_EMAIL'); 
    const TOSS_PAYMENTS_API_KEY = new Config.Secret(
        stack,
        'TOSS_PAYMENTS_API_KEY'
    );
    // const BANANA_SECRET_KEY = new Config.Secret(stack, 'BANANA_SECRET_KEY');
    const RUNPOD_SECRET_KEY = new Config.Secret(stack, 'RUNPOD_SECRET_KEY');

    const api = new Api(stack, 'pawto-album', {
        cors: true,  // Enable CORS
        defaults: {
            function: {
                runtime: "nodejs20.x",
                // Bind the resources to the function
                bind: [
                    UploadsBucket, 
                    CollectionsTable, 
                    SENDER_EMAIL, 
                    TOSS_PAYMENTS_API_KEY, 
                    // BANANA_SECRET_KEY
                    RUNPOD_SECRET_KEY
                ],  
            },
        },
        routes: {
            'GET /{proxy+}': 'packages/functions/src/lambda.handler',
            'POST /{proxy+}': 'packages/functions/src/lambda.handler',
        },
    });

    const awsArn = process.env.MY_AWS_ARN;
    // Attach permissions with IAM PolicyStatements
    api.attachPermissions([
        new iam.PolicyStatement({
            actions: ['ses:*'],
            effect: iam.Effect.ALLOW,
            resources: [awsArn],
        }),
    ]);

    const site = new StaticSite(stack, 'Site', {
        path: 'packages/web',
        environment: {
            VITE_API_URL: api.customDomainUrl || api.url,
            VITE_APP_URL: 'http://localhost:5173',
            VITE_TOSS_CLIENT_KEY: 'test_ck_PBal2vxj81y7lOk0KXGw85RQgOAN'
        },
        buildOutput: 'dist',
        buildCommand: 'npm run build',
    });

    stack.addOutputs({
        ApiEndpoint: api.customDomainUrl || api.url,
        S3Bucket: UploadsBucket.bucketName,
        SiteUrl: site.customDomainUrl || site.url,
    });
}