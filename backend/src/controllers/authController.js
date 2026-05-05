const User = require('../models/User');
const crypto = require('crypto');
const { signAccessToken, signRefreshToken, hashToken, verifyRefreshToken } = require('../utils/token');
const { notifyAdmins } = require('../utils/notifications');

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
    sameSite: process.env.COOKIE_SAMESITE || 'Strict',
    domain: process.env.COOKIE_DOMAIN && process.env.COOKIE_DOMAIN !== 'localhost' ? process.env.COOKIE_DOMAIN : undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, company_name } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password, role, company_name });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    const hashed = hashToken(refreshToken);
    await user.addRefreshToken(hashed);

    // Compute cookie options at request time so env changes in tests are respected
    const COOKIE_OPTIONS = getCookieOptions()
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    if (!email || !password) {
      console.log('Login failed: Missing fields');
      return res.status(400).json({ message: 'Missing fields' });
    }

    // --- EMERGENCY BYPASS REMOVED ---
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: User not found (${email})`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      console.log(`Login failed: Password mismatch for (${email})`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    const hashed = hashToken(refreshToken);
    await user.addRefreshToken(hashed);

    const COOKIE_OPTIONS = getCookieOptions()
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    console.log(`Login successful: ${email}`);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken });
  } catch (err) {
    console.error('Login error exception:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    let payload
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      const COOKIE_OPTIONS = getCookieOptions()
      res.clearCookie('refreshToken', COOKIE_OPTIONS);
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const hashed = hashToken(token);
    if (!user.hasRefreshToken(hashed)) {
      // Token not recognized — possible reuse
      user.refreshTokens = []
      await user.save()
      const COOKIE_OPTIONS = getCookieOptions()
      res.clearCookie('refreshToken', COOKIE_OPTIONS);
      return res.status(401).json({ message: 'Refresh token revoked' });
    }

    // Rotate refresh token
    await user.removeRefreshToken(hashed);

    const newRefresh = signRefreshToken(user);
    const newHashed = hashToken(newRefresh);
    await user.addRefreshToken(newHashed);

    const accessToken = signAccessToken(user);

    const COOKIE_OPTIONS = getCookieOptions()
    res.cookie('refreshToken', newRefresh, COOKIE_OPTIONS);
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        const user = await User.findById(payload.id);
        if (user) {
          const hashed = hashToken(token);
          await user.removeRefreshToken(hashed);
        }
      } catch (err) {
        // ignore invalid token
      }
    }

    const COOKIE_OPTIONS = getCookieOptions()
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.json({ message: 'Logged out' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.me = async (req, res) => {
  try {
    // --- EMERGENCY ADMIN REMOVED FOR PRODUCTION ---
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update current user's profile (authenticated)
exports.updateCredentials = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    if (email) user.email = email;
    if (newPassword) user.password = newPassword;

    await user.save();
    res.json({ message: 'Credentials updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const allowed = ['name', 'company_name', 'phone', 'position', 'address']
    const updates = {}
    for (const key of allowed) {
      if (typeof req.body[key] !== 'undefined') updates[key] = req.body[key]
    }

    if (Object.keys(updates).length === 0) return res.status(400).json({ message: 'No updatable fields provided' })

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const { sendEmail } = require('../utils/email');

    await sendEmail(
      user.email,
      'Password Reset Request',
      `You are receiving this because you have requested the reset of the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process:\n\n ${resetUrl}`,
      `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    );

    res.json({ message: 'Email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
