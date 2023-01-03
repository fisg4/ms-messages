const { ObjectId } = require('mongodb');
const { Room, Role } = require('../models/Room');
const Message = require('../models/Message');
const { decodeToken } = require('../auth/jwt');

const getAllUserRooms = async (req, res) => {
  const token = req.headers.authorization;
  const userId = decodeToken(token).id;

  const { page = 0, size = 10 } = req.query;

  try {
    const roomsPaginated = await Room.getAllFromUser(userId, page, size);
    res.status(200).json({
      success: true,
      message: 'OK',
      ...roomsPaginated
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error getting all rooms of user '${userId}'`,
      content: []
    });
  }
};

const getRoomById = async (req, res) => {
  const token = req.headers.authorization;
  const userId = decodeToken(token).id;

  const { id } = req.params;

  try {
    const room = await Room.findById(id);
    if (!room) {
      res.status(404).json({
        success: false,
        message: `Room with id '${id}' not found`,
        content: {}
      });
      return;
    }

    if (!room.checkUserIsParticipant(userId)) {
      res.status(403).json({
        success: false,
        message: 'The user is not a participant of this room',
        content: {}
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'OK',
      content: room
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error getting room with id '${id}'`,
      content: {}
    });
  }
};

const deleteRoom = async (req, res) => {
  const token = req.headers.authorization;
  const userId = decodeToken(token).id;
  
  const { id } = req.params;

  try {
    const room = await Room.findById(id);
    if (!room) {
      res.status(404).json({
        success: false,
        message: `Room with id '${id}' not found`,
        content: {}
      });
      return;
    }

    if (!room.checkUserIsAdmin(userId)) {
      res.status(403).json({
        success: false,
        message: `The user with id '${userId}' is not the admin of the room`,
        content: {}
      });
      return;
    }

    await Room.findByIdAndDelete(id);
    res.status(204).json({
      success: true,
      message: 'OK. Room deleted successfully',
      content: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error deelting the room with id '${id}'`,
      content: {}
    });
  }
};

const createRoom = async (req, res) => {
  const token = req.headers.authorization;
  const userId = decodeToken(token).id;

  const {
    name, description, songId, participants
  } = req.body;

  const finalParticipants = [{ userId: ObjectId(userId), role: Role.ADMIN }];
  participants?.forEach(participantId => finalParticipants.push({
    userId: ObjectId(participantId)
  }));

  try {
    const room = await Room.create({
      name, description, songId, participants: finalParticipants
    });
    res.status(201).json({
      success: true,
      message: 'OK',
      content: room
    });
  } catch (err) {
    if (err.errors) {
      res.status(400).json({
        success: false,
        message: err.message,
        content: {}
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error creating room',
      content: {}
    });
  }
};

const addParticipantsToRoom = async (req, res) => {
  const token = req.headers.authorization;
  const userId = decodeToken(token).id;

  const { id } = req.params;
  const { participants } = req.body;

  try {
    const room = await Room.findById(id);
    if (!room) {
      res.status(404).json({
        success: false,
        message: `Room with id '${id}' not found`,
        content: {}
      });
      return;
    }

    if (!room.checkUserIsAdmin(userId)) {
      res.status(403).json({
        success: false,
        message: `The user with id '${userId}' is not the admin of the room`,
        content: {}
      });
      return;
    }

    const updatedRoom = await room.addParticipants(participants);
    res.status(200).json({
      success: true,
      message: 'OK',
      content: updatedRoom
    });
  } catch (err) {
    if (err.errors) {
      res.status(400).json({
        success: false,
        message: err.message,
        content: {}
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error updating room participants',
      content: {}
    });
  }
};

const removeParticipantFromRoom = async (req, res) => {
  const token = req.headers.authorization;
  const userId = decodeToken(token).id;

  const { id, participantId } = req.params;

  try {
    const room = await Room.findById(id);
    if (!room) {
      res.status(404).json({
        success: false,
        message: `Room with id '${id}' not found`,
        content: {}
      });
      return;
    }

    if (!room.checkUserIsAdmin(userId)) {
      res.status(403).json({
        success: false,
        message: `The user with id '${userId}' is not the admin of the room`,
        content: {}
      });
      return;
    }

    const updatedRoom = await room.deleteParticipant(participantId);
    res.status(200).json({
      success: true,
      message: 'OK',
      content: updatedRoom
    });
  } catch (err) {
    if (err.errors) {
      res.status(400).json({
        success: false,
        message: err.message,
        content: {}
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error updating room participants',
      content: {}
    });
  }
};

const editRoomInfo = async (req, res) => {
  const token = req.headers.authorization;
  const userId = decodeToken(token).id;

  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const room = await Room.findById(id);
    if (!room) {
      res.status(404).json({
        success: false,
        message: `Room with id '${id}' not found`,
        content: {}
      });
      return;
    }

    if (!room.checkUserIsAdmin(userId)) {
      res.status(403).json({
        success: false,
        message: `The user with id '${userId}' is not the admin of the room`,
        content: {}
      });
      return;
    }

    const updatedRoom = await room.modifyInfo(name, description);
    res.status(200).json({
      success: true,
      message: 'OK',
      content: updatedRoom
    });
  } catch (err) {
    if (err.errors) {
      res.status(400).json({
        success: false,
        message: err.message,
        content: {}
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: `Error updating the room with id '${id}'`,
      content: {}
    });
  }
};

const getAllMessagesFromRoom = async (req, res) => {
  const token = req.headers.authorization;
  const userId = decodeToken(token).id;

  const { id } = req.params;
  const { page = 0, size = 10 } = req.query;

  try {
    const room = await Room.findById(id);
    if (!room) {
      res.status(404).json({
        success: false,
        message: `Room with id '${id}' not found`,
        content: []
      });
      return;
    }
    if (!room.checkUserIsParticipant(userId)) {
      res.status(403).json({
        success: false,
        message: `Logged user is not a participant of the room with id '${id}'`,
        content: []
      });
      return;
    }

    const messagesPaginated = await Message.getAllFromRoomId(id, page, size);
    res.status(200).json({
      success: true,
      message: 'OK',
      ...messagesPaginated
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error getting all messages from room '${id}'`,
      content: []
    });
  }
};

const createNewMessage = async (req, res) => {
  const token = req.headers.authorization;
  const userId = decodeToken(token).id;

  const { id } = req.params;
  const { text, replyToId = null } = req.body;

  try {
    const room = await Room.findById(id);
    if (!room) {
      res.status(404).json({
        success: false,
        message: `Room with id '${id}' not found`,
        content: []
      });
      return;
    }
    if (!room.checkUserIsParticipant(userId)) {
      res.status(403).json({
        success: false,
        message: `Logged user is not a participant of the room with id '${id}'`,
        content: []
      });
      return;
    }

    const newMessage = await Message.insert(userId, id, text, replyToId);
    res.status(201).json({
      success: true,
      message: 'OK',
      content: newMessage
    });
  } catch (err) {
    if (err.errors) {
      res.status(400).json({
        success: false,
        message: err.message,
        content: {}
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: `Error creating message in room '${id}'`,
      content: {}
    });
  }
};

module.exports = {
  getAllUserRooms,
  getRoomById,
  deleteRoom,
  createRoom,
  addParticipantsToRoom,
  removeParticipantFromRoom,
  editRoomInfo,
  getAllMessagesFromRoom,
  createNewMessage
};
