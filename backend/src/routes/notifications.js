const express = require('express');
const router = express.Router();
const notificationCtrl = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.get('/', auth, notificationCtrl.getNotifications);
router.put('/mark-all-read', auth, notificationCtrl.markAllAsRead);
router.put('/:id/read', auth, notificationCtrl.markAsRead);
router.delete('/:id', auth, notificationCtrl.deleteNotification);

module.exports = router;
