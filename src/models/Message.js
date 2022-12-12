const { Schema, default: mongoose } = require('mongoose');

const messageSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  roomId: { type: Schema.Types.ObjectId, required: true },
  text: { type: String, required: true, maxLength: 255 },
  replyToId: { type: Schema.Types.ObjectId },
  reportedBy: {
    userId: { type: Schema.Types.ObjectId },
    madeAt: { type: Date },
    isBanned: { type: Boolean }
  }
}, { timestamps: true });

// static methods

messageSchema.statics.getAll = (page = 0, size = 10) => mongoose.model('Message').find({ limit: size, skip: page * size });

messageSchema.statics.getAllFromRoomId = async (roomId, page = 0, limit = 10) => {
  const count = await mongoose.model('Message').find({ roomId }).count();
  if (count === 0) {
    return {
      content: [], totalElements: 0, totalPages: 0, currentPage: 0
    };
  }

  const messages = await mongoose.model('Message')
    .find({ roomId })
    .sort({ createdAt: 1 })
    .skip(limit * page)
    .limit(limit);

  return {
    content: messages,
    totalElements: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};

messageSchema.statics.getById = (id) => mongoose.model('Message').findById(id);

messageSchema.statics.insert = (userId, roomId, text, replyToId) => {
  let newMessage = {
    userId, roomId, text, report: {}
  };

  if (replyToId) { newMessage = { ...newMessage, replyToId }; }

  return mongoose.model('Message').create(newMessage);
};

// instance methods

messageSchema.methods.updateText = function updateText(text) {
  this.text = text;
  return this.save();
};

messageSchema.methods.report = function report(userId) {
  this.reportedBy = { userId, madeAt: Date.now(), isBanned: false };
  return this.save();
};

messageSchema.methods.ban = function ban() {
  this.reportedBy.isBanned = true;
  return this.save();
};

module.exports = mongoose.model('Message', messageSchema);
