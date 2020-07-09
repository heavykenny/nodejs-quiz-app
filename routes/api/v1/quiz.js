const express = require('express');

const router = express.Router();
const quizController = require('../../../controllers/quizController');
const JWT = require('../../../config/jwt');

router.get('/', JWT.authenticateToken, (req, res) => quizController.getAllQuiz(req, res));
router.get('/:referenceCode', JWT.authenticateToken, (req, res) => quizController.getQuiz(req, res));
router.post('/create', JWT.authenticateToken, (req, res) => quizController.quizCreate(req, res));
router.patch('/update/:referenceCode', JWT.authenticateToken, (req, res) => quizController.quizUpdate(req, res));
router.delete('/delete/:referenceCode', JWT.authenticateToken, (req, res) => quizController.deleteQuiz(req, res));

module.exports = router;
