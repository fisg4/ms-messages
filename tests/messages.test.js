/* eslint-disable */ 
const request = require('supertest');

const app = require('../src/app');
const Message = require('../src/models/Message');

const BASEPATH = "/api/v1";

describe('Test messages API', () => {

  describe('GET messages/:id', () => {

    const messageId = 'idtest';
    const message = new Message({
      id: messageId, userId: 'usertest', roomId: 'roomtest', text: 'test'
    });

    const getByIdMock = jest.spyOn(Message, 'getById');
  
    it('Should return OK when searching with an existing id', () => {
      getByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));

      return request(app).get(`${BASEPATH}/messages/${messageId}`).then((response) => {
        console.log(response);
        expect(response.status).toBe(200);
        expect(response.body.content.text).toBe(message.text);
        expect(getByIdMock).toBeCalledWith(messageId);
      });
    });

    it('Should return NOT FOUND when searching with an unexisting id', () => {
      const wrongId = 'wrongId';
      getByIdMock.mockImplementation(async (wrongId) => Promise.resolve(null));

      return request(app).get(`${BASEPATH}/messages/wrongId`).then((response) => {
        console.log(response);
        expect(response.status).toBe(404);
        expect(getByIdMock).toBeCalledWith(wrongId);
      });
    });

    it('Should return SERVER ERROR when problems occur', () => {
      const wrongId = 'wrongId';
      getByIdMock.mockImplementation(async (wrongId) => {
        throw new Error('Server error');
      });

      return request(app).get(`${BASEPATH}/messages/wrongId`).then((response) => {
        console.log(response);
        expect(response.status).toBe(500);
        expect(getByIdMock).toBeCalledWith(wrongId);
      });
    });

  });

});