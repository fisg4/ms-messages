const Message = require('../models/Message');
const { Room } = require('../models/Room');
const supportService = require('../services/supportService');

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
  const { reason } = req.body;
  if (!reason) {
    res.status(400).json({
      success: false,
      message: 'Declare the reason of the report is mandatory',
      content: {}
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

    const reportedMessage = await message.report(userId, reason);
    const reportSent = await supportService.sendReport(userId, reportedMessage.id, reason);
    if (!reportSent) {
      // Rollback the operation
      const previousMessage = await message.removeReport();
      res.status(500).json({
        success: false,
        message: 'Error sending report to support service',
        content: previousMessage
      });
      return;
    }

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
      return;
    }

    res.status(500).json({
      success: false,
      message: `Error when the user '${userId}' reports the message with id '${id}'`,
      content: {}
    });
  }
};

const updateReport = async (req, res) => {
  const { id } = req.params;
  const { isBanned } = req.body;
  if (isBanned == null) {
    res.status(400).json({
      success: false,
      message: 'Set the response for the report of the message',
      content: {}
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

    if (!message.reportedBy.userId) {
      res.status(400).json({
        success: false,
        message: `The message with id '${id}' can not be banned: it has not been reported`,
        content: {}
      });
      return;
    }
    if (message.reportedBy.isBanned != null) {
      res.status(400).json({
        success: false,
        message: `The report of the message with id '${id}' already has a response`,
        content: {}
      });
      return;
    }

    const bannedMessage = await message.updateReport(isBanned);
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

const unbanMessage = async (req, res) => {
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

    if (message.reportedBy.isBanned == null) {
      res.status(400).json({
        success: false,
        message: `The report of the message with id '${id}' has not been banned before`,
        content: {}
      });
      return;
    }

    const unbannedMessage = await message.unban();
    res.status(200).json({
      success: true,
      message: 'OK',
      content: unbannedMessage
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
      message: `Error when unbanning the message with id '${id}'`,
      content: {}
    });
  }
};

module.exports = {
  getMessage,
  editMessageText,
  reportMessage,
  updateReport,
  unbanMessage
};
