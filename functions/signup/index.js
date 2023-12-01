const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const response = require('../../responses'); // Adjust the path according to your project structure

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = 'Users';

const signup = async (event) => {
    const { username, password } = JSON.parse(event.body);

    // Check if the user already exists
    const existingUser = await dynamoDb.get({
        TableName: 'Users',
        Key: { username },
    }).promise();

    if (existingUser.Item) {
        return response(400, { message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = {
        username,
        password: hashedPassword,
    };

    await dynamoDb.put({
        TableName: 'Users',
        Item: newUser,
    }).promise();

    return { message: 'Success'};
};

module.exports.handler = signup;
