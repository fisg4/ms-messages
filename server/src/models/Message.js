const messagesDb = [
  {
    id: '1',
    userId: '1',
    roomId: '1',
    text: '¡Vivan las papas aliñaitas! 🤤',
    replyToId: false
  },
  {
    id: '2',
    userId: '2',
    roomId: '1',
    text: '¡Di que si! 🥳',
    replyToId: '1'
  }
];

const getAll = () => messagesDb;

const getById = (id) => {
  const message = messagesDb.find(msg => msg.id === id);

  if (!message) {
    return null;
  }

  return message;
};

const create = (userId, roomId, text, replyToId) => {
  const lastMessageId = parseInt(messagesDb[messagesDb.length - 1].id);

  const newMessage = {
    id: lastMessageId + 1, userId, roomId, text, replyToId
  };

  messagesDb.push(newMessage);

  return newMessage;
};

const editText = (id, newText) => {
  const messageIndex = messagesDb.findIndex(msg => msg.id === id);

  if (messageIndex < 0) {
    return null;
  }

  const message = messagesDb[messageIndex];
  message.text = newText;
  messagesDb[messageIndex] = message;

  return message;
};

module.exports = {
  getAll,
  getById,
  create,
  editText
};
