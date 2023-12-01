const AWS = require('aws-sdk');
const response = require('../../responses');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const deleteNote = async (event) => {
    const { id } = JSON.parse(event.body);

    if (!id) {
        return response(400, { message: 'Note ID is required' });
    }

    const params = {
        TableName: 'UserNotes',
        Key: { id },
    };

    try {
        await dynamoDb.delete(params).promise();
        return { message: 'Success'};
    } catch (error) {
        console.error(error);
        return response(500, { message: 'Could not delete the note' });
    }
};

module.exports.handler = deleteNote;
