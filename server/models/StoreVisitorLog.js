import mongoose from 'mongoose';

const storeVisitorLogSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, index: true },
    userId: { type: String, default: '' },
    userRole: { type: String, enum: ['guest', 'customer', 'admin'], default: 'guest', index: true },
    page: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, collection: 'visitor_logs' }
);

storeVisitorLogSchema.index({ createdAt: -1 });

export default mongoose.models.StoreVisitorLog || mongoose.model('StoreVisitorLog', storeVisitorLogSchema);
