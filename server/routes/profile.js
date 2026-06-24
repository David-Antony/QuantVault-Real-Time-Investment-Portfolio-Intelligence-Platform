const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.use(authenticate);

const updateProfileValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Username must be between 3 and 100 characters'),
  body('avatarPreset')
    .optional()
    .isString()
    .withMessage('Avatar preset must be a string'),
  body('avatarConfig')
    .optional()
    .isObject()
    .withMessage('Avatar config must be an object')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
];

router.get('/', profileController.getProfile);
router.put('/', validate(updateProfileValidation), profileController.updateProfile);
router.put('/password', validate(changePasswordValidation), profileController.changePassword);

module.exports = router;
