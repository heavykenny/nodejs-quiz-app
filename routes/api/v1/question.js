const express = require('express');

const router = express.Router();
const questionController = require('../../../controllers/questionController');
const JWT = require('../../../config/jwt');

router.get('/', JWT.authenticateToken, (req, res) => questionController.getAllQuestion(req, res));
router.get('/:referenceCode', JWT.authenticateToken, (req, res) => questionController.getQuestion(req, res));
router.post('/create', JWT.authenticateToken, (req, res) => questionController.questionCreate(req, res));
router.patch('/update/:referenceCode', JWT.authenticateToken, (req, res) => questionController.questionUpdate(req, res));
router.delete('/delete/:referenceCode', JWT.authenticateToken, (req, res) => questionController.deleteQuestion(req, res));

module.exports = router;
