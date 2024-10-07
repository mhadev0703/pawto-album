import { StackContext, Api, StaticSite } from 'sst/constructs';

export function API({ stack }: StackContext) {
    const api = new Api(stack, 'pawto-album', {
        cors: true,
        defaults: {
            function: {
                bind: [],
            },
        },
        routes: {
            'GET /{proxy+}': 'packages/functions/src/lambda.handler',
            'POST /{proxy+}': 'packages/functions/src/lambda.handler',
        },
    });

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
        SiteUrl: site.customDomainUrl || site.url,
    });
}