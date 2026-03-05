import mongoose from 'mongoose';

const storeOtpSessionSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['admin', 'customer'], required: true, index: true },
    payload: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true },
      passwordHash: { type: String, required: true },
      profileImage: { type: String, default: '' },
    },
    emailOtp: { type: String, required: true },
    phoneOtp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true, collection: 'otp_sessions' }
);

export default mongoose.models.StoreOtpSession || mongoose.model('StoreOtpSession', storeOtpSessionSchema);
