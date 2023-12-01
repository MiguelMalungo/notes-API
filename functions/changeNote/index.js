const AWS = require('aws-sdk');
const response = require('../../responses');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const changeNote = async (event) => {
    const { id, title, text } = JSON.parse(event.body);

    if (!id) {
        return response(400, { message: 'Note ID is required' });
    }

    const params = {
        TableName: 'UserNotes',
        Key: { id },
        UpdateExpression: 'set title = :t, text = :x, modifiedAt = :m',
        ExpressionAttributeValues: {
            ':t': title,
            ':x': text,
            ':m': new Date().toISOString(),
        },
        ReturnValues: 'UPDATED_NEW',
    };

    try {
        await dynamoDb.update(params).promise();
        return { message: 'Success'};
    } catch (error) {
        console.error(error);
        return response(500, { message: 'Could not update the note' });
    }
};

module.exports.handler = changeNote;
