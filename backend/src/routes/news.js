const express = require('express');
const router = express.Router();
const newsCtrl = require('../controllers/newsController');
const auth = require('../middleware/auth');

router.get('/', newsCtrl.list);
router.post('/', auth, newsCtrl.create);
router.patch('/:id', auth, newsCtrl.update);
router.delete('/:id', auth, newsCtrl.delete);

module.exports = router;
