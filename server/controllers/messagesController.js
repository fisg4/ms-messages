const Message = require('../models/Message');

const getAllMessages = (req, res) => {
  const messages = Message.getAll();

  res.status(200).json({ data: messages });
};

const getMessage = (req, res) => {
  const { id } = req.params;
  const message = Message.getById(id);

  if (!message) {
    res.status(404).json({ data: [] });
    return;
  }

  res.status(200).json({ data: message });
};

const createNewMessage = (req, res) => {
  const {
    userId, roomId, text, replyToId
  } = req.body;

  if (!userId || !roomId || !text) {
    res.status(400).json({ data: {} });
    return;
  }

  const message = Message.create(userId, roomId, text, replyToId);
  res.status(201).json({ data: message });
};

const editMessageText = (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!id || !text) {
    res.status(400).json({ data: {} });
    return;
  }

  const messageEdited = Message.editText(id, text);
  if (!messageEdited) {
    res.status(404).json({ data: {} });
    return;
  }

  res.status(201).json({ data: messageEdited });
};

module.exports = {
  getAllMessages,
  getMessage,
  createNewMessage,
  editMessageText
};
