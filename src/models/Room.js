const mongoose = require('mongoose');

const { Schema } = mongoose;

const Message = require('./Message');

const roomSchema = new Schema(
  {
    name: { type: String, default: 'New group' },
    // participants: { type: [User], default: [] },
    participants: { type: [String], default: [] },
    messages: { type: [Message.Schema], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
