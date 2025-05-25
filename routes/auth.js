const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/profile', getProfile);

module.exports = router;

