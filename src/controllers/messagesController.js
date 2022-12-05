const { Message, Room } = require('../models');

const getAllMessagesFromRoom = async (req, res) => {
  // TODO: Modify this when we support authentication and move to middleware
  const { userId } = req.header.auth;
  if (!userId) {
    res.status(400).json({
      success: false,
      message: 'User is not authenticated',
      content: []
    });
    return;
  }

  const { roomId, page = 0, size = 10 } = req.query;
  if (!roomId) {
    res.status(400).json({
      success: false,
      message: 'Selecting a room is mandatory',
      content: []
    });
    return;
  }

  try {
    const room = await Room.findById(roomId);
    if (!room || room.checkUserIsParticipant(userId)) {
      res.status(403).json({
        success: false,
        message: `Logged user is not a participant of the room with id ${roomId}`,
        content: []
      });
      return;
    }

    const messages = await Message.getAllFromRoomId(roomId, page, size);
    res.status(200).json({
      success: true,
      message: 'OK',
      content: messages
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error getting all messages',
      content: []
    });
  }
};

const getMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.getById(id);

    if (!message) {
      res.status(404).json({
        success: false,
        message: `Message with id '${id}' not found`,
        content: {}
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'OK',
      content: message
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error getting message with id '${id}'`,
      content: {}
    });
  }
};

const createNewMessage = async (req, res) => {
  // TODO: Modify this when we support authentication and move to middleware
  const { userId } = req.header.auth;
  if (!userId) {
    res.status(400).json({
      success: false,
      message: 'User is not authenticated',
      content: []
    });
    return;
  }

  const {
    roomId, text, replyToId = null
  } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room || room.checkUserIsParticipant(userId)) {
      res.status(403).json({
        success: false,
        message: `Logged user is not a participant of the room with id '${roomId}'`,
        content: []
      });
      return;
    }
    const newMessage = await Message.insert(userId, roomId, text, replyToId);
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
    }

    res.status(500).json({
      success: false,
      message: `Error inserting message with userId '${userId}', roomId '${roomId}', text '${text}' and replyToId '${replyToId}'`,
      content: {}
    });
  }
};

const editMessageText = async (req, res) => {
  // TODO: Modify this when we support authentication and move to middleware
  const { userId } = req.header.auth;
  if (!userId) {
    res.status(400).json({
      success: false,
      message: 'User is not authenticated',
      content: []
    });
    return;
  }

  const { id } = req.params;
  const { text } = req.body;

  try {
    const message = await Message.getById(id);
    if (!message) {
      res.status(404).json({
        success: false,
        message: `Message with id '${id}' not found`,
        content: {}
      });
      return;
    }

    if (message.userId !== userId) {
      res.status(403).json({
        success: false,
        message: `Logged user is not the author of the message with id '${id}'`,
        content: {}
      });
      return;
    }

    const updatedTextMessage = await message.updateText(text);

    res.status(201).json({
      success: true,
      message: 'OK',
      content: updatedTextMessage
    });
  } catch (err) {
    if (err.errors) {
      res.status(400).json({
        success: false,
        message: err.message,
        content: {}
      });
    }

    res.status(500).json({
      success: false,
      message: `Error updating the message with id '${id}' and the new text '${text}'`,
      content: {}
    });
  }
};

const reportMessage = async (req, res) => {
  const { id } = req.params;

  // TODO: Modify this when we support authentication and move to middleware
  const { userId } = req.header.auth;
  if (!userId) {
    res.status(400).json({
      success: false,
      message: 'User is not authenticated',
      content: []
    });
    return;
  }

  try {
    const message = await Message.getById(id);
    if (!message) {
      res.status(404).json({
        success: false,
        message: `Message with id '${id}' not found`,
        content: {}
      });
      return;
    }
    // TODO: check if this can be moved to model file
    if (message.reportedBy) {
      res.status(400).json({
        success: false,
        message: `The message with id '${id}' has already been reported`,
        content: {}
      });
      return;
    }

    const reportedMessage = await message.report(userId);

    res.status(201).json({
      success: true,
      message: 'OK',
      content: reportedMessage
    });
  } catch (err) {
    if (err.errors) {
      res.status(400).json({
        success: false,
        message: err.message,
        content: {}
      });
    }

    res.status(500).json({
      success: false,
      message: `Error when the user '${userId}' reports the message with id '${id}'`,
      content: {}
    });
  }
};

const banMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.getById(id);
    if (!message) {
      res.status(404).json({
        success: false,
        message: `Message with id '${id}' not found`,
        content: {}
      });
      return;
    }

    const bannedMessage = await message.ban();

    res.status(201).json({
      success: true,
      message: 'OK',
      content: bannedMessage
    });
  } catch (err) {
    if (err.errors) {
      res.status(400).json({
        success: false,
        message: err.message,
        content: {}
      });
    }

    res.status(500).json({
      success: false,
      message: `Error when banning the message with id '${id}'`,
      content: {}
    });
  }
};

module.exports = {
  getAllMessagesFromRoom,
  getMessage,
  createNewMessage,
  editMessageText,
  reportMessage,
  banMessage
};
