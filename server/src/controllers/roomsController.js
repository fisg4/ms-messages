const roomsController = {};

let rooms = [
  {
    id: 0,
    name: 'New group',
    participants: [
      {
        id: 1,
        name: 'Antonio',
      },
      {
        id: 2,
        name: 'Pepe',
      },
    ],
    messages: [
      {
        id: 1,
        text: '¿Qué tal?',
        user: 1,
      },
    ],
  },
  {
    id: 1,
    name: 'Grupo música',
    participants: [
      {
        id: 3,
        name: 'Manuel',
      },
      {
        id: 2,
        name: 'Pepe',
      },
    ],
    messages: [
      {
        id: 3,
        text: 'Hola!',
        user: 1,
      },
    ],
  },
  {
    id: 2,
    name: 'Curro',
    participants: [
      {
        id: 3,
        name: 'Manuel',
      },
      {
        id: 2,
        name: 'Pepe',
      },
    ],
    messages: [
      {
        id: 3,
        text: 'Listos para empezar?',
        user: 1,
      },
    ],
  },
];

roomsController.getAllRooms = async (req, res) => {
  if (rooms) {
    res.status(200).json({
      success: true,
      message: 'Rooms displayed successfully',
      rooms,
    });
  } else {
    res.status(204).json({
      success: true,
      message: 'There are not rooms to display',
      rooms,
    });
  }
};

roomsController.getRoomById = async (req, res) => {
  const room = rooms.filter(item => +item.id === +req.params.id);
  if (room && room.length !== 0) {
    res.status(200).json({
      success: true,
      message: 'Room recovered successfully',
      data: room,
    });
  } else {
    res.status(404).json({
      success: false,
      data: null,
      msg: 'Room could not be found',
    });
  }
};

roomsController.deleteRoom = async (req, res) => {
  try {
    rooms.splice(rooms.findIndex(item => +item.id === +req.params.id), 1);
    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
      data: rooms,
    });
  } catch (err) {
    res.status(409).json({
      success: false,
      message: 'Room could not be deleted',
    });
  }
};

roomsController.createRoom = async (req, res) => {
  const newRoom = {
    id: Math.floor(Math.random() * 100),
    name: req.body.name,
    participants: req.body.participants,
    messages: []
  };

  rooms.push(newRoom);

  res.status(200).json({
    success: true,
    message: 'Room created successfully',
    data: newRoom,
  });
};

roomsController.updateRoom = async (req, res) => {
  let room = rooms.filter(item => +item.id === +req.params.id);
  if (room) {
    const aux = room;
    room = {
      id: room[0].id,
      name: getName(room[0], req),
      messages: [],
      participants: room[0].participants.concat(req.body.participants)
    };
    try {
      if (notModified(aux[0].participants, room.participants)) {
        res.status(200).json({ success: false, message: 'The room was not modified', data: room });
      } else {
        rooms.splice(rooms.findIndex(item => +item.id === +req.params.id), 1);
        rooms.push(room);
        res.status(200).json({ success: true, message: 'Room correctly updated', data: room });
      }
    } catch (err) {
      res.status(304).json({ success: false, message: 'The room could not be modified' });
    }
  }
};

function notModified(arr1, arr2) {
  const N = arr1.length;
  const M = arr2.length;

  if (N !== M) return false;

  arr1.sort();
  arr2.sort();

  for (let i = 0; i < N; i++) { if (arr1[i] !== arr2[i]) return false; }

  return true;
}

function getName(room, req) { return req.body.name ? req.body.name : room.name; }

module.exports = roomsController;
