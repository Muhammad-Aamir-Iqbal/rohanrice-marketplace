import mongoose from 'mongoose';

const storeReviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreProduct', required: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreCustomer', required: true, index: true },
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, collection: 'reviews' }
);

storeReviewSchema.index({ productId: 1, customerId: 1 }, { unique: true });

export default mongoose.models.StoreReview || mongoose.model('StoreReview', storeReviewSchema);
