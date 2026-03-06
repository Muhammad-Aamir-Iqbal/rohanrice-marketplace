import mongoose from 'mongoose';

const IMMUTABLE_LEDGER_ERROR = 'Ledger entries are immutable and cannot be modified or deleted.';

const storeLedgerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['sale', 'stock_addition'],
      required: true,
      index: true,
    },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreProduct', required: true, index: true },
    quantity: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreOrder', default: null, index: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreWorker', default: null, index: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true, collection: 'ledger' }
);

const blockMutation = function blockMutation(next) {
  next(new Error(IMMUTABLE_LEDGER_ERROR));
};

storeLedgerSchema.pre('findOneAndUpdate', blockMutation);
storeLedgerSchema.pre('findByIdAndUpdate', blockMutation);
storeLedgerSchema.pre('updateOne', blockMutation);
storeLedgerSchema.pre('updateMany', blockMutation);
storeLedgerSchema.pre('replaceOne', blockMutation);
storeLedgerSchema.pre('findOneAndDelete', blockMutation);
storeLedgerSchema.pre('findByIdAndDelete', blockMutation);
storeLedgerSchema.pre('deleteOne', blockMutation);
storeLedgerSchema.pre('deleteMany', blockMutation);

export default mongoose.models.StoreLedger || mongoose.model('StoreLedger', storeLedgerSchema);
