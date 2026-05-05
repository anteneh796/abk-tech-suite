const Notification = require('../models/Notification');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const ioUtils = require('./io');

const EMERGENCY_ADMIN_ID = '645a1b3c2d4e5f6a7b8c9d0e';

/**
 * Send notification to a specific user
 */
const notifyUser = async (userId, type, title, message, data = {}) => {
  try {
    // Persist to DB
    const notification = await Notification.create({
      recipient: userId,
      type,
      title,
      message,
      data
    });

    // Send real-time
    ioUtils.sendNotification(userId.toString(), type, {
      _id: notification._id,
      title,
      message,
      data,
      createdAt: notification.createdAt
    });

    return notification;
  } catch (err) {
    console.error('Error sending notification:', err);
  }
};

/**
 * Send notification to all admins
 */
const notifyAdmins = async (type, title, message, data = {}) => {
  try {
    const admins = await User.find({ role: 'admin' });
    const adminIds = new Set(admins.map(admin => admin._id.toString()));
    
    // Always include emergency admin if it exists in the system context
    adminIds.add(EMERGENCY_ADMIN_ID);

    const promises = Array.from(adminIds).map(id => notifyUser(id, type, title, message, data));
    await Promise.all(promises);
  } catch (err) {
    console.error('Error notifying admins:', err);
  }
};

/**
 * Sync unread inquiries as notifications for a user (Retroactive fix)
 */
const syncInquiryNotifications = async (userId) => {
    try {
        const unreadInquiries = await Inquiry.find({ status: 'new' });
        for (const inquiry of unreadInquiries) {
            const exists = await Notification.findOne({ 
                recipient: userId, 
                'data.inquiryId': inquiry._id 
            });
            
            if (!exists) {
                await Notification.create({
                    recipient: userId,
                    type: 'new_inquiry',
                    title: 'New Inquiry Received',
                    message: `You have an unread inquiry from ${inquiry.name}`,
                    data: { inquiryId: inquiry._id },
                    createdAt: inquiry.createdAt
                });
            }
        }
    } catch (err) {
        console.error('Sync error:', err);
    }
};

module.exports = { notifyUser, notifyAdmins, syncInquiryNotifications };
