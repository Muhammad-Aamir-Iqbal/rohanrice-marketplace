import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  variety: {
    type: String,
    required: [true, 'Rice variety is required'],
    enum: ['Premium Basmati', '1121 Basmati', 'Super Kernel', 'IRRI-6', 'Sella', 'Brown Rice'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'INR', 'EUR'],
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: 0,
    default: 0,
  },
  minOrderQuantity: {
    type: Number,
    default: 1,
  },
  category: {
    type: String,
    enum: ['Premium', 'Semi-Premium', 'Economy', 'Specialty'],
    default: 'Premium',
  },
  origin: {
    country: { type: String, default: 'India' },
    region: String,
    farm: String,
  },
  specifications: {
    length: String,
    color: String,
    aroma: String,
    texture: String,
    cookingTime: String,
    grainIntegrity: String,
  },
  certifications: [
    {
      name: String,
      issueDate: Date,
      expiryDate: Date,
      certificateId: String,
      verificationUrl: String,
    },
  ],
  images: [
    {
      url: String,
      alt: String,
      isPrimary: Boolean,
    },
  ],
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  packaging: {
    size: String, // 1kg, 5kg, 25kg, 50kg, bulk
    material: String, // Jute, Plastic, Foil
    customizable: Boolean,
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Index for search
productSchema.index({ name: 'text', variety: 'text', description: 'text' });
productSchema.index({ variety: 1, category: 1 });
productSchema.index({ 'seo.keywords': 1 });

// Middleware to update stock when order placed
productSchema.methods.updateStock = async function(quantity) {
  this.stock -= quantity;
  return this.save();
};

// Get available status
productSchema.methods.getAvailabilityStatus = function() {
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock < 100) return 'Limited Stock';
  return 'In Stock';
};

export default mongoose.model('Product', productSchema);
