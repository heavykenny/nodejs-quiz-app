const express = require('express');
const router = express.Router();
const user_controller = require('../../../controllers/userController');
const JWT = require('../../../config/jwt');

router.post('/register', (req, res) => {
    return user_controller.userCreate(req, res);
});

router.post('/login', (req, res) => {
    return user_controller.userLogin(req, res);
});

router.get('/user', JWT.authenticateToken, (req, res) => {
    return user_controller.index(req, res);
});

module.exports = router;