const Room = require('../models/Room');

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    if (rooms.length === 0) {
      res.status(204).json({ data: [] });
    }
    else {
      res.status(200).json({ data: rooms });
    }
  } catch (err) {
    res.status(500).json({ data: [] });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404).json({ data: null });
    } else {
      res.status(200).json({ data: room });
    }
  } catch (err) {
    res.status(500).json({ data: null });
  }
};

const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ data: null });
  } catch (err) {
    res.status(500).json({ data: null });
  }
};

const createRoom = async (req, res) => {
  if (!req.body) {
    res.status(400).json({ data: null });
  } else {
    try {
      const room = await Room.create(req.body);
      res.status(201).json({ data: room });
    } catch (err) {
      res.status(500).json({ data: null });
    }
  }
};

const updateRoom = async (req, res) => {
  if (!req.body) {
    res.status(304).json({ data: null });
  } else {
    try {
      console.log(req.params.id);
      
      const room = await Room.findByIdAndUpdate(req.params.id, req.body);
      // const updated = await Room.findById(req.params.id);
      if (!room) {
        res.status(404).json({ data: null });
      } else {
        res.status(201).json({data: room});
      }
    } catch (err) {
      res.status(500).json({ data: null });
    }
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  deleteRoom,
  createRoom,
  updateRoom
};
