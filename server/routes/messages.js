import express from 'express';
import * as messagesController from '../controllers/messagesController';

const router = express.Router();

/* GET all users */
router.get('/', messagesController.getAllMessages);

export default router;
