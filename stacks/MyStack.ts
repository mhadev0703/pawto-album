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

    const api = new Api(stack, 'pawto-album', {
        cors: true,  // Enable CORS
        defaults: {
            function: {
                bind: [UploadsBucket, CollectionsTable, SENDER_EMAIL],  // Bind the resources to the function
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