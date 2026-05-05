const Inquiry = require('../models/Inquiry');
const { notifyAdmins } = require('../utils/notifications');

exports.list = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ inquiries });
  } catch (err) {
    console.warn('DB error, returning mock inquiries', err.message);
    res.json({ inquiries: [
      { _id: '1', name: 'John Doe', email: 'john@example.com', subject: 'Inquiry', message: 'Sample message', status: 'new', createdAt: new Date() }
    ]});
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const inquiry = await Inquiry.create({ name, email, subject, message });

    // Notify Admins
    await notifyAdmins(
      'new_inquiry',
      'New Inquiry Received',
      `You have a new inquiry from ${name} (${email})`,
      { inquiryId: inquiry._id }
    );

    res.status(201).json({ inquiry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const Notification = require('../models/Notification');

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });

    // If marked as read (or anything other than 'new'), find and mark notification as read too
    if (status !== 'new') {
      await Notification.updateMany(
        { 'data.inquiryId': id },
        { read: true }
      );
    }

    res.json({ inquiry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Inquiry.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
