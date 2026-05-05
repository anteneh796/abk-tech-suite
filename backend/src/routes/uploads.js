const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const uploadCtrl = require('../controllers/uploadController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Admin-protected image upload for services/media
router.post('/', auth, authorize('admin'), upload.single('image'), uploadCtrl.uploadImage);

// Innovator BMC upload (PDF)
const uploadDocs = require('../middleware/uploadDocs');
router.post('/bmc', auth, authorize('innovator'), uploadDocs.single('bmc'), uploadCtrl.uploadBmc);

// Innovator pitch upload (attach to application)
router.post('/pitch/:id', auth, authorize('innovator'), uploadDocs.single('pitch'), uploadCtrl.uploadPitch);

module.exports = router;
