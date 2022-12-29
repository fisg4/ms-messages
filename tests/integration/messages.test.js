/* eslint-disable */
const Message = require('../../src/models/Message');
const dbConnect = require('../../src/db');

jest.setTimeout(30000);

describe('Message functions integrated with DB', () => {
    let messageId;
    let message;
    const otherMessageId = '637d0c328a43d958f6ff661c';
    const userId = '637d0c328a43d958f6ff661b';
    const otherUserId = '637d0c328a43d958f6ff661f';
    const roomId = '637d0c328a43d958f6ff661a';
    const otherRoomId = '637d0c328a43d958f6ff661d';
    const text = 'test message';

    beforeAll((done) => {
        if (dbConnect.readyState == 1) {
            done();
        } else {
            dbConnect.on("connected", () => done());
        }
    });

    it('Should INSERT a message correctly', async () => {
        const newMessage = await Message.insert(userId, roomId, text, otherMessageId);
        messageId = newMessage._id;
        expect(newMessage).toBeDefined();
        expect(newMessage.text).toBe(text);
    });

    it('Should GETBYID correctly', async () => {
        message = await Message.getById(messageId);
        expect(message.userId.toString()).toBe(userId);
        expect(message.text).toBe(text);
    });

    it('Should GETALLFROMROOMID correctly', async () => {
        const messagesPaginated = await Message.getAllFromRoomId(roomId);
        expect(messagesPaginated.totalElements).toBe(1);
        expect(messagesPaginated.content).toBeArrayOfSize(1);
    });

    it('Should GETALLFROMROOMID correctly, but asking for room with no messages', async () => {
        const messagesPaginated = await Message.getAllFromRoomId(otherRoomId);
        expect(messagesPaginated.totalElements).toBe(0);
        expect(messagesPaginated.content).toBeArrayOfSize(0);
    });

    it('Should UPDATETEXT correctly', async () => {
        const newText = 'new test text';
        const updatedMessage = await message.updateText(newText);
        expect(updatedMessage).toBeDefined();
        expect(updatedMessage.text).toBe(newText);
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

    afterAll(async () => {
        if (dbConnect.readyState == 1) {
            await dbConnect.dropDatabase();
            await dbConnect.close();
        }
    });
});