import mongoose from 'mongoose';

const storeWorkerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, default: undefined, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    profileImage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true,
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true, collection: 'workers' }
);

storeWorkerSchema.index({ email: 1 }, { sparse: true, unique: true });

export default mongoose.models.StoreWorker || mongoose.model('StoreWorker', storeWorkerSchema);
