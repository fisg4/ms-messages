/* eslint-disable */
const supportService = require('../src/services/supportService');
const translateService = require('../src/services/translateService');
const jwt = require('../src/auth/jwt');
const { Translator } = require('deepl-node');
const axios = require('axios');

describe('Test SupportService functions', () => {
  let axiosPostMock;
  const messageId = 'idtest';
  const reason = 'reason';
  const userId = '637d0c328a43d958f6ff661f';
  const token = 'Bearer ' + jwt.generateToken({ id: userId });

  beforeEach(() => {
    axiosPostMock = jest.spyOn(axios, 'post');
  });

  it('Should return true if everything is working', async () => {
    axiosPostMock.mockImplementation(async () => Promise.resolve({ status: 201}));

    const result = await supportService.sendReport(token, messageId, reason);
    expect(result).toBe(true);
  });

  it('Should return false when sending the response from the other service is not 201', async () => {
    axiosPostMock.mockImplementation(async () => Promise.resolve({ status: 500}));

    const result = await supportService.sendReport(token, messageId, '');
    expect(result).toBe(false);
  });

  it('Should return false when exception occurs', async () => {
    axiosPostMock.mockImplementation(async () => Promise.reject(null));

    const result = await supportService.sendReport(token, messageId, reason);
    expect(result).toBe(false);
  });
});

describe('Test TranslateService functions', () => {
  let translateMock;

  beforeEach(() => {
    translateMock = jest.spyOn(Translator.prototype, 'translateText');
  });

  it('Should return the text translated', async () => {
    const text = 'test text';
    const translation = {text: 'texto de prueba'};
    translateMock.mockImplementation(async (text) => Promise.resolve(translation));

    const result = await translateService.translate(text);
    expect(result).toBe(translation.text);
  });
});
