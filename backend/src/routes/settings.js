const express = require('express');
const router = express.Router();
const settingsCtrl = require('../controllers/settingsController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', settingsCtrl.getSettings);
router.put('/', auth, authorize('admin'), settingsCtrl.updateSettings);

module.exports = router;
