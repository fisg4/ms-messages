/* eslint-disable */ 
const { ObjectId } = require('mongodb');
const request = require('supertest');

const app = require('../src/app');
const Message = require('../src/models/Message');
const { Room } = require('../src/models/Room');
const supportService = require('../src/services/supportService');
const jwt = require('../src/auth/jwt');

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

    const token = jwt.generateToken({ id: userId });

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
              .set('Authorization', `bearer ${token}`)
              .send({ text: newText })
              .then((response) => {
                expect(response.status).toBe(200);
                expect(response.body.content.text).toBe(newText);
                expect(updateTextMock).toBeCalledWith(newText);
                expect(getByIdMock).toBeCalledWith(messageId);
              });
    });

    it('Should return UNAUTHORIZED when there is not the required header', () => {
      getByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));      

      return request(app)
              .patch(`${BASEPATH}/messages/${messageId}`)
              .send({ text: newText })
              .then((response) => {
                expect(response.status).toBe(401);
                expect(getByIdMock).toBeCalledWith(messageId);
              });
    });

    it('Should return BAD REQUEST when new text is empty', () => {
      const emptyText = '';
      getByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));
      updateTextMock.mockImplementation(async (emptyText) => Promise.reject({ errors: 'error'}));

      return request(app)
              .patch(`${BASEPATH}/messages/${messageId}`)
              .set('Authorization', `bearer ${token}`)
              .send({ text: emptyText })
              .then((response) => {
                expect(response.status).toBe(400);
                expect(getByIdMock).toBeCalledWith(messageId);
              });
    });

    it('Should return FORBIDDEN when the user is not the author', () => {
      getByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));      

      return request(app)
              .patch(`${BASEPATH}/messages/${messageId}`)
              .set('Authorization', `bearer ${jwt.generateToken({ id: 'wrongId' })}`)
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
              .set('Authorization', `bearer ${token}`)
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
              .set('Authorization', `bearer ${token}`)
              .send({ text: newText })
              .then((response) => {
                expect(response.status).toBe(500);
                expect(getByIdMock).toBeCalledWith(messageId);
              });
    });
  });

  describe('POST messages/:id/report', () => {
    const messageId = 'idtest';
    const roomId = '637d0c328a43d958f6ff661d';
    const reason = 'reason test';
    const userId = '637d0c328a43d958f6ff661f';

    const token = jwt.generateToken({ id: userId });

    var getMessageByIdMock;
    var getRoomByIdMock;
    var checkUserIsParticipantMock;
    var reportMock;
    var sendReportMock;
    var removeReportMock;

    const room = new Room({ roomId });
    const message = new Message({
      id: messageId, userId: ObjectId(userId), roomId, text: 'test text'
    });
    const reportedMessage = new Message({
      id: messageId, userId: ObjectId(userId), roomId, text: 'test text', reportedBy: { userId, reason }
    });

    beforeEach(() => {
      getMessageByIdMock = jest.spyOn(Message, 'getById');
      getRoomByIdMock = jest.spyOn(Room, 'findById');
      checkUserIsParticipantMock = jest.spyOn(Room.prototype, 'checkUserIsParticipant');
      reportMock = jest.spyOn(Message.prototype, 'report');
      sendReportMock = jest.spyOn(supportService, 'sendReport');
      removeReportMock = jest.spyOn(Message.prototype, 'removeReport');
    });

    it('Should return OK when reporting', () => {
      getMessageByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));
      getRoomByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
      reportMock.mockImplementation(async (userId, reason) => Promise.resolve(reportedMessage));
      checkUserIsParticipantMock.mockImplementation((userId) => true);
      sendReportMock.mockImplementation(async (userId, messageId, reason) => Promise.resolve(true));
      removeReportMock.mockImplementation(async () => Promise.resolve(message));

      return request(app)
              .post(`${BASEPATH}/messages/${messageId}/report`)
              .set('Authorization', `bearer ${token}`)
              .send({ reason })
              .then((response) => {
                expect(response.status).toBe(201);
                expect(response.body.content.reportedBy.userId).toBe(userId);
                expect(reportMock).toBeCalledWith(userId, reason);
                expect(getMessageByIdMock).toBeCalledWith(messageId);
              });
    });

    it('Should return UNAUTHORIZED when user is not sent', () => {

      return request(app)
              .post(`${BASEPATH}/messages/${messageId}/report`)
              .send({ reason })
              .then((response) => {
                expect(response.status).toBe(401);
              });
    });

    it('Should return BAD REQUEST when reason is empty', () => {

      return request(app)
              .post(`${BASEPATH}/messages/${messageId}/report`)
              .set('Authorization', `bearer ${token}`)
              .send({ reason: '' })
              .then((response) => {
                expect(response.status).toBe(400);
              });
    });

    it('Should return BAD REQUEST when the message is already reported', () => {
      const reportedBy = { userId: 'pepe' };
      getMessageByIdMock.mockImplementation(async (messageId) => Promise.resolve({ ...message, reportedBy }));

      return request(app)
              .post(`${BASEPATH}/messages/${messageId}/report`)
              .set('Authorization', `bearer ${token}`)
              .send({ reason })
              .then((response) => {
                expect(response.status).toBe(400);
              });
    });

    it('Should return BAD REQUEST when the validation fails', () => {
      getMessageByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));
      getRoomByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
      reportMock.mockImplementation(async (userId, reason) => Promise.reject({ errors: 'Bad user id' }));
      checkUserIsParticipantMock.mockImplementation((userId) => true);

      return request(app)
              .post(`${BASEPATH}/messages/${messageId}/report`)
              .set('Authorization', `bearer ${jwt.generateToken({ id: 'badUserId' })}`)
              .send({ reason })
              .then((response) => {
                expect(response.status).toBe(400);
              });
    });

    it('Should return FORBIDDEN when the reporter is not in the room', () => {
      getMessageByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));
      getRoomByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
      checkUserIsParticipantMock.mockImplementation((userId) => false);

      return request(app)
              .post(`${BASEPATH}/messages/${messageId}/report`)
              .set('Authorization', `bearer ${token}`)
              .send({ reason })
              .then((response) => {
                expect(response.status).toBe(403);
              });
    });

    it('Should return NOT FOUND when there is no message', () => {
      const wrongMessageId = 'wrongMessageId';
      getMessageByIdMock.mockImplementation(async (wrongMessageId) => Promise.resolve(null));

      return request(app)
              .post(`${BASEPATH}/messages/${messageId}/report`)
              .set('Authorization', `bearer ${token}`)
              .send({ reason })
              .then((response) => {
                expect(response.status).toBe(404);
              });
    });

    it('Should return ERROR when there are problems with support service', () => {
      getMessageByIdMock.mockImplementation(async (messageId) => Promise.resolve(message));
      getRoomByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
      reportMock.mockImplementation(async (userId, reason) => Promise.resolve(reportedMessage));
      checkUserIsParticipantMock.mockImplementation((userId) => true);
      sendReportMock.mockImplementation(async (userId, messageId, reason) => Promise.resolve(false));

      return request(app)
              .post(`${BASEPATH}/messages/${messageId}/report`)
              .set('Authorization', `bearer ${token}`)
              .send({ reason })
              .then((response) => {
                expect(response.status).toBe(500);
              });
    });

    it('Should return ERROR when exception occurs', () => {
      getMessageByIdMock.mockImplementation(async (messageId) => {
        throw new Error('error');
      });

      return request(app)
              .post(`${BASEPATH}/messages/${messageId}/report`)
              .set('Authorization', `bearer ${token}`)
              .send({ reason })
              .then((response) => {
                expect(response.status).toBe(500);
              });
    });

  });

});