const express = require('express');
const router = express.Router();
const partnersCtrl = require('../controllers/partnersController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', partnersCtrl.list);
router.post('/', auth, authorize('admin'), partnersCtrl.create);
router.put('/:id', auth, authorize('admin'), partnersCtrl.update);
router.delete('/:id', auth, authorize('admin'), partnersCtrl.delete);

module.exports = router;
