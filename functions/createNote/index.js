const AWS = require('aws-sdk');
const response = require('../../responses');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const createNote = async (event) => {
    const { title, text } = JSON.parse(event.body);

    if (!title || !text) {
        return response(400, { message: 'Title and text are required' });
    }

    const now = new Date().toISOString();
    const noteId = `${new Date().getTime()}`; // Generate ID based on the current timestamp

    const params = {
        TableName: process.env.NOTES_TABLE,
        Item: {
            id: noteId,
            title: title.substring(0, 50), // Ensure title is within the character limit
            text: text.substring(0, 300),  // Ensure text is within the character limit
            createdAt: now,
            modifiedAt: now,
        },
    };

    try {
        await dynamoDb.put(params).promise();
        return response(200, { message: 'Note saved successfully', note: params.Item });
    } catch (error) {
        console.error(error);
        return response(500, { message: 'Could not save the note' });
    }
};

module.exports.handler = createNote;
