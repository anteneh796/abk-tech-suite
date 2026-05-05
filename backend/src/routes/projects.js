const express = require('express');
const router = express.Router();
const projectsCtrl = require('../controllers/projectsController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');

router.get('/', projectsCtrl.list);
router.post('/', auth, authorize('admin'), upload.single('image'), projectsCtrl.create);
router.put('/:id', auth, authorize('admin'), upload.single('image'), projectsCtrl.update);
router.delete('/:id', auth, authorize('admin'), projectsCtrl.delete);

module.exports = router;
