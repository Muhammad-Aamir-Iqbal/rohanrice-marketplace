import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  phone: String,
  otp: {
    type: String,
    required: true,
    select: false,
  },
  otpType: {
    type: String,
    enum: ['email', 'sms', 'both'],
    default: 'email',
  },
  purpose: {
    type: String,
    enum: ['signup', 'login', 'password-reset', 'verification'],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5,
  },
  maxAttempts: {
    type: Number,
    default: 5,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // Auto delete after expiry
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verifiedAt: Date,
}, { timestamps: true });

// Method to verify OTP
otpSchema.methods.verify = function(enteredOtp) {
  if (this.attempts >= this.maxAttempts) {
    throw new Error('Maximum OTP attempts exceeded. Request a new OTP.');
  }

  if (new Date() > this.expiresAt) {
    throw new Error('OTP has expired. Request a new OTP.');
  }

  if (this.otp !== enteredOtp) {
    this.attempts += 1;
    this.save();
    throw new Error('Invalid OTP. Please try again.');
  }

  this.isVerified = true;
  this.verifiedAt = new Date();
  return this.save();
};

// Check if OTP is expired
otpSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

export default mongoose.model('OTP', otpSchema);
