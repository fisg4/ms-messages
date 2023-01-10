/* eslint-disable */
const { ObjectId } = require('mongodb');
const request = require('supertest');

const app = require('../../src/app');
const Message = require('../../src/models/Message');
const { Room, Role } = require('../../src/models/Room');
const jwt = require('../../src/auth/jwt');

const BASE_PATH = "/api/v1";

describe('Test rooms API', () => {

    /* ======================================= GET Rooms as user ======================================= */

    describe('GET rooms/', () => {

        const roomId1 = 'roomId1';
        const roomId2 = 'roomId2';

        const songId = '637d0c328a43d958f6ff661a';

        const adminId = '637d0c328a43d958f6ff661f';
        const userId = '637d0c328a43d958f6ff661b';
        const token = jwt.generateToken({ id: userId });

        const rooms = [
            new Room({
                id: roomId1,
                name: 'name1',
                description: 'description1',
                songId: ObjectId(songId),
                participants: [
                    { userId: ObjectId(adminId), role: Role.ADMIN },
                    { userId: ObjectId(userId), role: Role.NORMAL }
                ]
            }),
            new Room({
                id: roomId2,
                name: 'name2',
                description: 'description2',
                songId: ObjectId(songId),
                participants: { userId: ObjectId(userId), role: Role.NORMAL }
            })
        ];

        let getAllFromUser;

        beforeEach(() => {
            getAllFromUser = jest.spyOn(Room, 'getAllFromUser');
        });

        it('Should return 200 when getting all the rooms of a certain user', () => {
            getAllFromUser.mockImplementation(async (userId, page = 0, limit = 10) => Promise.resolve(rooms));

            return request(app)
                .get(`${BASE_PATH}/rooms/`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(200);
                    expect(res.headers['content-type']).toContain('json');
                });
        });

        it('Should return 401 when the user is not authenticated', () => {
            getAllFromUser.mockImplementation(async (userId, page = 0, limit = 10) => Promise.resolve(rooms));

            return request(app)
                .get(`${BASE_PATH}/rooms/`)
                .then((res) => {
                    expect(res.status).toBe(401);
                    expect(res.body).toEqual({});
                });
        });

        it('Should return 500 when problems occur', () => {
            const badCall = 'badCall';
            getAllFromUser.mockImplementation(async (badCall) => {
                throw new Error('Server error');
            });

            return request(app)
                .get(`${BASE_PATH}/rooms/`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(500);
                    expect(res.body.success).toBe(false);
                    expect(res.body.content).toBeArrayOfSize(0);
                });
        });

    });

    /* ======================================= GET Room by roomId ======================================= */

    describe('GET rooms/:id', () => {

        const roomId = 'roomId';

        const songId = '637d0c328a43d958f6ff661a';

        const adminId = '637d0c328a43d958f6ff661f';
        const userId = '637d0c328a43d958f6ff661b';
        const token = jwt.generateToken({ id: userId });

        const room = new Room({
            id: roomId,
            name: 'name',
            description: 'description',
            songId: ObjectId(songId),
            participants: [
                { userId: ObjectId(adminId), role: Role.ADMIN },
                { userId: ObjectId(userId), role: Role.NORMAL }
            ]
        });

        let getByIdMock;

        beforeEach(() => {
            getByIdMock = jest.spyOn(Room, 'findById');
        });

        it('Should return 200 when getting the corresponding room by id', () => {
            getByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));

            return request(app)
                .get(`${BASE_PATH}/rooms/${roomId}`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(200);
                    expect(res.body.content.name).toEqual('name');
                    expect(res.body.content.description).toEqual('description');
                    expect(res.body.content.songId).toEqual(songId);
                    expect(res.body.content.participants).toBeArrayOfSize(2);
                });
        });

        it('Should return 401 the user is not authenticated', () => {
            getByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));

            return request(app)
                .get(`${BASE_PATH}/rooms/${roomId}`)
                .then((res) => {
                    expect(res.status).toBe(401);
                    expect(res.body).toEqual({});
                });
        });

        it('Should return 404 when the room with the corresponding id is not found', () => {
            const wrongId = 'wrongId';
            getByIdMock.mockImplementation(async (wrongId) => Promise.resolve(null));

            return request(app)
                .get(`${BASE_PATH}/rooms/wrongId`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(404);
                    expect(getByIdMock).toBeCalledWith(wrongId);
                });
        });

        it('Should return 500 when problems occur', () => {
            const badCall = 'badCall';
            getByIdMock.mockImplementation(async (badCall) => {
                throw new Error('Server error');
            });

            return request(app)
                .get(`${BASE_PATH}/rooms/badCall`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(500);
                    expect(getByIdMock).toBeCalledWith(badCall);
                });
        });

    });

    /* ======================================= POST Room ======================================= */

    describe('POST rooms', () => {

        const roomId = 'roomId';
        const adminId = '637d0c328a43d958f6ff661f';
        const userId = '637d0c328a43d958f6ff661d';
        const songId = '637d0c328a43d958f6ff661a';
        const token = jwt.generateToken({ id: adminId });

        const admin = {
            userId: ObjectId(adminId),
            role: Role.ADMIN
        }

        const user = {
            userId: ObjectId(userId),
            role: Role.ADMIN
        }

        var room = new Room({
            id: roomId,
            name: 'POST room name',
            description: 'POST room description',
            songId: ObjectId(songId),
            participants: [admin, user]
        });

        let create;

        beforeEach(() => {
            create = jest.spyOn(Room, 'create');
        });

        it('Should return 201 when the room is created', () => {
            create.mockImplementation(async () => Promise.resolve(true));

            return request(app)
                .post(`${BASE_PATH}/rooms/`)
                .set('Authorization', `bearer ${token}`)
                .send(room)
                .then((res) => {
                    expect(res.status).toBe(201);
                    expect(res.body.content).toBe(true);
                    expect(res.body.success).toBe(true);
                })
        });

        it('Should return 401 when the user is not authenticated', () => {
            create.mockImplementation(async () => Promise.resolve(true));

            return request(app)
                .post(`${BASE_PATH}/rooms/`)
                .send(room)
                .then((res) => {
                    expect(res.status).toBe(401);
                    expect(res.body.content).toBe(undefined);
                    expect(res.body.success).toBe(undefined);
                })
        });

    });

    /* ======================================= POST participants ======================================= */

    describe("POST rooms/:id/participants'", () => {

        const roomId = 'roomId';
        const adminId = '637d0c328a43d958f6ff661f';
        const userId = '637d0c328a43d958f6ff661d';
        const newUserId = '637d0c328a43d958f6ff661b';
        const songId = '637d0c328a43d958f6ff661a';
        const token = jwt.generateToken({ id: adminId });
        const newUserId2 = '637d0c328a43d958f6ff661c';

        const admin = {
            userId: ObjectId(adminId),
            role: Role.ADMIN
        }

        const user = {
            userId: ObjectId(userId),
            role: Role.ADMIN
        }

        const newUser1 = {
            userId: ObjectId(newUserId),
            role: Role.NORMAL
        }

        const newUser2 = {
            userId: ObjectId(newUserId2),
            role: Role.NORMAL
        }

        var room = new Room({
            id: roomId,
            name: 'POST room name',
            description: 'POST room description',
            songId: ObjectId(songId),
            participants: [admin, user]
        });

        let getByIdMock;
        let addParticipantsMock;

        beforeEach(() => {
            getByIdMock = jest.spyOn(Room, 'findById');
            addParticipantsMock = jest.spyOn(Room.prototype, 'addParticipants');
        });

        it("Should update with new user", () => {
            getByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            addParticipantsMock.mockImplementation(async (newParticipant) => Promise.resolve(newParticipant));

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/participants`)
                .set('Authorization', `bearer ${token}`)
                .send([newUser1, newUser2])
                .then((res) => {
                    expect(res.status).toBe(200);
                    expect(res.headers['content-type']).toContain('json');
                    expect(res.body.success).toBe(true);
                });
        });

        it("Should return 401 when the user is not authenticated", () => {
            getByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            addParticipantsMock.mockImplementation(async (newParticipant) => Promise.resolve(newParticipant));

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/participants`)
                .send([newUser1, newUser2])
                .then((res) => {
                    expect(res.status).toBe(401);
                    expect(res.body).toEqual({});
                });
        });

    });

    /* ======================================= PATCH Room info ======================================= */

    describe("PATCH rooms/:id/info", () => {
        const roomId = 'roomId';
        const adminId = '637d0c328a43d958f6ff661f';
        const userId = '637d0c328a43d958f6ff661d';
        const songId = '637d0c328a43d958f6ff661a';
        const token = jwt.generateToken({ id: adminId });

        const admin = {
            userId: ObjectId(adminId),
            role: Role.ADMIN
        }

        const user = {
            userId: ObjectId(userId),
            role: Role.ADMIN
        }

        var room = new Room({
            id: roomId,
            name: 'POST room name',
            description: 'POST room description',
            songId: ObjectId(songId),
            participants: [admin, user]
        });

        const updatedInfo = {
            name: 'New name'
        }

        let modifyInfo;

        beforeEach(() => {
            modifyInfo = jest.spyOn(Room.prototype, 'modifyInfo');
        });

        it("Should return 200 when modifying the room's info", () => {
            modifyInfo.mockImplementation(async (info) => Promise.resolve(updatedInfo));

            return request(app)
                .patch(`${BASE_PATH}/rooms/${roomId}/info`)
                .set('Authorization', `bearer ${token}`)
                .send(updatedInfo)
                .then((res) => {
                    expect(res.status).toBe(200);
                    expect(res.headers['content-type']).toContain('json');
                    expect(res.body.content).toEqual({ name: 'New name' });

                });
        });

        it("Should return 401 when the user is not authenticated", () => {
            modifyInfo.mockImplementation(async (info) => Promise.resolve(updatedInfo));

            return request(app)
                .patch(`${BASE_PATH}/rooms/${roomId}/info`)
                .send(updatedInfo)
                .then((res) => {
                    expect(res.status).toBe(401);
                    expect(res.body).toEqual({});
                });
        });

    });

    /* ======================================= DELETE Participant ======================================= */

    describe("DELETE rooms/:id/participants/:participantId", () => {
        const roomId = 'roomId';
        const adminId = '637d0c328a43d958f6ff661f';
        const userId = '637d0c328a43d958f6ff661d';
        const songId = '637d0c328a43d958f6ff661a';
        const token = jwt.generateToken({ id: adminId });
        const userToken = jwt.generateToken({ id: userId });

        const admin = {
            userId: ObjectId(adminId),
            role: Role.ADMIN
        }

        const user = {
            userId: ObjectId(userId),
            role: Role.NORMAL
        }

        var room = new Room({
            id: roomId,
            name: 'POST room name',
            description: 'POST room description',
            songId: ObjectId(songId),
            participants: [admin]
        });

        let deleteUserMock;

        beforeEach(() => {
            deleteUserMock = jest.spyOn(Room.prototype, 'deleteParticipant');
        });

        it("Should return 200 when modifying the room's info", () => {
            deleteUserMock.mockImplementation(async (userId) => Promise.resolve(user));

            return request(app)
                .delete(`${BASE_PATH}/rooms/${roomId}/participants/${userId}`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(200);
                    expect(res.body.success).toBe(true);
                    expect(res.body.content.userId).toEqual(userId);

                });
        });

        it("Should return 401 when the user is not authenticated", () => {
            deleteUserMock.mockImplementation(async (userId) => Promise.resolve(user));


            return request(app)
                .delete(`${BASE_PATH}/rooms/${roomId}/participants/${userId}`)
                .then((res) => {
                    expect(res.status).toBe(401);
                    expect(res.body).toEqual({});
                });
        });

    });

});