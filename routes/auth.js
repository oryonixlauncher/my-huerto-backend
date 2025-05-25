const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

// Inscription et connexion classiques
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// OAuth Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login.html', session: true }),
  (req, res) => {
    res.redirect('/profile.html');
  });

// OAuth Discord
router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/login.html', session: true }),
  (req, res) => {
    res.redirect('/profile.html');
  });

module.exports = router;

