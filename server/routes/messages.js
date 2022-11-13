import express from 'express';
import * as messagesController from '../controllers/messagesController';

const router = express.Router();

router.route('/')
  .get(messagesController.getAllMessages)
  .post(messagesController.createNewMessage);

router.route('/:id')
  .get(messagesController.getMessage)
  .patch(messagesController.editMessageText);

export default router;
