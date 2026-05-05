const express = require('express');
const router = express.Router();
const servicesCtrl = require('../controllers/servicesController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');

router.get('/', servicesCtrl.list);
router.post('/', auth, authorize('admin'), upload.single('image'), servicesCtrl.create);
router.put('/:id', auth, authorize('admin'), upload.single('image'), servicesCtrl.update);
router.delete('/:id', auth, authorize('admin'), servicesCtrl.delete);

module.exports = router;
