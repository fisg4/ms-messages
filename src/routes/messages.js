const express = require('express');
const messagesController = require('../controllers/messagesController');

const router = express.Router();

router.route('/:id')
  .get(messagesController.getMessage)
  .patch(messagesController.editMessageText);

router.route('/:id/report')
  .post(messagesController.reportMessage)
  .patch(messagesController.updateReport);

export default router;
