import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    businessName: { type: String, default: 'Rohan Rice' },
    ownerName: { type: String, default: 'Zeeshan Ali' },
    email: { type: String, default: 'rohaansaith1911@gmail.com' },
    phone: { type: String, default: '03127871406' },
    whatsappNumber: { type: String, default: '03127871406' },
    easyPaisaNumber: { type: String, default: '03127871406' },
    jazzCashNumber: { type: String, default: '03XX-XXXXXXX' },
    easyPaisaQrImage: { type: String, default: '' },
    jazzCashQrImage: { type: String, default: '' },
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
