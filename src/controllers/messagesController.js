const { Message } = require('../models');

// TODO: Append message and status to responses

// possibily this could be removed
const getAllMessages = async (req, res) => {
  const { page = 0, size = 10 } = req.query;

  try {
    const messages = await Message.getAll(page, size);
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
  const {
    userId, roomId, text, replyToId = null
  } = req.body;

  try {
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
      message: `Error updating the text of message with id '${id}' and text '${text}'`,
      content: {}
    });
  }
};

const reportMessage = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({
      success: false,
      message: 'It is necessary to set an userId',
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

// TODO: implement function to update report

module.exports = {
  getAllMessages,
  getMessage,
  createNewMessage,
  editMessageText,
  reportMessage
};
