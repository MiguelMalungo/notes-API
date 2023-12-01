const AWS = require('aws-sdk');
const response = require('../../responses');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getNotes = async (event) => {
    const { username } = event.queryStringParameters;

    if (!username) {
        return response(400, { message: 'username is required' });
    }

    const params = {
        TableName: 'UserNotes',
        FilterExpression: 'username = :username',
        ExpressionAttributeValues: { ':username': username },
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
