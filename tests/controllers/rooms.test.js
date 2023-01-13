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

    describe('GET /rooms', () => {

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

    describe('GET /rooms/:id', () => {

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

        it('Should return 403 the user is not a participant', () => {
            getByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            const token = jwt.generateToken({ id: 'wrongId' })

            return request(app)
                .get(`${BASE_PATH}/rooms/${roomId}`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(403);
                    expect(res.body.success).toEqual(false);
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

    describe('POST /rooms', () => {

        const roomId = 'roomId';
        const adminId = '637d0c328a43d958f6ff661f';
        const userId = '637d0c328a43d958f6ff661d';
        const songId = '637d0c328a43d958f6ff661a';
        const token = jwt.generateToken({ id: adminId });

        var room = new Room({
            id: roomId,
            name: 'POST room name',
            description: 'POST room description',
            songId: ObjectId(songId),
            participants: [userId]
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

        it('Should return 400 when the body is wrong', () => {
            create.mockImplementation(async () => Promise.reject({ errors: 'errors'}));

            return request(app)
                .post(`${BASE_PATH}/rooms/`)
                .set('Authorization', `bearer ${token}`)
                .send({ ... room, songId: '' })
                .then((res) => {
                    expect(res.status).toBe(400);
                    expect(res.body.success).toBe(false);
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

        it('Should return 500 an error occurs', () => {
            create.mockImplementation(async () => Promise.reject({}));

            return request(app)
                .post(`${BASE_PATH}/rooms/`)
                .set('Authorization', `bearer ${token}`)
                .send(room)
                .then((res) => {
                    expect(res.status).toBe(500);
                    expect(res.body.success).toBe(false);
                })
        });

    });

    /* ======================================= DELETE Room ======================================= */

    describe('DELETE /rooms', () => {

        const roomId = 'roomId';
        const adminId = '637d0c328a43d958f6ff661f';
        const userId = '637d0c328a43d958f6ff661d';
        const songId = '637d0c328a43d958f6ff661a';
        const token = jwt.generateToken({ id: adminId });

        var room = new Room({
            id: roomId,
            name: 'POST room name',
            description: 'POST room description',
            songId: ObjectId(songId),
            participants: [
                { userId: ObjectId(adminId), role: Role.ADMIN },
                { userId: ObjectId(userId), role: Role.NORMAL }
            ]
        });

        let findByIdMock;
        let findByIdAndDeleteMock;

        beforeEach(() => {
            findByIdMock = jest.spyOn(Room, 'findById');
            findByIdAndDeleteMock = jest.spyOn(Room, 'findByIdAndDelete');
        });

        it('Should return 204 when the room is deleted', () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            findByIdAndDeleteMock.mockImplementation(async (roomId) => Promise.resolve(true));

            return request(app)
                .delete(`${BASE_PATH}/rooms/${roomId}`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(204);
                });
        });

        it('Should return 403 when the user is not the room\'s admin', () => {
            const token = jwt.generateToken({ id: userId })
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));

            return request(app)
                .delete(`${BASE_PATH}/rooms/${roomId}`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(403);
                    expect(res.body.success).toBe(false);
                })
        });

        it('Should return 404 when the room does not exist', () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(false));

            return request(app)
                .delete(`${BASE_PATH}/rooms/${roomId}`)
                .set('Authorization', `bearer ${token}`)
                .send(room)
                .then((res) => {
                    expect(res.status).toBe(404);
                    expect(res.body.success).toBe(false);
                })
        });

        it('Should return 500 when an error occurs', () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            findByIdAndDeleteMock.mockImplementation(async (roomId) => Promise.reject({}));

            return request(app)
                .delete(`${BASE_PATH}/rooms/${roomId}`)
                .set('Authorization', `bearer ${token}`)
                .send(room)
                .then((res) => {
                    expect(res.status).toBe(500);
                    expect(res.body.success).toBe(false);
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
            const newParticipants = [newUserId, newUserId2]
            getByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            addParticipantsMock.mockImplementation(async (newParticipants) => Promise.resolve({ ...room, participants: [...newParticipants ]}));

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/participants`)
                .set('Authorization', `bearer ${token}`)
                .send({ participants: newParticipants })
                .then((res) => {
                    expect(res.status).toBe(200);
                    expect(res.body.success).toBe(true);
                });
        });

        it("Should return 400 when data sent is wrong", () => {
            const newParticipant = ['wrongId']
            getByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            addParticipantsMock.mockImplementation(async (newParticipant) => Promise.reject({ errors: 'err' }));

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/participants`)
                .set('Authorization', `bearer ${token}`)
                .send({ participants: newParticipant })
                .then((res) => {
                    expect(res.status).toBe(400);
                    expect(res.body.success).toBe(false);
                });
        });

        it("Should return 401 when the user is not authenticated", () => {
            getByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            addParticipantsMock.mockImplementation(async (newParticipant) => Promise.resolve(newParticipant));

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/participants`)
                .send({ participants: [newUserId, newUserId2] })
                .then((res) => {
                    expect(res.status).toBe(401);
                    expect(res.body).toEqual({});
                });
        });

        it("Should return 403 when the user is not the room\'s admin", () => {
            const token = jwt.generateToken({ id: userId })
            getByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/participants`)
                .set('Authorization', `bearer ${token}`)
                .send({ participants: [newUserId, newUserId2] })
                .then((res) => {
                    expect(res.status).toBe(403);
                    expect(res.body.success).toEqual(false);
                });
        });

        it("Should return 404 when the room does not exists", () => {
            getByIdMock.mockImplementation(async (roomId) => Promise.resolve(false));

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/participants`)
                .set('Authorization', `bearer ${token}`)
                .send({ participants: [newUserId, newUserId2] })
                .then((res) => {
                    expect(res.status).toBe(404);
                    expect(res.body.success).toEqual(false);
                });
        });

        it("Should return 500 when an error occurs", () => {
            getByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            addParticipantsMock.mockImplementation(async (newParticipant) => Promise.reject({}));

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/participants`)
                .set('Authorization', `bearer ${token}`)
                .send({ participants: [newUserId, newUserId2] })
                .then((res) => {
                    expect(res.status).toBe(500);
                    expect(res.body.success).toBe(false);
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
            role: Role.NORMAL
        }

        var room = new Room({
            id: roomId,
            name: 'POST room name',
            description: 'POST room description',
            songId: ObjectId(songId),
            participants: [admin, user]
        });

        const [ name, description ] = [ 'name', 'description' ];

        let findByIdMock;
        let modifyInfoMock;

        beforeEach(() => {
            findByIdMock = jest.spyOn(Room, 'findById');
            modifyInfoMock = jest.spyOn(Room.prototype, 'modifyInfo');
        });

        it("Should return 200 when modifying the room's info", () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room))
            modifyInfoMock.mockImplementation(async (name, description) => Promise.resolve({ ...room, name, description }));

            return request(app)
                .patch(`${BASE_PATH}/rooms/${roomId}/info`)
                .set('Authorization', `bearer ${token}`)
                .send({ name, description })
                .then((res) => {
                    expect(res.status).toBe(200);
                    expect(res.body.content.name).toEqual(name);
                    expect(res.body.content.description).toEqual(description);
                });
        });

        it("Should return 400 when data sent is wrong", () => {
            const description = '';
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room))
            modifyInfoMock.mockImplementation(async (name, description) => Promise.reject({ errors: 'err' }));

            return request(app)
                .patch(`${BASE_PATH}/rooms/${roomId}/info`)
                .set('Authorization', `bearer ${token}`)
                .send({ name, description })
                .then((res) => {
                    expect(res.status).toBe(400);
                    expect(res.body.success).toBe(false);
                });
        });

        it("Should return 401 when the user is not authenticated", () => {
            modifyInfoMock.mockImplementation(async (info) => Promise.resolve(updatedInfo));

            return request(app)
                .patch(`${BASE_PATH}/rooms/${roomId}/info`)
                .send({ name, description })
                .then((res) => {
                    expect(res.status).toBe(401);
                    expect(res.body).toEqual({});
                });
        });

        it("Should return 403 when the user is not room's admin", () => {
            const token = jwt.generateToken({ id: '1234'})
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room))

            return request(app)
                .patch(`${BASE_PATH}/rooms/${roomId}/info`)
                .set('Authorization', `bearer ${token}`)
                .send({ name, description })
                .then((res) => {
                    expect(res.status).toBe(403);
                    expect(res.body.success).toBe(false);
                });
        });

        it("Should return 404 when room does not exist", () => {
            const description = '';
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(false))

            return request(app)
                .patch(`${BASE_PATH}/rooms/${roomId}/info`)
                .set('Authorization', `bearer ${token}`)
                .send({ name, description })
                .then((res) => {
                    expect(res.status).toBe(404);
                    expect(res.body.success).toBe(false);
                });
        });

        it("Should return 500 when data sent is wrong", () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room))
            modifyInfoMock.mockImplementation(async (name, description) => Promise.reject({}));

            return request(app)
                .patch(`${BASE_PATH}/rooms/${roomId}/info`)
                .set('Authorization', `bearer ${token}`)
                .send({ name, description })
                .then((res) => {
                    expect(res.status).toBe(500);
                    expect(res.body.success).toBe(false);
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

        let findByIdMock;
        let deleteUserMock;

        beforeEach(() => {
            findByIdMock = jest.spyOn(Room, 'findById');
            deleteUserMock = jest.spyOn(Room.prototype, 'deleteParticipant');
        });

        it("Should return 200 when removing participant from room", () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            deleteUserMock.mockImplementation(async (userId) => Promise.resolve(room));

            return request(app)
                .delete(`${BASE_PATH}/rooms/${roomId}/participants/${userId}`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(200);
                    expect(res.body.success).toBe(true);

                });
        });

        it("Should return 400 when data is sent wrong", () => {
            const wrongUserId = "wrongUserId";
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            deleteUserMock.mockImplementation(async (wrongUserId) => Promise.reject({ errors: 'err'}));

            return request(app)
                .delete(`${BASE_PATH}/rooms/${roomId}/participants/${wrongUserId}`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(400);
                    expect(res.body.success).toBe(false);

                });
        });

        it("Should return 401 when the user is not authenticated", () => {

            return request(app)
                .delete(`${BASE_PATH}/rooms/${roomId}/participants/${userId}`)
                .then((res) => {
                    expect(res.status).toBe(401);
                    expect(res.body).toEqual({});
                });
        });

        it("Should return 403 when user is not room\'s admin", () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));

            return request(app)
                .delete(`${BASE_PATH}/rooms/${roomId}/participants/${userId}`)
                .set('Authorization', `bearer ${userToken}`)
                .then((res) => {
                    expect(res.status).toBe(403);
                    expect(res.body.success).toBe(false);

                });
        });

        it("Should return 404 when the room does not exist", () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(false));

            return request(app)
                .delete(`${BASE_PATH}/rooms/${roomId}/participants/${userId}`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(404);
                    expect(res.body.success).toBe(false);

                });
        });

        it("Should return 500 when an error occurs", () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            deleteUserMock.mockImplementation(async (userId) => Promise.reject({}));

            return request(app)
                .delete(`${BASE_PATH}/rooms/${roomId}/participants/${userId}`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(500);
                    expect(res.body.success).toBe(false);

                });
        });

    });

    /* ======================================= GET Room messages ======================================= */

    describe('GET /rooms/:id/messages', () => {

        const roomId = '637d0c328a43d958f6ff661c';
        
        const messageId = 'msgId';
        const songId = '637d0c328a43d958f6ff661a';

        const adminId = '637d0c328a43d958f6ff661f';
        const userId = '637d0c328a43d958f6ff661b';
        const token = jwt.generateToken({ id: userId });

        const room = new Room({
            id: ObjectId(roomId),
            name: 'name1',
            description: 'description1',
            songId: ObjectId(songId),
            participants: [
                { userId: ObjectId(adminId), role: Role.ADMIN },
                { userId: ObjectId(userId), role: Role.NORMAL }
            ]
        });

        const messages = [
            new Message({
                id: messageId, userId: ObjectId(userId), roomId: ObjectId(roomId), text: 'test text'
            })
        ]

        let findByIdMock;
        let getAllFromRoomIdMock;

        beforeEach(() => {
            findByIdMock = jest.spyOn(Room, 'findById');
            getAllFromRoomIdMock = jest.spyOn(Message, 'getAllFromRoomId');
        });

        it('Should return 200 when getting all the messages of the room', () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            getAllFromRoomIdMock.mockImplementation(async (userId, page = 0, limit = 10) => Promise.resolve({ content: messages }));

            return request(app)
                .get(`${BASE_PATH}/rooms/${roomId}/messages`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).toBe(200);
                    expect(res.body.content).toBeArrayOfSize(1);
                });
        });

        it('Should return 401 when the user is not authenticated', () => {

            return request(app)
                .get(`${BASE_PATH}/rooms/${roomId}/messages`)
                .then((res) => {
                    expect(res.status).toBe(401);
                });
        });

        it('Should return 403 when user is not a room\'s participant', () => {
            const token = jwt.generateToken({ id: '1234' })
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));

            return request(app)
                .get(`${BASE_PATH}/rooms/${roomId}/messages`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(403);
                    expect(res.body.success).toBe(false);
                });
        });

        it('Should return 404 when room does not exist', () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(false));

            return request(app)
                .get(`${BASE_PATH}/rooms/${roomId}/messages`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(404);
                    expect(res.body.success).toBe(false);
                });
        });

        it('Should return 500 when problems occur', () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            getAllFromRoomIdMock.mockImplementation(async (userId, page = 0, limit = 10) => {
                throw new Error('Server error');
            });

            return request(app)
                .get(`${BASE_PATH}/rooms/${roomId}/messages`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(500);
                    expect(res.body.success).toBe(false);
                });
        });

    });

    /* ======================================= GET New message in room ======================================= */

    describe('POST /rooms/:id/messages', () => {

        const roomId = '637d0c328a43d958f6ff661c';
        
        const messageId = 'msgId';
        const songId = '637d0c328a43d958f6ff661a';

        const adminId = '637d0c328a43d958f6ff661f';
        const userId = '637d0c328a43d958f6ff661b';
        const token = jwt.generateToken({ id: userId });

        const room = new Room({
            id: ObjectId(roomId),
            name: 'name1',
            description: 'description1',
            songId: ObjectId(songId),
            participants: [
                { userId: ObjectId(adminId), role: Role.ADMIN },
                { userId: ObjectId(userId), role: Role.NORMAL }
            ]
        });

        const message = new Message({ id: messageId, userId: ObjectId(userId), roomId: ObjectId(roomId), text: 'test text' })

        let findByIdMock;
        let insertMessageMock;

        beforeEach(() => {
            findByIdMock = jest.spyOn(Room, 'findById');
            insertMessageMock = jest.spyOn(Message, 'insert');
        });

        it('Should return 201 when creating new message in room', () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            insertMessageMock.mockImplementation(async (userId, roomId, text) => Promise.resolve(message));

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/messages`)
                .set('Authorization', `bearer ${token}`)
                .send({ text: 'test' })
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).toBe(201);
                    expect(res.body.success).toBe(true);
                });
        });

        it('Should return 400 when getting all the messages of the room', () => {
            const badText = ''
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            insertMessageMock.mockImplementation(async (userId, roomId, badText) => Promise.reject({ errors: 'err'}));

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/messages`)
                .set('Authorization', `bearer ${token}`)
                .send({ text: badText })
                .then((res) => {
                    console.log(res.body);
                    expect(res.status).toBe(400);
                    expect(res.body.success).toBe(false);
                });
        });

        it('Should return 401 when the user is not authenticated', () => {

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/messages`)
                .then((res) => {
                    expect(res.status).toBe(401);
                });
        });

        it('Should return 403 when user is not a room\'s participant', () => {
            const token = jwt.generateToken({ id: '1234' })
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/messages`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(403);
                    expect(res.body.success).toBe(false);
                });
        });

        it('Should return 404 when room does not exist', () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(false));

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/messages`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(404);
                    expect(res.body.success).toBe(false);
                });
        });

        it('Should return 500 when problems occur', () => {
            findByIdMock.mockImplementation(async (roomId) => Promise.resolve(room));
            insertMessageMock.mockImplementation(async (userId, roomId, badText) => {
                throw new Error('Server error');
            });

            return request(app)
                .post(`${BASE_PATH}/rooms/${roomId}/messages`)
                .set('Authorization', `bearer ${token}`)
                .then((res) => {
                    expect(res.status).toBe(500);
                    expect(res.body.success).toBe(false);
                });
        });

    });

});