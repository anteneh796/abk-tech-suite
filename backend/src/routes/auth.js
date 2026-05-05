const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, updateMeSchema } = require('../validators/authValidator');

// router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', auth, authController.me);
router.put('/credentials', auth, authController.updateCredentials);
// Allow authenticated users to update their profile
router.patch('/me', auth, validate(updateMeSchema), authController.updateMe);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:resetToken', authController.resetPassword);

module.exports = router;
