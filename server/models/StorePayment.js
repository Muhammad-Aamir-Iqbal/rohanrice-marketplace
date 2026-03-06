import mongoose from 'mongoose';

const storePaymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreOrder', required: true, index: true },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'easypaisa', 'jazzcash'],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    transactionId: { type: String, default: '' },
    senderPhone: { type: String, default: '' },
    paymentProofImage: { type: String, default: '' },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    verified: { type: Boolean, default: false, index: true },
    verifiedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreAdmin', default: null },
    verifiedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: '' },
    failedAttempts: { type: Number, default: 0, min: 0 },
    createdByWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreWorker', default: null },
  },
  { timestamps: true, collection: 'payments' }
);

storePaymentSchema.index({ transactionId: 1, senderPhone: 1 });

export default mongoose.models.StorePayment || mongoose.model('StorePayment', storePaymentSchema);
