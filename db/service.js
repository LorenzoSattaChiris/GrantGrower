// investor_service.js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = ""

const dynamoDBClient = new DynamoDBClient({ region: process.env.region });
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

module.exports = {

};