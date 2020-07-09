const express = require('express');

const router = express.Router();
const user = require('./user.js');
const quiz = require('./quiz.js');

router.get('/', (req, res) => {
  res.send('Welcome to V1 API');
});

router.use('/users', user);
router.use('/quiz', quiz);

module.exports = router;
