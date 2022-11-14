const roomsController = {};

// const Room = require("../models/Room");

const rooms = [
  {
    id: "0",
    name: "New group",
    participants: [
      {
        id: 1,
        name: "Antonio",
      },
      {
        id: 2,
        name: "Pepe",
      },
    ],
    messages: [
      {
        id: 1,
        text: "¿Qué tal?",
        user: 1,
      },
    ],
  },
  {
    id: "1",
    name: "Grupo música",
    participants: [
      {
        id: 3,
        name: "Manuel",
      },
      {
        id: 2,
        name: "Pepe",
      },
    ],
    messages: [
      {
        id: 3,
        text: "Hola!",
        user: 1,
      },
    ],
  },
];

roomsController.getAllRooms = async (req, res) => {
  // const rooms = await Room.find();
  if (rooms) {
    res.status(200).json({
      success: true,
      message: "Rooms displayed successfully",
      rooms: rooms,
    });
  } else {
    res.status(204).json({
      success: true,
      message: "There are not rooms to display",
      rooms: rooms,
    });
  }
};

roomsController.getRoomById = async (req, res) => {
  // let room = await Room.findById(req.params.id);
  let room = rooms[req.params.id];
  console.log(room);
  if (room) {
    res.status(200).json({
      success: true,
      message: "Room recovered successfully",
      room: room,
    });
  } else {
    res.status(404).json({ 
        success: false, 
        room: null, 
        msg: "Room could not be found" 
    });
  }
};

//DELETE

roomsController.deleteRoom = async (req, res) => {
  // let user = await Room.findById(req.params.id);
  let room = rooms.filter((r) => {
    return r.id == req.params.id;
  });
  console.log(room);
  if (room) {
    try {
      // await Room.deleteById(room);
      res.status(200).json({
        success: true,
        message: "Room deleted successfully",
        room: rooms,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Room couldn't be deleted",
      });
    }
  } else {
    res.status(409).json({
      success: false,
      room: null,
      msg: "Room could not be deleted",
    });
  }
};

//POST

roomsController.createRoom = async (req, res) => {
  //Check Room req.body

  /*When creating a room, we need the person (jwt) that
        creates the room.
        
        It will have a role assigned (Chat-Admin)

        It may be able to add a name to the room and some participants*/

  //Create Room
  /*let room = new Room({
                        name: req.body.name,
                        participants: req.body.participants
                    })*/
  let room = {
    id: req.body.id,
    name: req.body.name,
    participants: ["User X", "User Y"],
    messages: [],
  };
  rooms.push(room);

  res.status(200).json({
    success: true,
    message: "Room created successfully",
    room: room,
  });
};

//PATCH

roomsController.updateRoom = async (req, res) => {
  /*

    let room = Room.findById(req.params.id);

    if (!req.params.id) {
        res.status(404).json({ 
            success:false, 
            message: 'The room could not be found',
        });
        return;
    }
    //If data is not modified
    else if(){
        res.status(304).json({
            success:false, 
            message: 'No changes were applied',
            room: room
        })
    }else{
        let roomUpdated = await Room.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Room modified successfully',
            room: roomUpdated
        })
    }

    */

  res.send("PATCH room");
};

module.exports = roomsController;
