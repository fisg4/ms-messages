const express = require('express');
const messagesController = require('../controllers/messagesController');

const router = express.Router();

router.route('/')
  .get(messagesController.getAllMessages)
  .post(messagesController.createNewMessage);

router.route('/:id')
  .get(messagesController.getMessage)
  .patch(messagesController.editMessageText);

router.route('/:id/report')
  .patch(messagesController.reportMessage);

// TODO: implement route to update report (maybe /:id/ban)

export default router;