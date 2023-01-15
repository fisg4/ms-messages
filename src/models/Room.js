const mongoose = require('mongoose');

const { Schema } = mongoose;

const Role = {
  ADMIN: 1,
  NORMAL: 2
};

const roomSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    songId: { type: Schema.Types.ObjectId, required: true },
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, required: true },
        role: { type: Number, enum: Object.values(Role), default: Role.NORMAL }
      }
    ],
  },
  {
    timestamps: true,
  }
);

roomSchema.statics.getAllFromUser = async (userId, page = 0, limit = 10) => {
  const count = await mongoose.model('Room').find({ 'participants.userId': userId }).count();
  if (count === 0) {
    return {
      content: [], totalElements: 0, totalPages: 0, currentPage: 0
    };
  }

  const rooms = await mongoose.model('Room')
    .find({ 'participants.userId': userId })
    .sort({ createdAt: -1 })
    .skip(limit * page)
    .limit(limit);
  return {
    content: rooms,
    totalElements: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};

roomSchema.methods.modifyInfo = function modifyInfo(name, description) {
  this.name = name || this.name;
  this.description = description || this.description;
  return this.save();
};

roomSchema.methods.checkUserIsParticipant = function checkUserIsParticipant(userId) {
  return this.participants.map(p => p.userId.toString()).indexOf(userId) !== -1;
};

roomSchema.methods.checkUserIsAdmin = function checkUserIsAdmin(userId) {
  const participant = this.participants.find(user => user.userId.toString() === userId);
  if (!participant) {
    return false;
  }

  return participant.role === Role.ADMIN;
};

roomSchema.methods.addParticipants = function addParticipants(newParticipantIds) {
  const { participants } = this;

  newParticipantIds.forEach(participantId => {
    if (!this.checkUserIsParticipant(participantId)) {
      participants.push({ userId: participantId, role: Role.NORMAL });
    }
  });

  this.participants = participants;
  return this.save();
};

roomSchema.methods.deleteParticipant = function deleteParticipant(participantId) {
  if (this.checkUserIsAdmin(participantId)) {
    return this;
  }

  this.participants = this.participants.filter(p => p.userId.toString() !== participantId);
  return this.save();
};

module.exports = {
  Room: mongoose.model('Room', roomSchema),
  Role
};
