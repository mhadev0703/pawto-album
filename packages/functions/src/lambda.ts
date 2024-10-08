import { APIGatewayProxyEventV2 } from 'aws-lambda';

const BASE_PRICE = 3900;

export const handler = async (event: APIGatewayProxyEventV2) => {
    if (event.requestContext.http.method === 'GET') {
        if (event.rawPath === '/collections') {
            return {
                statusCode: 200,
                body: JSON.stringify({}),
            };
        } else if (event.rawPath === '/getImages') {
            return {
                statusCode: 200,
                body: JSON.stringify({}),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: true,
                    message: 'Hello world. This is a bad request.',
                }),
            };
        }
    } else if (event.requestContext.http.method === 'POST') {
        if (event.rawPath === '/updateCollectionStatus') {
            return {
                statusCode: 200,
                body: JSON.stringify({}),
            };
        } else if (event.rawPath === '/createCollection') {
            return {
                statusCode: 200,
                body: JSON.stringify({}),
            };
        } else if (event.rawPath === '/payment') {
            return {
                statusCode: 200,
                body: JSON.stringify({}),
            };
        } else if (event.rawPath === '/execBanana') {
            return {
                statusCode: 200,
                body: JSON.stringify({}),
            };
        } else if (event.rawPath === '/checkStartDatetime') {
            return {
                statusCode: 200,
                body: JSON.stringify({}),
            };
        } else if (event.rawPath === '/cancelPayment') {
            return {
                statusCode: 200,
                body: JSON.stringify({}),
            };
        } else {
            return {
                statusCode: 404,
                body: 'Hello world. This is a bad request.',
            };
        }
    } else {
        return {
            statusCode: 400,
            body: 'Hello world. This is a bad request.',
        };
    }
};