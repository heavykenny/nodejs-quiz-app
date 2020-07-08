const express = require('express');

const router = express.Router();
const userController = require('../../../controllers/userController');
const JWT = require('../../../config/jwt');

router.post('/register', (req, res) => userController.userCreate(req, res));

router.post('/login', (req, res) => userController.userLogin(req, res));

router.get('/user', JWT.authenticateToken, (req, res) => userController.index(req, res));

module.exports = router;
