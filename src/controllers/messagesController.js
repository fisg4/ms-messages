const { Message, Room } = require('../models');

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

const editMessageText = async (req, res) => {
  // TODO: Modify this when we support authentication and move to middleware
  const userId = req.header('userId');
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

    if (message.userId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: `Logged user is not the author of the message with id '${id}'`,
        content: {}
      });
      return;
    }

    const updatedTextMessage = await message.updateText(text);
    res.status(200).json({
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
      return;
    }

    res.status(500).json({
      success: false,
      message: `Error updating the message with id '${id}' and the new text '${text}'`,
      content: {}
    });
  }
};

const reportMessage = async (req, res) => {
  // TODO: Modify this when we support authentication and move to middleware
  const userId = req.header('userId');
  if (!userId) {
    res.status(400).json({
      success: false,
      message: 'User is not authenticated',
      content: []
    });
    return;
  }

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
    // TODO: check if this can be moved to model file
    if (message.reportedBy.userId) {
      res.status(400).json({
        success: false,
        message: `The message with id '${id}' has already been reported`,
        content: {}
      });
      return;
    }

    const room = await Room.findById(message.roomId);
    if (!room || !room.checkUserIsParticipant(userId)) {
      res.status(403).json({
        success: false,
        message: `The user '${userId}' is not a participant of the room`,
        content: {}
      });
      return;
    }

    // TODO: Make a call to support ms
    const reportedMessage = await message.report(userId);
    res.status(200).json({
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
      return;
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

    if (!message.reportedBy.userId) {
      res.status(400).json({
        success: false,
        message: `The message with id '${id}' can not be banned: it has not been reported`,
        content: {}
      });
      return;
    }
    if (message.reportedBy.isBanned) {
      res.status(400).json({
        success: false,
        message: `The message with id '${id}' has already been banned`,
        content: {}
      });
      return;
    }

    const bannedMessage = await message.ban();
    res.status(200).json({
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
      return;
    }

    res.status(500).json({
      success: false,
      message: `Error when banning the message with id '${id}'`,
      content: {}
    });
  }
};

module.exports = {
  getMessage,
  editMessageText,
  reportMessage,
  banMessage
};
