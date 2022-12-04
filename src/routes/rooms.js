const { Router } = require('express');

const router = Router();

const roomsController = require('../controllers/roomsController');

router.route('/')
  .get(roomsController.getAllRooms)
  .post(roomsController.createRoom);

router.route('/:id')
  .get(roomsController.getRoomById)
  .delete(roomsController.deleteRoom);

router.route('/:id')
  .patch(roomsController.updateRoom);

export default router;
