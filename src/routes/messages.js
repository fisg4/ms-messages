const express = require('express');
const messagesController = require('../controllers/messagesController');

const router = express.Router();

router.route('/:id')
  .get(messagesController.getMessage)
  .patch(messagesController.editMessageText);

router.route('/:id/report')
  .patch(messagesController.reportMessage);

router.route('/:id/ban')
  .patch(messagesController.banMessage);

export default router;
