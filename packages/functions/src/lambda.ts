import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { Config } from 'sst/node/config';
import { Bucket } from 'sst/node/bucket';
import { Table } from 'sst/node/table';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { S3, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DynamoDB({ region: 'us-east-1' });
const s3 = new S3({ region: 'us-east-1' });

const ses = new SESClient({ region: 'us-east-1' });
const BASE_PRICE = 2.99;

export const handler = async (event: APIGatewayProxyEventV2) => {
    if (event.requestContext.http.method === 'GET') {
        if (event.rawPath === '/collections') {
            // get item from collections table
            const collectionId = event.queryStringParameters?.collectionId;

            if (collectionId == undefined) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: true,
                        message: 'Invalid request body',
                    }),
                };
            }

            const params = {
                Key: { collectionId: { S: collectionId } },
                TableName: Table.Collections.tableName,
            };

            const { Item } = await dynamoDb.getItem(params);

            if (!Item) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: true,
                        message: 'Collection ID does not exist.',
                    }),
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    cStatus: Item.cStatus.N,
                    name: Item.name.S,
                    email: Item.email.S,
                    createDatetime: Item.createDatetime.S,
                    startDatetime: Item.startDatetime.S,
                    endDatetime: Item.endDatetime.S,
                    animalType: Item.animalType.S,
                    paid: Item.paid.BOOL,
                    price: Item.price.N,
                    receipt: Item.receipt.S,
                }),
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
        } else if (event.requestContext.http.method === 'POST') {
            if (event.rawPath === '/updateCollectionStatus') {
                return {
                    statusCode: 200,
                    body: JSON.stringify({}),
                };
            } else if (event.rawPath === '/createCollection') {
                const collectionId = uuidv4();
                if (event.body == undefined) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({
                            error: true,
                            message: 'Invalid request body',
                        }),
                    };
                }
                const body = JSON.parse(event.body);
                const email = body.email;
                const images = body.images;
                const animalType = body.animalType;
                const name = body.name;

                // get current time
                const currentDatetime = new Date().toISOString();
                const collectionStatus = 0;  // Collection status. 0: created, 1: processing, 2: completed, 3: error

                if (!email || !images || !animalType || !name) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({
                            error: true,
                            message:
                                'Please provide all the required information: email, images, animal type, and name.',
                        }),
                    };
                }

                // Check email format with regex
                var re = /\S+@\S+\.\S+/;
                if (!re.test(email)) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({
                            error: true,
                            message: 'Please provide valid email',
                        }),
                    };
                }

                // Save images to s3
                let i = 0;

                for (const image of images) {
                    const params = {
                        Bucket: Bucket.Uploads.bucketName,
                        Key: `${collectionId}/sks/sks (${i}).jpg`,
                        Body: Buffer.from(image, 'base64'),
                        ContentEncoding: 'base64',
                        ContentType: 'image/jpeg',
                        // ACL: 'public-read',
                    };
                    await s3.putObject(params);
                    i += 1;
                }

                // Characters to choose from
                const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

                // Generate 6-digit secret key with lowercase letters and numbers
                let secretKey = '';
                for (let i = 0; i < 6; i++) {
                    secretKey += chars[Math.floor(Math.random() * chars.length)];
                }

                // Save collection to DynamoDB
                await dynamoDb.putItem({
                    TableName: Table.Collections.tableName,
                    Item: {
                        collectionId: { S: collectionId },
                        email: { S: email },
                        name: { S: name },
                        collectionStatus: { N: collectionStatus.toString() },
                        createDatetime: { S: currentDatetime },
                        startDatetime: { S: '' },
                        endDatetime: { S: '' },
                        paymentKey: { S: '' },
                        animalType: { S: animalType },
                        paid: { BOOL: false },
                        price: { N: BASE_PRICE.toString() },
                        secretKey: { S: secretKey },
                        receipt: { S: '' },
                    },
                });

                // Send email with template collectionCreated
                await sendEmail(
                    'collectionCreated',
                    email,
                    name,
                    collectionId,
                    secretKey
                );

                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        collectionId: collectionId,
                        email: email,
                    }),
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
    }
};


async function sendEmail(
    template: string,  // collectionCreated, paymentComplete, paymentCancelled, imageReady, paymentCompleteAlert
    email: string,  // user email
    name: string,  // collection name
    collection_id: string,
    secretKey: string
) {
    let subject = '';
    let body = '';
    let baseURL = 'http://localhost:5173';

    if (template == 'collectionCreated') {
        subject = `[Pawto Album] Your ${name} collection is ready for creation!`;
        body = `Your Pawto Album ${name} collection is ready for creation. Once you complete the payment, AI will start processing the images to create stunning artwork! If you closed the page before making the payment, click the link below to continue:\n\n
            ${baseURL}/order?collectionId=${collection_id}&secretKey=${secretKey}`;
    } else if (template == 'paymentComplete') {
        subject = `[Pawto Album] Payment for your ${name} collection is complete!`;
        body = `The payment for your Pawto Album ${name} collection is complete, and the AI has started processing the images! It will take approximately 40 minutes to finish. If you're curious about the progress or need a receipt, click the link below:\n\n
            ${baseURL}/status?collectionId=${collection_id}&secretKey=${secretKey} \n\n`;
    } else if (template == 'paymentCancelled') {
        subject = `[Pawto Album] An error occurred with your ${name} collection.`;
        body = `An error occurred while the AI was processing your ${name} collection, and the payment has been automatically canceled. Refunds will be processed within 3-7 business days, depending on your card issuer. We apologize for the inconvenience.\n\n
            If you'd like to try again, please click the link below to retrieve your collection and start the payment process again. We sincerely apologize for the inconvenience. \n\n
            ${baseURL}/order?collectionId=${collection_id}&secretKey=${secretKey}`;
    } else if (template == 'imageReady') {
        subject = `[Pawto Album] Your ${name} collection is complete!`;
        body = `Your Pawto Album ${name} collection is now complete! To view the finished collection, click the link below: \n\n
            ${baseURL}/see?collectionId=${collection_id}&secretKey=${secretKey}`;
    } else if (template == 'paymentCompleteAlert') {
        subject = `[Pawto Album] Payment for your ${name} collection is confirmed.`;
        body = `Payment for your Pawto Album ${name} collection is confirmed. \n Email: ${email} \n\n
            ${baseURL}/status?collectionId=${collection_id}&secretKey=${secretKey} \n\n`;
    }

    if (subject == '' || body == '') {
        return false;  // invalid template
    }

    let send_to = email;
    if (template == 'paymentCompleteAlert') send_to = Config.SENDER_EMAIL;

    const params = {
        Destination: {
            ToAddresses: [send_to],
        },
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: body,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
        },
        Source: Config.SENDER_EMAIL,
    };

    await ses.send(new SendEmailCommand(params));

    return true;
}