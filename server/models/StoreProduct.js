import mongoose from 'mongoose';

const storeProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreCategory', required: true, index: true },
    pricePerKg: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, collection: 'products' }
);

export default mongoose.models.StoreProduct || mongoose.model('StoreProduct', storeProductSchema);
