import mongoose from 'mongoose';

const storeCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
  },
  { timestamps: true, collection: 'categories' }
);

export default mongoose.models.StoreCategory || mongoose.model('StoreCategory', storeCategorySchema);
