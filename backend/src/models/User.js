const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const roles = ['admin', 'client', 'innovator', 'technician'];

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: roles, default: 'client' },
  company_name: { type: String },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  refreshTokens: [
    {
      token: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Refresh token helpers
UserSchema.methods.addRefreshToken = async function (hashedToken) {
  this.refreshTokens.push({ token: hashedToken })
  // Keep only last 10 tokens to avoid unbounded growth
  if (this.refreshTokens.length > 10) {
    this.refreshTokens = this.refreshTokens.slice(-10)
  }
  await this.save()
}

UserSchema.methods.removeRefreshToken = async function (hashedToken) {
  this.refreshTokens = this.refreshTokens.filter((t) => t.token !== hashedToken)
  await this.save()
}

UserSchema.methods.hasRefreshToken = function (hashedToken) {
  return this.refreshTokens.some((t) => t.token === hashedToken)
}

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
