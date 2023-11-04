const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// New route for user registration
router.post('/', registerController.registerUser);
router.post('/login', registerController.loginUser);

module.exports = router;