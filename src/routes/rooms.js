const { Router } = require('express');

const router = Router();

const roomsController = require('../controllers/roomsController');

router.route('/')
  .get(roomsController.getAllUserRooms)
  .post(roomsController.createRoom);

router.route('/:id')
  .get(roomsController.getRoomById)
  .delete(roomsController.deleteRoom);

router.route('/:id/participants')
  .post(roomsController.addParticipantsToRoom);

router.route('/:id/participants/:participantId')
  .delete(roomsController.removeParticipantFromRoom);

router.route('/:id/info')
  .patch(roomsController.editRoomInfo);

router.route('/:id/messages')
  .get(roomsController.getAllMessagesFromRoom)
  .post(roomsController.createNewMessage);

export default router;
