import mongoose from 'mongoose';

const storeFraudAlertSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreOrder', default: null, index: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreWorker', default: null, index: true },
    type: {
      type: String,
      enum: ['missing_payment_proof', 'daily_collection_mismatch', 'multiple_failed_verifications'],
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true,
    },
    details: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'investigating', 'resolved'],
      default: 'open',
      index: true,
    },
  },
  { timestamps: true, collection: 'fraud_alerts' }
);

export default mongoose.models.StoreFraudAlert || mongoose.model('StoreFraudAlert', storeFraudAlertSchema);
