const express = require('express');

const router = express.Router();
const user = require('./user');
const question = require('./question');
const challenge = require('./challenge');

router.get('/', (req, res) => {
  res.send('Welcome to V1 API');
});

router.use('/users', user);
router.use('/questions', question);
router.use('/challenges', challenge);

module.exports = router;
