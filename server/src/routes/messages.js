const express = require('express');
const messagesController = require('../controllers/messagesController');

const router = express.Router();

router.route('/')
  .get(messagesController.getAllMessages)
  .post(messagesController.createNewMessage);

router.route('/:id')
  .get(messagesController.getMessage)
  .patch(messagesController.editMessageText);

export default router;
