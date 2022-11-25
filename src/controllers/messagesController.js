const { Message } = require('../models');

// TODO: Append message and status to responses

// possibily this could be removed
const getAllMessages = async (req, res) => {
  const { page = 0, size = 10 } = req.query;

  try {
    const messages = await Message.getAll(page, size);
    res.status(200).json({ data: messages });
  } catch (err) {
    console.error('Error getting all messages', err);
    res.status(500).json({ data: [] });
  }
};

const getMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.getById(id);

    if (!message) {
      res.status(404).json({ data: {} });
      return;
    }

    res.status(200).json({ data: message });
  } catch (err) {
    console.error(`Error getting message with id '${id}'`, err);
    res.status(500).json({ data: {} });
  }
};

const createNewMessage = async (req, res) => {
  const {
    userId, roomId, text, replyToId = null
  } = req.body;

  if (!userId || !roomId || !text) {
    res.status(400).json({ data: {} });
    return;
  }

  try {
    const newMessage = await Message.insert(userId, roomId, text, replyToId);
    res.status(201).json({ data: newMessage });
  } catch (err) {
    console.error(`Error inserting message with userId '${userId}', roomId '${roomId}', text '${text}' and replyToId '${replyToId}'`, err);
    res.status(500).json({ data: {} });
  }
};

const editMessageText = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    res.status(400).json({ data: {} });
    return;
  }

  try {
    const message = await Message.getById(id);
    if (!message) {
      res.status(404).json({ data: {} });
      return;
    }

    const updatedTextMessage = message.updateText(text);
    if (!updatedTextMessage) {
      throw new Error();
    }

    res.status(201).json({ data: updatedTextMessage });
  } catch (err) {
    console.error(`Error updating the text of message with id '${id}' and text '${text}'`, err);
    res.status(500).json({ data: {} });
  }
};

const reportMessage = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ data: {} });
    return;
  }

  try {
    const message = await Message.getById(id);
    if (!message) {
      res.status(404).json({ data: {} });
      return;
    }

    if (message.reportedBy) {
      res.status(400).json({ data: {} });
      return;
    }

    const reportedMessage = await message.report(userId);
    if (!reportedMessage) {
      throw new Error();
    }

    res.status(201).json({ data: reportedMessage });
  } catch (err) {
    console.error(`Error when the user '${userId}' reports the message with id '${id}'`, err);
    res.status(500).json({ data: {} });
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
