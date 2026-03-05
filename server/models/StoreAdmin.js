import mongoose from 'mongoose';

const storeAdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    profileImage: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    verifiedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'admins' }
);

export default mongoose.models.StoreAdmin || mongoose.model('StoreAdmin', storeAdminSchema);
