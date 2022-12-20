/* eslint-disable */ 
const { ObjectId } = require('mongodb');
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

    var getByIdMock;

    beforeEach(() => {
      getByIdMock = jest.spyOn(Message, 'getById');
    });
  
    it('Should return OK when searching with an existing id', () => {
      getByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));

      return request(app).get(`${BASEPATH}/messages/${messageId}`).then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.content.text).toBe(message.text);
        expect(getByIdMock).toBeCalledWith(messageId);
      });
    });

    it('Should return NOT FOUND when searching with an unexisting id', () => {
      const wrongId = 'wrongId';
      getByIdMock.mockImplementation(async (wrongId) => Promise.resolve(null));

      return request(app).get(`${BASEPATH}/messages/wrongId`).then((response) => {
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
        expect(response.status).toBe(500);
        expect(getByIdMock).toBeCalledWith(wrongId);
      });
    });

  });

  describe('PATCH messages/:id', () => {
    const messageId = 'idtest';
    const newText = 'updated test text';
    const userId = '637d0c328a43d958f6ff661f';

    var getByIdMock;
    var updateTextMock;

    const message = new Message({
      id: messageId, userId: ObjectId(userId), roomId: 'roomtest', text: 'test text'
    });
    const updatedMessage = new Message({
      id: messageId, userId: ObjectId(userId), roomId: 'roomtest', text: newText
    });

    beforeEach(() => {
      getByIdMock = jest.spyOn(Message, 'getById');
      updateTextMock = jest.spyOn(Message.prototype, 'updateText');
    });

    it('Should return OK when updating', () => {
      getByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));
      updateTextMock.mockImplementation(async (newText) => Promise.resolve(updatedMessage));

      return request(app)
              .patch(`${BASEPATH}/messages/${messageId}`)
              .set('userId', userId)
              .send({ text: newText })
              .then((response) => {
                expect(response.status).toBe(200);
                expect(response.body.content.text).toBe(newText);
                expect(updateTextMock).toBeCalledWith(newText);
                expect(getByIdMock).toBeCalledWith(messageId);
              });
    });

    it('Should return BAD REQUEST when there is not the required header', () => {
      getByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));      

      return request(app)
              .patch(`${BASEPATH}/messages/${messageId}`)
              .send({ text: newText })
              .then((response) => {
                expect(response.status).toBe(400);
                expect(getByIdMock).toBeCalledWith(messageId);
              });
    });

    it('Should return BAD REQUEST when new text is empty', () => {
      getByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));
      updateTextMock.mockImplementation(async (undefined) => Promise.reject({ errors: 'error'}));

      return request(app)
              .patch(`${BASEPATH}/messages/${messageId}`)
              .send({ text: newText })
              .then((response) => {
                expect(response.status).toBe(400);
                expect(getByIdMock).toBeCalledWith(messageId);
              });
    });

    it('Should return FORBIDDEN when the user is not the author', () => {
      getByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));      

      return request(app)
              .patch(`${BASEPATH}/messages/${messageId}`)
              .set('userId', 'wrongUserId')
              .send({ text: newText })
              .then((response) => {
                expect(response.status).toBe(403);
                expect(getByIdMock).toBeCalledWith(messageId);
              });
    });

    it('Should return NOT FOUND when searching with an unexisting id', () => {
      const wrongId = 'wrongId';
      getByIdMock.mockImplementation(async (wrongId) => Promise.resolve(null));

      return request(app)
              .patch(`${BASEPATH}/messages/${messageId}`)
              .set('userId', userId)
              .send({ text: newText })
              .then((response) => {
                expect(response.status).toBe(404);
                expect(getByIdMock).toBeCalledWith(wrongId);
              });
    });

    it('Should return SERVER ERROR when problems occur', () => {
      getByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));
      updateTextMock.mockImplementation(async (newText) => {
        throw new Error('Server error');
      });

      return request(app)
              .patch(`${BASEPATH}/messages/${messageId}`)
              .set('userId', userId)
              .send({ text: newText })
              .then((response) => {
                expect(response.status).toBe(500);
                expect(getByIdMock).toBeCalledWith(messageId);
              });
    });
  });

});