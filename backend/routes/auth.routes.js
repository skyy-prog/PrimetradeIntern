const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, getAllUsers } = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { validateFields } = require('../middleware/validation.middleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validateFields,
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required'),
    validateFields,
  ],
  login
);

router.get('/me', protect, getProfile);
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;
