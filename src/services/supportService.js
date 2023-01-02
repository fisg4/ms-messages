const urlJoin = require('url-join');
const axios = require('axios');
const { decodeToken } = require('../auth/jwt');

const HOST = process.env.SUPPORT_HOST || 'http://localhost:3002';
const ENDPOINT = '/support/v1';
const ROUTE = '/reports';

const sendReport = async (token, messageId, reason) => {
  const authorId = decodeToken(token).id;

  const url = urlJoin(HOST, ENDPOINT, ROUTE);
  const body = {
    authorId,
    messageId,
    title: `Report of message ${messageId}`,
    text: reason
  };
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.status === 201;
  } catch (err) {
    return false;
  }
};

module.exports = { sendReport };
