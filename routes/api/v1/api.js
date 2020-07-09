const express = require('express');

const router = express.Router();
const user = require('./user');
const question = require('./question');

router.get('/', (req, res) => {
  res.send('Welcome to V1 API');
});

router.use('/users', user);
router.use('/questions', question);

module.exports = router;
