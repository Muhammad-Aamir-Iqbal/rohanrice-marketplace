import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    businessName: { type: String, default: 'Rohan Rice' },
    ownerName: { type: String, default: 'Zeeshan Ali' },
    email: { type: String, default: 'info@rohanrice.com' },
    phone: { type: String, default: '+92 XXX XXX XXXX' },
    location: { type: String, default: 'Narowal, Punjab, Pakistan' },
    heroTagline: { type: String, default: 'Premium Rice From the Heart of Punjab.' },
    footerTagline: { type: String, default: 'Premium Rice. Trusted Quality.' },
    founderCredit: { type: String, default: 'This platform was founded and built by the founder.' },
    techRights: {
      type: String,
      default: 'All technical architecture, source code, and platform rights are reserved by the founder.',
    },
  },
  { timestamps: true, collection: 'settings' }
);

export default mongoose.models.StoreSettings || mongoose.model('StoreSettings', storeSettingsSchema);
