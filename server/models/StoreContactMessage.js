import mongoose from 'mongoose';

const storeContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new', index: true },
  },
  { timestamps: true, collection: 'contact_messages' }
);

export default mongoose.models.StoreContactMessage || mongoose.model('StoreContactMessage', storeContactMessageSchema);
