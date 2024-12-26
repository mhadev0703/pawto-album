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
//const BASE_PRICE = 2.99;
const BASE_PRICE = 3900;

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
                    collectionStatus: Item.collectionStatus.N,
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
            const collectionId = event.queryStringParameters?.collectionId;
            const secretKey = event.queryStringParameters?.secretKey;

            if (!collectionId || !secretKey) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: true,
                        message:
                            'Please provide both "collectionId" and "secretKey"',
                    }),
                };
            }

            // Get collection info
            const params = {
                Key: { collectionId: { S: collectionId } },
                TableName: Table.Collections.tableName,
            };

            const { Item } = await dynamoDb.getItem(params);

            if (
                !Item ||
                Item.email.S == undefined ||
                Item.name.S == undefined ||
                Item.secretKey.S == undefined
            ) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        error: true,
                        message:
                            'Could not find collection with provided "collectionId"',
                    }),
                };
            }

            if (Item.secretKey.S != secretKey) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        error: true,
                        message:
                            'Could not find collection with provided secretKey',
                    }),
                };
            }

            // If collectionStatus is not 2 (completed), return error
            if (Item.collectionStatus.N != '2') {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: true,
                        message: 'Image is not ready',
                    }),
                };
            }

            // Get list of s3 objects in collection's folder
            const response = await s3.listObjectsV2({
                Bucket: Bucket.Uploads.bucketName,
                Prefix: `${collectionId}/results/`,
            });

            // If collection's folder is empty, return error
            if (!response.Contents) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: true,
                        message: 'No image found',
                    }),
                };
            }

            // Generate presigned url for every image in collection's folder
            let urls = [];
            // Sort by last modified time
            response.Contents.sort(
                (a: any, b: any) =>
                    parseInt(a.Key.split('result (')[1].split(')')[0]) -
                    parseInt(b.Key.split('result (')[1].split(')')[0])
            );

            // Generate presigned url for each image
            const s3Client = new S3Client({ region: 'us-east-1' });
            for (const obj of response.Contents) {
                const getObjectParams = {
                    Bucket: Bucket.Uploads.bucketName,
                    Key: obj.Key,
                };
                const command = new GetObjectCommand(getObjectParams);
                // Presigned url will expire in 1 hour
                const url = await getSignedUrl(s3Client, command, {
                    expiresIn: 3600,
                });
                urls.push(url);
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    urls: urls,
                }),
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
            // Get collectionId, secretKey, collectionStatus, runpodSecretKey
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
            const collectionId = body.collectionId;
            const secretKey = body.secretKey;
            const collectionStatus = body.collectionStatus;
            const runpodSecretKey = body.runpodSecretKey;

            // check runpodSecretKey
            if (runpodSecretKey != Config.RUNPOD_SECRET_KEY) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        error: true,
                        message:
                            'Could not find collection with provided runpodSecretKey',
                    }),
                };
            }

            // get current time
            const currentDatetime = new Date().toISOString();

            if (!collectionId || !secretKey || !collectionStatus) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: true,
                        message:
                            'Please provide both "collectionId" and "collectionStatus" and "secretKey"',
                    }),
                };
            }

            // Check secretKey
            const params = {
                Key: { collectionId: { S: collectionId } },
                TableName: Table.Collections.tableName,
            };

            const { Item } = await dynamoDb.getItem(params);

            if (
                !Item ||
                Item.email.S == undefined ||
                Item.name.S == undefined ||
                Item.secretKey.S == undefined
            ) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        error: true,
                        message:
                            'Could not find collection with provided "collectionId"',
                    }),
                };
            }

            if (Item.secretKey.S != secretKey) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        error: true,
                        message:
                            'Could not find collection with provided secretKey',
                    }),
                };
            }

            if (parseInt(collectionStatus) == 1) {
                // If collectionStatus is 1, update startDatetime
                console.log('Dreambooth started!');
                console.log('collectionId: ', collectionId);
                console.log('startDatetime: ', currentDatetime);
                await dynamoDb.updateItem({
                    TableName: Table.Collections.tableName,
                    Key: { collectionId: { S: collectionId } },
                    UpdateExpression: 'set collectionStatus = :p, startDatetime = :s',
                    ExpressionAttributeValues: {
                        ':p': { N: '1' },
                        ':s': { S: currentDatetime },
                    },
                });
            } else if (parseInt(collectionStatus) == 2) {
                // if collectionStatus is 2, update endDatetime
                console.log('Dreambooth ended!');
                console.log('collectionId: ', collectionId);
                console.log('endDatetime: ', currentDatetime);
                await dynamoDb.updateItem({
                    TableName: Table.Collections.tableName,
                    Key: { collectionId: { S: collectionId } },
                    UpdateExpression: 'set collectionStatus = :p, endDatetime = :e',
                    ExpressionAttributeValues: {
                        ':p': { N: '2' },
                        ':e': { S: currentDatetime },
                    },
                });
                // Send email with template image ready message
                await sendEmail(
                    'imageReady',
                    Item.email.S,
                    Item.name.S,
                    collectionId,
                    Item.secretKey.S
                );
            } else if (parseInt(collectionStatus) == 3) {
                // If collectionStatus is 3, update endDatetime
                console.log('Dreambooth ERROR!');
                console.log('collectionId: ', collectionId);
                console.log('endDatetime: ', currentDatetime);
                await dynamoDb.updateItem({
                    TableName: Table.Collections.tableName,
                    Key: { collectionId: { S: collectionId } },
                    UpdateExpression: 'set collectionStatus = :p, endDatetime = :e',
                    ExpressionAttributeValues: {
                        ':p': { N: '3' },
                        ':e': { S: currentDatetime },
                    },
                });
                // Cancel the payment
                await cancelPayment(collectionId);
            } else {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: true,
                        message: 'Invalid collectionStatus',
                    }),
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    collectionId: collectionId,
                }),
            };
        }
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
            // Get data from request body
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
            const collectionId = body.collectionId;
            const paymentKey = body.paymentKey;
            const price = body.price;

            // Logs
            console.log('TRYING TO PAYMENT CONFIRM: ');
            console.log('collectionId: ', collectionId);
            console.log('PAYMENTKEY: ', paymentKey);
            console.log('PRICE: ', price);

            // Get data from the collections table
            const params = {
                Key: { collectionId: { S: collectionId } },
                TableName: Table.Collections.tableName,
            };

            const { Item } = await dynamoDb.getItem(params);

            // Check if the collection exists
            if (
                !Item ||
                Item.email.S == undefined ||
                Item.name.S == undefined ||
                Item.secretKey.S == undefined
            ) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        error: true,
                        message:
                            'Could not find collection with provided "collectionId"',
                    }),
                };
            }

            // Check if already paid
            if (Item.paid.BOOL == true) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: true,
                        message: 'Already paid',
                    }),
                };
            }

            // Check if price is correct
            if (BASE_PRICE != parseInt(price)) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: true,
                        message: 'Price is not correct',
                    }),
                };
            }

            // Confirm to toss payment api
            let receipt = '';
            let url = 'https://api.tosspayments.com/v1/payments/confirm';

            // Basic auth header for toss payment api 
            let headers = {
                'Content-Type': 'application/json',
                Authorization:
                    'Basic ' +
                    Buffer.from(Config.TOSS_PAYMENTS_API_KEY + ':').toString(
                        'base64'
                    ),
            };
            let data = {
                paymentKey: paymentKey,
                amount: price,
                orderId: collectionId,
            };

            let response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
            });

            if (response.status != 200) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: true,
                        message: 'Payment is not confirmed',
                    }),
                };
            }

            const responseJson = (await response.json()) as any;
            if (responseJson?.receipt == undefined) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: true,
                        message: 'Payment is not confirmed',
                    }),
                };
            }
            receipt = responseJson?.receipt.url;

            // Update payment status to true, and enter paymentKey and price
            await dynamoDb.updateItem({
                TableName: Table.Collections.tableName,
                Key: { collectionId: { S: collectionId } },
                UpdateExpression:
                    'set paid = :p, paymentKey = :pk, price = :pr, receipt = :r',
                ExpressionAttributeValues: {
                    ':p': { BOOL: true },
                    ':pk': { S: paymentKey },
                    ':pr': { N: price },
                    ':r': { S: receipt },
                },
            });

            // Send email for payment complete
            await sendEmail(
                'paymentComplete',
                Item.email.S,
                Item.name.S,
                collectionId,
                Item.secretKey.S
            );

            // Send email for alerting payment completetion 
            await sendEmail(
                'paymentCompleteAlert',
                Item.email.S,
                Item.name.S,
                collectionId,
                Item.secretKey.S
            );

            return {
                statusCode: 200,
                body: JSON.stringify({
                    receipt: receipt,
                    secretKey: Item.secretKey.S,
                }),
            };
        } else if (event.rawPath === '/execPod') {
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
            const collectionId = body.collectionId;

            console.log('EXEC RunPod: ', collectionId);

            // get data from collections table
            const params = {
                Key: { collectionId: { S: collectionId } },
                TableName: Table.Collections.tableName,
            };

            const { Item } = await dynamoDb.getItem(params);

            if (
                !Item ||
                Item.email.S == undefined ||
                Item.secretKey.S == undefined ||
                Item.animalType.S == undefined
            ) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        error: true,
                        message:
                            'Could not find collection with provided "collectionId"',
                    }),
                };
            }

            const animalType = Item.animalType.S;
            const secretKey = Item.secretKey.S;

            // check is paid and collectionStatus == 0
            if (Item.paid.BOOL == false) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: true,
                        message: 'Not paid',
                    }),
                };
            }

            if (Item.collectionStatus.N != '0') {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: true,
                        message: 'Already executed',
                    }),
                };
            }

            // update collectionStatus to 1
            await dynamoDb.updateItem({
                TableName: Table.Collections.tableName,
                Key: { collectionId: { S: collectionId } },
                UpdateExpression: 'set collectionStatus = :p',
                ExpressionAttributeValues: {
                    ':p': { N: '1' },
                },
            });

            const inputs = {
                input: {
                    collection_id: collectionId,
                    animalType: animalType,
                    secret_key: secretKey,
                    n_save_sample: 20, // Number of samples to generate
                    save_sample_negative_prompt:
                        'frame, paper, letter, signature, keen eyes, two heads, siamese, two tongues, logo, half man half beast, three legs, too vivid, too realistic',
                    save_guidance_scale: 8.5,
                    num_class_images: 200, // Number of images for model training
                    steps: 400, // This can be increased for longer training
                    art_styles: [
                        // Create a list of art styles to generate
                        `oil painting portrait of a ((zwx ${animalType})), face shot`,
                        `oil painting portrait of a ((zwx ${animalType})), full body shot`,
                    ],
                },
            };

            // When not running RunPod, set runit to false
            const runit = true;
            let outJson = {} as any;
            if (runit) {
                // Codes to run RunPod
                const header = {
                    'Content-Type': 'application/json',
                    authorization: 'runpodApiKey',
                };
                let url = 'https://api.runpod.ai/v2/[serverlessid]/run';

                let response = await fetch(url, {
                    method: 'POST',
                    headers: header,
                    body: JSON.stringify(inputs),
                });

                outJson = await response.json();
                const outId = outJson?.id;
                try {
                    url = `https://api.runpod.ai/v2/[serverlessid]/status/${outId}`;
                    response = await fetch(url, {
                        method: 'POST',
                        headers: header,
                        body: JSON.stringify(inputs),
                    });
                    const outStatus = (await response.json()) as any;
                } catch (error) {
                    console.log('STATUS_TIMEOUT');
                }
            } else {
                outJson = { result: 'success' };
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    outJson: outJson,
                }),
            };
        } else if (event.rawPath === '/checkStartDatetime') {
        // Get collectionId, secretKey, runpodSecretKey
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
        const collectionId = body.collectionId;
        const secretKey = body.secretKey;
        const runpodSecretKey = body.runpodSecretKey;

        // Check runpodSecretKey
        if (runpodSecretKey != Config.RUNPOD_SECRET_KEY) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: true,
                    message: 'runpodSecretKey error',
                }),
            };
        }

        if (!collectionId || !secretKey) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: true,
                    message:
                        'Please provide "collectionId", "collectionStatus" and "secretKey"',
                }),
            };
        }

        // Check secretKey
        const params = {
            Key: { collectionId: { S: collectionId } },
            TableName: Table.Collections.tableName,
        };

        const { Item } = await dynamoDb.getItem(params);

        if (
            !Item ||
            Item.email.S == undefined ||
            Item.name.S == undefined ||
            Item.secretKey.S == undefined
        ) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: true,
                    message:
                        'Could not find collection with provided "collectionId"',
                }),
            };
        }

        if (Item.secretKey.S != secretKey) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: true,
                    message:
                        'Could not find collection with provided secretKey',
                }),
            };
        }

        // Check startDatetime is empty
        const startDatetime = Item.startDatetime.S;
        if (startDatetime != '') {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    startDatetime: startDatetime,
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                startDatetime: '',
            }),
        };
    } else if (event.rawPath === '/cancelPayment') {
        // Get collectionId from request body
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

        const collectionId = body.collectionId;
        const result = await cancelPayment(collectionId);

        if (result == false) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: true,
                    message: 'Failed due to the cancelled payment',
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                result: result,
                message: 'Your payment has been cancelled',
            }),
        };
    } else {
        return {
            statusCode: 404,
            body: 'Hello world. This is a bad request.',
        };
    }
}


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


async function cancelPayment(collectionId: string) {
    if (collectionId == undefined) {
        return false;
    }
    // Get collection info
    const params = {
        Key: { collectionId: { S: collectionId } },
        TableName: Table.Collections.tableName,
    };

    const { Item } = await dynamoDb.getItem(params);

    if (
        !Item ||
        Item.email.S == undefined ||
        Item.name.S == undefined ||
        Item.secretKey.S == undefined
    ) {
        return false;
    }

    // If collectionStatus is not 3 (error), return error
    if (Item.collectionStatus.N != '3') {
        return false;
    }

    // Request payment cancellation to Toss PG
    const url =
        'https://api.tosspayments.com/v1/payments/' +
        Item.paymentKey.S +
        '/cancel';

    let headers = {
        'Content-Type': 'application/json',
        Authorization:
            'Basic ' +
            Buffer.from(Config.TOSS_PAYMENTS_API_KEY + ':').toString('base64'),
    };

    let data = {
        cancelReason: 'user cancelled payment because of error',
    };

    let toss_response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    });

    // If Toss PG returns error, return error
    if (toss_response.status != 200) {
        return false;
    }

    // Cancel payment
    await dynamoDb.updateItem({
        TableName: Table.Collections.tableName,
        Key: { collectionId: { S: collectionId } },
        UpdateExpression: 'set cStatus = :p',
        ExpressionAttributeValues: {
            ':p': { N: '4' },
        },
    });

    // send email
    await sendEmail(
        'paymentCancelled',
        Item.email.S,
        Item.name.S,
        collectionId,
        Item.secretKey.S
    );

    return true;
}