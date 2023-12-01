const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const response = require('../../responses'); // Adjust the path according to your project structure

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = 'Users';
const SECRET_KEY = 'secret'; // Make sure to set this in your environment

const login = async (event) => {
    const { username, password } = JSON.parse(event.body);

    // Retrieve user from the database
    const result = await dynamoDb.get({
        TableName: 'Users',
        Key: { username },
    }).promise();

    const user = result.Item;

    if (user && bcrypt.compareSync(password, user.password)) {
        // Create and sign a token
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        return { message: 'Success'};
    }

    return response(401, { message: 'Invalid username or password' });
};

module.exports.handler = login;
