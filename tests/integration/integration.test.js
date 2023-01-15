/* eslint-disable */
const { ObjectId } = require('mongodb');
const Message = require('../../src/models/Message');
const { Room, Role } = require('../../src/models/Room');
const dbConnect = require('../../src/db');

jest.setTimeout(30000);

describe('Integration tests', () => {

    beforeAll((done) => {
        if (dbConnect.readyState == 1) {
            done();
        } else {
            dbConnect.on("connected", () => done());
        }
    });

    describe('Message functions integrated with DB', () => {
        let messageId;
        let message;
        let otherMessage;
        const otherMessageId = '637d0c328a43d958f6ff661c';
        const userId = '637d0c328a43d958f6ff661b';
        const otherUserId = '637d0c328a43d958f6ff661f';
        const roomId = '637d0c328a43d958f6ff661a';
        const otherRoomId = '637d0c328a43d958f6ff661d';
        const text = 'test message';

        it('Should INSERT a message correctly', async () => {
            const newMessage = await Message.insert(userId, roomId, text, otherMessageId);
            messageId = newMessage._id;
            expect(newMessage).toBeDefined();
            expect(newMessage.text).toBe(text);
        });

        it('Should INSERT a message with no replyTo correctly', async () => {
            otherMessage = await Message.insert(userId, roomId, text, null);
            expect(otherMessage).toBeDefined();
            expect(otherMessage.text).toBe(text);
        });

        it('Should GETBYID correctly', async () => {
            message = await Message.getById(messageId);
            expect(message.userId.toString()).toBe(userId);
            expect(message.text).toBe(text);
        });

        it('Should GETALLFROMROOMID correctly', async () => {
            const messagesPaginated = await Message.getAllFromRoomId(roomId);
            expect(messagesPaginated.totalElements).toBe(2);
            expect(messagesPaginated.content).toBeArrayOfSize(2);
        });

        it('Should GETALLFROMROOMID correctly, but asking for room with no messages', async () => {
            const messagesPaginated = await Message.getAllFromRoomId(otherRoomId);
            expect(messagesPaginated.totalElements).toBe(0);
            expect(messagesPaginated.content).toBeArrayOfSize(0);
        });

        it('Should ADDTRANSLATIONTEXT correctly', async () => {
            const translatedText = 'nuevo texto de prueba';
            const translatedMessage = await message.addTranslationText(translatedText);
            expect(translatedMessage).toBeDefined();
            expect(translatedMessage.translatedText).toBe(translatedText);
        });

        it('Should UPDATETEXT correctly', async () => {
            const newText = 'new test text';
            expect(message.translatedText).toBeTruthy();
            const updatedMessage = await message.updateText(newText);
            expect(updatedMessage).toBeDefined();
            expect(updatedMessage.text).toBe(newText);
            expect(updatedMessage.translatedText).toBeFalsy();
        });

        it('Should UPDATETEXT correctly with no translation', async () => {
            const newText = 'new test text';
            expect(message.translatedText).toBeFalsy();
            const updatedMessage = await otherMessage.updateText(newText);
            expect(updatedMessage).toBeDefined();
            expect(updatedMessage.text).toBe(newText);
            expect(updatedMessage.translatedText).toBeFalsy();
        });

        it('Should REPORT correctly', async () => {
            const reason = 'test reason';
            const reportedMessage = await message.report(otherUserId, reason);
            expect(reportedMessage.reportedBy).toBeDefined();
            expect(reportedMessage.reportedBy.userId.toString()).toBe(otherUserId);
        });

        it('Should REMOVEREPORT correctly', async () => {
            const noLongerReportedMessage = await message.removeReport();
            expect(noLongerReportedMessage.reportedBy.toObject()).toBeNull();
        });

        it('Should UPDATEREPORT correctly', async () => {
            // report message again
            const reason = 'test reason';
            const reportedMessage = await message.report(otherUserId, reason);
            // update its report
            const bannedMessage = await reportedMessage.updateReport(true)
            expect(reportedMessage.reportedBy).toBeDefined();
            expect(reportedMessage.reportedBy.isBanned).toBe(true);
            message = bannedMessage;
        });

        it('Should UNBAN correctly', async () => {
            const unbannedMessage = await message.unban()
            expect(unbannedMessage.reportedBy).toBeDefined();
            expect(unbannedMessage.reportedBy.isBanned).toBeNull();
        });
    });

    describe('Room functions integrated with DB', () => {
        let roomId;
        let room;
        const name = 'test';
        const description = 'test';
        const songId = '637d0c328a43d958f6ff661a';
        const userId = '637d0c328a43d958f6ff661b';
        const otherUserId = '637d0c328a43d958f6ff661f';
        const otherUserId2 = '637d0c328a43d958f6ff661c';
        const otherUserId3 = '637d0c328a43d958f6ff661d';
        const otherUserId4 = '637d0c328a43d958f6ff661g';
    
        beforeAll((done) => {
            if (dbConnect.readyState == 1) {
                done();
            } else {
                dbConnect.on("connected", () => done());
            }
        });
    
        it('Should INSERT a room correctly', async () => {
            const newRoom = await Room.create({
                name,
                description,
                songId,
                participants: [
                    { userId: ObjectId(userId), role: Role.ADMIN },
                    { userId: ObjectId(otherUserId), role: Role.NORMAL }
                ]
            });
            roomId = newRoom._id;
            expect(newRoom).toBeDefined();
            expect(newRoom.name).toBe(name);
        });
    
        it('Should GETBYID correctly', async () => {
            room = await Room.findById(roomId);
            expect(room.songId.toString()).toBe(songId);
            expect(room.name).toBe(name);
        });
    
        it('Should GETALLFROMUSER correctly', async () => {
            const roomsPaginated = await Room.getAllFromUser(userId);
            expect(roomsPaginated.totalElements).toBe(1);
            expect(roomsPaginated.content).toBeArrayOfSize(1);
        });

        it('Should GETALLFROMROOMID correctly, but asking for user with no rooms', async () => {
            const roomsPaginated = await Room.getAllFromUser(otherUserId2);
            expect(roomsPaginated.totalElements).toBe(0);
            expect(roomsPaginated.content).toBeArrayOfSize(0);
        });

        it('Should MODIFYINFO correctly', async () => {
            const newName = 'new test name';
            const newDescription = 'new test description';
            const modifiedRoom = await room.modifyInfo(newName, newDescription);
            expect(modifiedRoom).toBeDefined();
            expect(modifiedRoom.name).toBe(newName);
            expect(modifiedRoom.description).toBe(newDescription);
        });

        it('Should not MODIFYINFO correctly', async () => {
            const newName = '';
            const newDescription = '';
            const modifiedRoom = await room.modifyInfo(newName, newDescription);
            expect(modifiedRoom).toBeDefined();
            expect(modifiedRoom.name).toBe(modifiedRoom.name);
            expect(modifiedRoom.description).toBe(modifiedRoom.description);
        });

        it('Should ADDPARTICIPANTS correctly', async () => {
            const numOfParticipants = room.participants.length;
            const newParticipantIds = [otherUserId, otherUserId2, otherUserId3];
            const newParticipantsRoom = await room.addParticipants(newParticipantIds);
            expect(newParticipantsRoom).toBeDefined();
            expect(newParticipantsRoom.participants).toBeArrayOfSize(numOfParticipants + 2);
        });

        it('Should DELETEPARTICIPANT correctly', async () => {
            const numOfParticipants = room.participants.length;
            const lessParticipantsRoom = await room.deleteParticipant(otherUserId3);
            expect(lessParticipantsRoom).toBeDefined();
            expect(lessParticipantsRoom.participants).toBeArrayOfSize(numOfParticipants - 1);
        });

        it('Should not DELETEPARTICIPANT if is admin', async () => {
            const numOfParticipants = room.participants.length;
            const sameParticipantsRoom = await room.deleteParticipant(userId);
            expect(sameParticipantsRoom).toBeDefined();
            expect(sameParticipantsRoom.participants).toBeArrayOfSize(numOfParticipants);
        });

        it('Should not DELETEPARTICIPANT if does not exist', async () => {
            const numOfParticipants = room.participants.length;
            const sameParticipantsRoom = await room.deleteParticipant(otherUserId4);
            expect(sameParticipantsRoom).toBeDefined();
            expect(sameParticipantsRoom.participants).toBeArrayOfSize(numOfParticipants);
        });

    });

    afterAll(async () => {
        if (dbConnect.readyState == 1) {
            await dbConnect.dropDatabase();
            await dbConnect.close();
        }
    });

});