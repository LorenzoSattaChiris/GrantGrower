const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const dotenv = require('dotenv');

dotenv.config();

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    endpoint: process.env.AWS_ENDPOINT
});

const dynamoDB = DynamoDBDocumentClient.from(client);

module.exports = dynamoDB;