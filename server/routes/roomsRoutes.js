const { Router } = require('express');
const router = Router();

const roomsController = require('../controllers/roomsController');

router.get('/', roomsController.getAllRooms);
router.get('/:id', roomsController.getRoomById);

router.post('/', roomsController.createRoom);

router.delete('/:id', roomsController.deleteRoom);

router.patch('/:id/participants', roomsController.updateRoom);


module.exports = router;