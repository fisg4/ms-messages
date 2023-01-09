const express = require('express');
const passport = require('passport');

const messagesController = require('../controllers/messagesController');

const router = express.Router();


router.route('/:id')
  .get(messagesController.getMessage)
  .patch(passport.authenticate('jwt', { session: false }), messagesController.editMessageText);

router.route('/:id/translate')
  .patch(messagesController.translateMessage);

router.route('/:id/report')
  .post(passport.authenticate('jwt', { session: false }), messagesController.reportMessage)
  .patch(messagesController.updateReport);

router.route('/:id/unban')
  .patch(messagesController.unbanMessage);

export default router;
