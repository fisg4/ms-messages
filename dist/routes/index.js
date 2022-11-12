"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "hello", {
  enumerable: true,
  get: function () {
    return _hello.default;
  }
});
Object.defineProperty(exports, "messages", {
  enumerable: true,
  get: function () {
    return _messages.default;
  }
});
var _messages = _interopRequireDefault(require("./messages"));
var _hello = _interopRequireDefault(require("./hello"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }