/* eslint-disable */
const { ObjectId } = require('mongodb');
const { Room, Role } = require('../../src/models/Room');

describe('Test Room model functions', () => {
  const adminId = '637d0c328a43d958f6ff661f';
  const userId = '637d0c328a43d958f6ff661b';
  const notUserId = '637d0c328a43d958f6ff661c';

  const room = new Room({
    id: 'id',
    name: 'name',
    description: 'description',
    songId: ObjectId('637d0c328a43d958f6ff661a'),
    participants: [
      { userId: ObjectId(adminId), role: Role.ADMIN },
      { userId: ObjectId(userId), role: Role.NORMAL }
    ]
  });

  describe('checkUserIsParticipant', () => {
    it('Should return true when user is a participant and false otherwise', () => {
      expect(room.checkUserIsParticipant(adminId)).toBe(true);
      expect(room.checkUserIsParticipant(userId)).toBe(true);
      expect(room.checkUserIsParticipant(notUserId)).toBe(false);
    });
  });

  describe('checkUserIsParticipant', () => {
    it('Should return true when user is the admin and false otherwise', () => {
      expect(room.checkUserIsAdmin(adminId)).toBe(true);
      expect(room.checkUserIsAdmin(userId)).toBe(false);
      expect(room.checkUserIsAdmin(notUserId)).toBe(false);
    });
  });

});