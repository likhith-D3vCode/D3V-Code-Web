const express = require('express');
const { toggleLike } = require('../controllers/handleUserLikes');
const {getTheLikes}=require('../controllers/gethandlelikes')
const UserLikesrouter = express.Router();
UserLikesrouter.post('/posts/like', toggleLike);
UserLikesrouter.get("/getTheLikes/:questionId",getTheLikes)
module.exports = UserLikesrouter;