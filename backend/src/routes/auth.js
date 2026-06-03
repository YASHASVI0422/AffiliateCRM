const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const { register, login, getMe, updatePassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);
router.post('/logout',   protect, logout);
router.get('/me',        protect, getMe);
router.put('/password',  protect, updatePassword);
module.exports = router;
