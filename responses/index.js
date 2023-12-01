const response = (statusCode, message) => ({
    statusCode: statusCode,
    body: JSON.stringify(message),
  });
  
  module.exports = {
    response,
  };
  