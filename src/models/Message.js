const { Schema, default: mongoose } = require('mongoose');

const messageSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  roomId: { type: Schema.Types.ObjectId, required: true },
  text: { type: String, required: true, maxLength: 255 },
  translatedText: { type: String, maxLength: 255 },
  replyToId: { type: Schema.Types.ObjectId },
  reportedBy: {
    userId: { type: Schema.Types.ObjectId },
    reason: { type: String },
    madeAt: { type: Date },
    isBanned: { type: Boolean }
  }
}, { timestamps: true });

// static methods

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
    userId, roomId, text
  };

  if (replyToId) { newMessage = { ...newMessage, replyToId }; }

  return mongoose.model('Message').create(newMessage);
};

// instance methods

messageSchema.methods.updateText = function updateText(text) {
  this.text = text;
  return this.save();
};

messageSchema.methods.addTranslationText = function addTranslation(text) {
  this.translatedText = text;
  return this.save();
};

messageSchema.methods.report = function report(userId, reason) {
  this.reportedBy = { userId, madeAt: Date.now(), reason };
  return this.save();
};

messageSchema.methods.removeReport = function removeReport() {
  this.reportedBy = null;
  return this.save();
};

messageSchema.methods.updateReport = function ban(isBanned) {
  this.reportedBy = { ...this.reportedBy, isBanned };
  return this.save();
};

messageSchema.methods.unban = function unban() {
  this.reportedBy.isBanned = null;
  return this.save();
};

module.exports = mongoose.model('Message', messageSchema);
