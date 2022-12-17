const urlJoin = require('url-join');
const axios = require('axios');

const HOST = process.env.SUPPORT_HOST || 'http://localhost:3002';
const ENDPOINT = '/support/v1';
const ROUTE = '/reports';

const sendReport = async (authorId, messageId, reason) => {
  const url = urlJoin(HOST, ENDPOINT, ROUTE);
  const body = {
    authorId,
    messageId,
    title: `Report of message ${messageId}`,
    text: reason
  };

  try {
    const response = await axios.post(url, body);
    return response.status === 201;
  } catch (err) {
    return false;
  }
};

module.exports = { sendReport };
