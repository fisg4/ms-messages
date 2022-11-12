"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllMessages = void 0;
const getAllMessages = (req, res, next) => {
  res.json({
    message: 'getAllMessages route'
  });
};
exports.getAllMessages = getAllMessages;