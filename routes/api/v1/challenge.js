const express = require('express');

const router = express.Router();
const challengeController = require('../../../controllers/challengeController');
const JWT = require('../../../config/jwt');

router.post('/create', JWT.authenticateToken, (req, res) => challengeController.createChallenge(req, res));

module.exports = router;
