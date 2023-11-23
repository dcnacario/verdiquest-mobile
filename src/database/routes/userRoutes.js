const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/fetchAll', userController.userAllTasks);
router.get('/fetchEasyTask', userController.userEasyTasks);
router.get('/fetchNormalTask', userController.userNormalTasks);
router.get('/fetchHardTask', userController.userHardTasks);

module.exports = router;
