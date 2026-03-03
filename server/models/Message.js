import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  types: {
    type: String,
    enum: ['inquiry', 'bulk-order', 'support', 'feedback', 'partnership'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  senderName: String,
  senderEmail: {
    type: String,
    required: true,
  },
  senderPhone: String,
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  attachments: [
    {
      filename: String,
      url: String,
      uploadedAt: Date,
    },
  ],
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'closed'],
    default: 'new',
  },
  adminResponse: {
    responderName: String,
    response: String,
    responseDate: Date,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: Date,
  closedAt: Date,
}, { timestamps: true });

// Index for search
messageSchema.index({ status: 1, createdAt: -1 });
messageSchema.index({ senderEmail: 1 });
messageSchema.index({ priority: 1 });

export default mongoose.model('Message', messageSchema);
