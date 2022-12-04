const mongoose = require('mongoose');

const { Schema } = mongoose;

const roomSchema = new Schema(
  {
    name: { type: String, default: 'New group' },
    description: { type: String, default: 'Write your description here...' },
    // participants: { type: [User], default: [] },
    participants: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
