import * as AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service'
import { env } from '~/env.mjs';

AWS.config.update({
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
    sessionToken: env.SESSION_TOKEN,
});

let serviceConfigOptions: ServiceConfigurationOptions = {
    region: env.REGION,
    endpoint: env.ENDPOINT
}

const dynamodb = new AWS.DynamoDB(serviceConfigOptions);
const docClient = new AWS.DynamoDB.DocumentClient(serviceConfigOptions);

export { dynamodb, docClient };