

const router = require('express').Router();
const isAuth = require("../middleware/isAuth").isAuth;
const chatController = require('../controllers/chat');

router.get('/',isAuth, chatController.getChat);

module.exports = router;