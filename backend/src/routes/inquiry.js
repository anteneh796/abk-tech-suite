const express = require('express');
const router = express.Router();
const inquiryCtrl = require('../controllers/inquiryController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.post('/', inquiryCtrl.create); // Public
router.get('/', auth, authorize('admin'), inquiryCtrl.list); // Admin
router.put('/:id', auth, authorize('admin'), inquiryCtrl.updateStatus); // Admin
router.delete('/:id', auth, authorize('admin'), inquiryCtrl.delete); // Admin

module.exports = router;
