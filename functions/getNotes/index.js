const AWS = require('aws-sdk');
const response = require('../../responses');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getNotes = async (event) => {
    const { userId } = event.queryStringParameters;

    if (!userId) {
        return response(400, { message: 'userId is required' });
    }

    const params = {
        TableName: process.env.NOTES_TABLE,
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
    };

    try {
        const data = await dynamoDb.scan(params).promise();
        return response(200, { notes: data.Items });
    } catch (error) {
        console.error(error);
        return response(500, { message: 'Could not retrieve notes' });
    }
};

module.exports.handler = getNotes;
