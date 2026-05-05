const express = require('express');
const router = express.Router();
const timelineCtrl = require('../controllers/timelineController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', timelineCtrl.list);
router.post('/', auth, authorize('admin'), timelineCtrl.create);
router.put('/:id', auth, authorize('admin'), timelineCtrl.update);
router.delete('/:id', auth, authorize('admin'), timelineCtrl.delete);

module.exports = router;
