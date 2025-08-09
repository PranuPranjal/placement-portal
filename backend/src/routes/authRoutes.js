const express = require('express');
const { login, signup, me } = require('../controllers/authController');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);

// Get current user info
router.get('/me', authenticate, me);

module.exports = router;
