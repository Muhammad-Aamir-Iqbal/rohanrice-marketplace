import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import StoreAdmin from '../models/StoreAdmin.js';
import StoreCustomer from '../models/StoreCustomer.js';
import StoreCategory from '../models/StoreCategory.js';
import StoreProduct from '../models/StoreProduct.js';
import StoreCart from '../models/StoreCart.js';
import StoreOrder from '../models/StoreOrder.js';
import StoreOrderItem from '../models/StoreOrderItem.js';
import StoreReview from '../models/StoreReview.js';
import StoreBlogPost from '../models/StoreBlogPost.js';
import StoreVisitorLog from '../models/StoreVisitorLog.js';
import StoreContactMessage from '../models/StoreContactMessage.js';
import StoreOtpSession from '../models/StoreOtpSession.js';
import StoreSettings from '../models/StoreSettings.js';
import StorePayment from '../models/StorePayment.js';
import StoreWorker from '../models/StoreWorker.js';
import StoreLedger from '../models/StoreLedger.js';
import StoreFraudAlert from '../models/StoreFraudAlert.js';
import { sendOTPEmail } from '../services/emailService.js';
import { sendOTPSMS } from '../services/smsService.js';
import { defaultBlogPosts, defaultCategories, defaultProducts, defaultSettings } from '../data/storeSeed.js';

const router = express.Router();

const PHONE_REGEX = /^\+92\d{10}$/;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const STATUS_FLOW = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PENDING_PAYMENT_VERIFICATION: 'PENDING_PAYMENT_VERIFICATION',
  CONFIRMED: 'CONFIRMED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  PAID: 'PAID',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};
const PAYMENT_METHODS = ['cash_on_delivery', 'easypaisa', 'jazzcash'];
const ADMIN_SETTABLE_ORDER_STATUSES = [
  STATUS_FLOW.PENDING_PAYMENT,
  STATUS_FLOW.PENDING_PAYMENT_VERIFICATION,
  STATUS_FLOW.CONFIRMED,
  STATUS_FLOW.OUT_FOR_DELIVERY,
  STATUS_FLOW.DELIVERED,
  STATUS_FLOW.PAID,
  STATUS_FLOW.COMPLETED,
  STATUS_FLOW.CANCELLED,
];
const normalizePakPhone = (raw = '') => {
  const value = String(raw || '').replace(/[^\d+]/g, '');
  if (!value) return '';
  if (value.startsWith('+92')) return value;
  if (value.startsWith('92')) return `+${value}`;
  if (value.startsWith('0')) return `+92${value.slice(1)}`;
  return value.startsWith('+') ? value : `+${value}`;
};

const toId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.toString();
};

const normalizePhone = (value = '') => value.replace(/[\s-]/g, '');
const generateOtpCode = () => String(Math.floor(100000 + Math.random() * 900000));

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const serializeAdmin = (doc) => ({
  id: toId(doc._id),
  name: doc.name,
  email: doc.email,
  phone: doc.phone,
  profileImage: doc.profileImage || '',
  isActive: Boolean(doc.isActive),
  verifiedAt: doc.verifiedAt,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const serializeCustomer = (doc) => ({
  id: toId(doc._id),
  name: doc.name,
  email: doc.email,
  phone: doc.phone,
  profileImage: doc.profileImage || '',
  isActive: Boolean(doc.isActive),
  verifiedAt: doc.verifiedAt,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const serializeCategory = (doc) => ({
  id: toId(doc._id),
  name: doc.name,
  description: doc.description || '',
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const serializeProduct = (doc) => ({
  id: toId(doc._id),
  name: doc.name,
  categoryId: toId(doc.categoryId),
  pricePerKg: Number(doc.pricePerKg || 0),
  stockQuantity: Number(doc.stockQuantity || 0),
  description: doc.description || '',
  image: doc.image || '',
  isFeatured: Boolean(doc.isFeatured),
  rating: Number(doc.rating || 0),
  reviewCount: Number(doc.reviewCount || 0),
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const serializeReview = (doc) => ({
  id: toId(doc._id),
  productId: toId(doc.productId),
  customerId: toId(doc.customerId),
  customerName: doc.customerName,
  rating: Number(doc.rating || 0),
  comment: doc.comment || '',
  isApproved: Boolean(doc.isApproved),
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const serializeBlogPost = (doc) => ({
  id: toId(doc._id),
  title: doc.title,
  slug: doc.slug,
  excerpt: doc.excerpt || '',
  content: doc.content || '',
  image: doc.image || '',
  status: doc.status || 'published',
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const serializeOrder = (doc) => ({
  id: toId(doc._id),
  orderNumber: doc.orderNumber,
  customerId: toId(doc.customerId),
  customerName: doc.customerName,
  customerEmail: doc.customerEmail,
  workerId: toId(doc.workerId),
  items: (doc.items || []).map((item) => ({
    id: toId(item._id),
    productId: toId(item.productId),
    productName: item.productName,
    quantity: Number(item.quantity || 0),
    pricePerKg: Number(item.pricePerKg || 0),
    lineTotal: Number(item.lineTotal || 0),
  })),
  subtotal: Number(doc.subtotal || 0),
  deliveryCharge: Number(doc.deliveryCharge || 0),
  totalAmount: Number(doc.totalAmount || 0),
  paymentMethod: doc.paymentMethod || 'cash_on_delivery',
  orderStatus: doc.orderStatus || STATUS_FLOW.PENDING_PAYMENT,
  stockDeducted: Boolean(doc.stockDeducted),
  paidAt: doc.paidAt,
  deliveredAt: doc.deliveredAt,
  completedAt: doc.completedAt,
  failedPaymentVerifications: Number(doc.failedPaymentVerifications || 0),
  address: doc.address,
  notes: doc.notes || '',
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const serializeContactMessage = (doc) => ({
  id: toId(doc._id),
  name: doc.name,
  email: doc.email,
  phone: doc.phone || '',
  message: doc.message,
  status: doc.status || 'new',
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const serializeVisitorLog = (doc) => ({
  id: toId(doc._id),
  visitorId: doc.visitorId,
  userId: doc.userId || '',
  userRole: doc.userRole || 'guest',
  page: doc.page,
  action: doc.action,
  details: doc.details || {},
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const serializeSettings = (doc) => ({
  businessName: doc.businessName || 'Rohan Rice',
  ownerName: doc.ownerName || 'Zeeshan Ali',
  email: doc.email || 'rohaansaith1911@gmail.com',
  phone: doc.phone || '03127871406',
  whatsappNumber: doc.whatsappNumber || '03127871406',
  easyPaisaNumber: doc.easyPaisaNumber || '03127871406',
  jazzCashNumber: doc.jazzCashNumber || '03XX-XXXXXXX',
  easyPaisaQrImage: doc.easyPaisaQrImage || '',
  jazzCashQrImage: doc.jazzCashQrImage || '',
  location: doc.location || 'Narowal, Punjab, Pakistan',
  heroTagline: doc.heroTagline || 'Premium Rice From the Heart of Punjab.',
  footerTagline: doc.footerTagline || 'Premium Rice. Trusted Quality.',
  founderCredit: doc.founderCredit || 'This platform was founded and built by the founder.',
  techRights:
    doc.techRights || 'All technical architecture, source code, and platform rights are reserved by the founder.',
  updatedAt: doc.updatedAt,
});

const serializePayment = (doc) => ({
  id: toId(doc._id),
  orderId: toId(doc.orderId),
  paymentMethod: doc.paymentMethod,
  amount: Number(doc.amount || 0),
  transactionId: doc.transactionId || '',
  senderPhone: doc.senderPhone || '',
  paymentProofImage: doc.paymentProofImage || '',
  verificationStatus: doc.verificationStatus || 'pending',
  verified: Boolean(doc.verified),
  verifiedByAdmin: toId(doc.verifiedByAdmin),
  verifiedAt: doc.verifiedAt,
  rejectionReason: doc.rejectionReason || '',
  failedAttempts: Number(doc.failedAttempts || 0),
  createdByWorker: toId(doc.createdByWorker),
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const serializeWorker = (doc) => ({
  id: toId(doc._id),
  name: doc.name,
  phone: doc.phone,
  email: doc.email || '',
  profileImage: doc.profileImage || '',
  status: doc.status || 'active',
  notes: doc.notes || '',
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const serializeLedgerEntry = (doc) => ({
  id: toId(doc._id),
  type: doc.type,
  productId: toId(doc.productId),
  quantity: Number(doc.quantity || 0),
  amount: Number(doc.amount || 0),
  orderId: toId(doc.orderId),
  workerId: toId(doc.workerId),
  notes: doc.notes || '',
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const serializeFraudAlert = (doc) => ({
  id: toId(doc._id),
  orderId: toId(doc.orderId),
  workerId: toId(doc.workerId),
  type: doc.type,
  severity: doc.severity || 'medium',
  details: doc.details,
  status: doc.status || 'open',
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const serializeCartItems = (cartDoc) =>
  (cartDoc?.items || []).map((item) => ({
    id: toId(item._id),
    productId: toId(item.productId),
    quantity: Number(item.quantity || 0),
    createdAt: item.createdAt,
  }));

const createToken = ({ role, userId }) => jwt.sign({ role, userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

const decodeToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const getAuthFromRequest = async (req) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded?.userId || !decoded?.role) return null;

  if (decoded.role === 'admin') {
    const admin = await StoreAdmin.findById(decoded.userId).lean();
    if (!admin || !admin.isActive) return null;
    return { role: 'admin', token, user: admin, userId: toId(admin._id) };
  }

  if (decoded.role === 'customer') {
    const customer = await StoreCustomer.findById(decoded.userId).lean();
    if (!customer || !customer.isActive) return null;
    return { role: 'customer', token, user: customer, userId: toId(customer._id) };
  }

  if (decoded.role === 'worker') {
    const worker = await StoreWorker.findById(decoded.userId).lean();
    if (!worker || worker.status !== 'active') return null;
    return { role: 'worker', token, user: worker, userId: toId(worker._id) };
  }

  return null;
};

const requireAuth = async (req, res, next) => {
  const auth = await getAuthFromRequest(req);
  if (!auth) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  req.auth = auth;
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.auth || req.auth.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

const requireCustomer = (req, res, next) => {
  if (!req.auth || req.auth.role !== 'customer') {
    return res.status(403).json({ success: false, message: 'Customer access required' });
  }
  next();
};

const requireWorker = (req, res, next) => {
  if (!req.auth || req.auth.role !== 'worker') {
    return res.status(403).json({ success: false, message: 'Worker access required' });
  }
  next();
};

const safeSendOtpEmail = async (email, otp, purpose) => {
  try {
    await sendOTPEmail(email, otp, purpose);
  } catch (error) {
    // Do not block signup if provider is unavailable.
  }
};

const safeSendOtpSms = async (phone, otp, purpose) => {
  try {
    await sendOTPSMS(phone, otp, purpose);
  } catch (error) {
    // Do not block signup if provider is unavailable.
  }
};

const recalculateProductRating = async (productId) => {
  const objectId = new mongoose.Types.ObjectId(productId);
  const [result] = await StoreReview.aggregate([
    { $match: { productId: objectId, isApproved: true } },
    { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
  ]);

  if (!result) {
    await StoreProduct.findByIdAndUpdate(productId, { rating: 0, reviewCount: 0 });
    return;
  }

  await StoreProduct.findByIdAndUpdate(productId, {
    rating: Number((result.avgRating || 0).toFixed(1)),
    reviewCount: result.reviewCount || 0,
  });
};

const createFraudAlert = async ({ orderId = null, workerId = null, type, details, severity = 'medium' }) => {
  const payload = {
    orderId: orderId || null,
    workerId: workerId || null,
    type,
    details,
    severity,
  };
  await StoreFraudAlert.create(payload);
};

const createOrderSaleLedgerEntries = async (order) => {
  const orderId = toId(order._id);
  const existing = await StoreLedger.countDocuments({ type: 'sale', orderId });
  if (existing > 0) return;

  const docs = (order.items || []).map((item) => ({
    type: 'sale',
    productId: item.productId,
    quantity: Number(item.quantity || 0),
    amount: Number(item.lineTotal || 0),
    orderId: order._id,
    workerId: order.workerId || null,
    notes: `Order ${order.orderNumber}`,
  }));
  if (docs.length) {
    await StoreLedger.insertMany(docs);
  }
};

const completeOrderFinancials = async (orderId) => {
  const order = await StoreOrder.findById(orderId);
  if (!order) return null;

  if (!order.stockDeducted) {
    for (const item of order.items) {
      await StoreProduct.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: -Number(item.quantity || 0) },
      });
    }
    order.stockDeducted = true;
  }

  await createOrderSaleLedgerEntries(order);

  order.orderStatus = STATUS_FLOW.COMPLETED;
  if (!order.completedAt) {
    order.completedAt = new Date();
  }

  await order.save();
  return order.toObject();
};

const ensureSettingsUpgraded = async () => {
  const settings = await StoreSettings.findOne({ key: 'default' });
  if (!settings) return;

  let changed = false;
  const upgrades = {
    email: 'rohaansaith1911@gmail.com',
    phone: '03127871406',
    whatsappNumber: '03127871406',
    easyPaisaNumber: '03127871406',
    jazzCashNumber: '03XX-XXXXXXX',
  };

  for (const [key, value] of Object.entries(upgrades)) {
    if (!settings[key] || String(settings[key]).includes('XXX') || settings[key] === 'info@rohanrice.com') {
      settings[key] = value;
      changed = true;
    }
  }

  if (!settings.founderCredit) {
    settings.founderCredit = defaultSettings.founderCredit;
    changed = true;
  }
  if (!settings.techRights) {
    settings.techRights = defaultSettings.techRights;
    changed = true;
  }

  if (changed) {
    await settings.save();
  }
};

const upgradeLegacyOrderStatuses = async () => {
  const statusMap = {
    pending: STATUS_FLOW.PENDING_PAYMENT,
    confirmed: STATUS_FLOW.CONFIRMED,
    processing: STATUS_FLOW.OUT_FOR_DELIVERY,
    shipped: STATUS_FLOW.OUT_FOR_DELIVERY,
    delivered: STATUS_FLOW.DELIVERED,
    cancelled: STATUS_FLOW.CANCELLED,
  };

  for (const [legacyStatus, nextStatus] of Object.entries(statusMap)) {
    await StoreOrder.updateMany(
      { orderStatus: legacyStatus },
      { $set: { orderStatus: nextStatus } }
    );
  }
};

const ensureSeedData = async () => {
  await StoreSettings.updateOne(
    { key: 'default' },
    { $setOnInsert: { key: 'default', ...defaultSettings } },
    { upsert: true }
  );
  await ensureSettingsUpgraded();

  for (const category of defaultCategories) {
    await StoreCategory.updateOne(
      { name: category.name },
      { $setOnInsert: category },
      { upsert: true }
    );
  }

  const categories = await StoreCategory.find().lean();
  const categoryIdByName = categories.reduce((acc, category) => {
    acc[category.name] = category._id;
    return acc;
  }, {});

  for (const product of defaultProducts) {
    await StoreProduct.updateOne(
      { name: product.name },
      {
        $setOnInsert: {
          name: product.name,
          categoryId: categoryIdByName[product.categoryName],
          pricePerKg: product.pricePerKg,
          stockQuantity: product.stockQuantity,
          description: product.description,
          image: product.image,
          isFeatured: product.isFeatured,
          rating: 0,
          reviewCount: 0,
        },
      },
      { upsert: true }
    );
  }

  for (const blogPost of defaultBlogPosts) {
    await StoreBlogPost.updateOne(
      { slug: blogPost.slug },
      { $setOnInsert: blogPost },
      { upsert: true }
    );
  }

  const workerCount = await StoreWorker.countDocuments();
  if (!workerCount) {
    const workerPasswordHash = await bcrypt.hash('worker123', 10);
    await StoreWorker.create({
      name: 'Default Delivery Worker',
      phone: '+923000000001',
      email: 'worker1@rohanrice.com',
      passwordHash: workerPasswordHash,
      status: 'active',
      notes: 'Default worker account. Change credentials from admin panel.',
    });
  }

  const allProducts = await StoreProduct.find().sort({ createdAt: 1 }).lean();
  const seenProductName = new Set();
  const duplicateProductIds = [];
  for (const product of allProducts) {
    if (seenProductName.has(product.name)) {
      duplicateProductIds.push(product._id);
    } else {
      seenProductName.add(product.name);
    }
  }
  if (duplicateProductIds.length) {
    const refs = await Promise.all([
      StoreOrder.countDocuments({ 'items.productId': { $in: duplicateProductIds } }),
      StoreOrderItem.countDocuments({ productId: { $in: duplicateProductIds } }),
      StoreReview.countDocuments({ productId: { $in: duplicateProductIds } }),
      StoreCart.countDocuments({ 'items.productId': { $in: duplicateProductIds } }),
      StoreLedger.countDocuments({ productId: { $in: duplicateProductIds } }),
    ]);
    const totalRefs = refs.reduce((sum, count) => sum + count, 0);
    if (!totalRefs) {
      await StoreProduct.deleteMany({ _id: { $in: duplicateProductIds } });
    }
  }

  await upgradeLegacyOrderStatuses();
};

const getOrCreateCustomerCart = async (customerId) => {
  let cart = await StoreCart.findOne({ customerId });
  if (!cart) {
    cart = await StoreCart.create({ customerId, items: [] });
  }
  return cart;
};

const getBootstrapData = async (auth) => {
  await ensureSeedData();

  const [settingsDoc, categories, products] = await Promise.all([
    StoreSettings.findOne({ key: 'default' }).lean(),
    StoreCategory.find().sort({ createdAt: -1 }).lean(),
    StoreProduct.find().sort({ createdAt: -1 }).lean(),
  ]);

  const baseData = {
    admins: [],
    customers: [],
    workers: [],
    categories: categories.map(serializeCategory),
    products: products.map(serializeProduct),
    orders: [],
    reviews: [],
    blogPosts: [],
    visitorLogs: [],
    contactMessages: [],
    payments: [],
    ledger: [],
    fraudAlerts: [],
    carts: {},
    settings: serializeSettings(settingsDoc || {}),
  };

  if (!auth) {
    const [reviews, blogPosts] = await Promise.all([
      StoreReview.find({ isApproved: true }).sort({ createdAt: -1 }).lean(),
      StoreBlogPost.find({ status: 'published' }).sort({ createdAt: -1 }).lean(),
    ]);

    return {
      session: null,
      data: {
        ...baseData,
        reviews: reviews.map(serializeReview),
        blogPosts: blogPosts.map(serializeBlogPost),
      },
    };
  }

  if (auth.role === 'customer') {
    const [customer, cart, orders, reviews, blogPosts] = await Promise.all([
      StoreCustomer.findById(auth.userId).lean(),
      StoreCart.findOne({ customerId: auth.userId }).lean(),
      StoreOrder.find({ customerId: auth.userId }).sort({ createdAt: -1 }).lean(),
      StoreReview.find({ $or: [{ isApproved: true }, { customerId: auth.userId }] })
        .sort({ createdAt: -1 })
        .lean(),
      StoreBlogPost.find({ status: 'published' }).sort({ createdAt: -1 }).lean(),
    ]);

    const orderIds = orders.map((order) => order._id);
    const payments = await StorePayment.find({ orderId: { $in: orderIds } }).sort({ createdAt: -1 }).lean();

    return {
      session: {
        role: 'customer',
        user: customer ? serializeCustomer(customer) : null,
      },
      data: {
        ...baseData,
        customers: customer ? [serializeCustomer(customer)] : [],
        orders: orders.map(serializeOrder),
        reviews: reviews.map(serializeReview),
        blogPosts: blogPosts.map(serializeBlogPost),
        payments: payments.map(serializePayment),
        carts: customer ? { [toId(customer._id)]: serializeCartItems(cart) } : {},
      },
    };
  }

  if (auth.role === 'worker') {
    const [worker, orders] = await Promise.all([
      StoreWorker.findById(auth.userId).lean(),
      StoreOrder.find({ workerId: auth.userId }).sort({ createdAt: -1 }).lean(),
    ]);
    const orderIds = orders.map((order) => order._id);
    const payments = await StorePayment.find({
      $or: [{ orderId: { $in: orderIds } }, { createdByWorker: auth.userId }],
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      session: {
        role: 'worker',
        user: worker ? serializeWorker(worker) : null,
      },
      data: {
        ...baseData,
        workers: worker ? [serializeWorker(worker)] : [],
        orders: orders.map(serializeOrder),
        payments: payments.map(serializePayment),
      },
    };
  }

  const [admins, customers, workers, orders, reviews, blogPosts, visitorLogs, contactMessages, payments, ledger, fraudAlerts] =
    await Promise.all([
      StoreAdmin.find().sort({ createdAt: -1 }).lean(),
      StoreCustomer.find().sort({ createdAt: -1 }).lean(),
      StoreWorker.find().sort({ createdAt: -1 }).lean(),
      StoreOrder.find().sort({ createdAt: -1 }).lean(),
      StoreReview.find().sort({ createdAt: -1 }).lean(),
      StoreBlogPost.find().sort({ createdAt: -1 }).lean(),
      StoreVisitorLog.find().sort({ createdAt: -1 }).limit(5000).lean(),
      StoreContactMessage.find().sort({ createdAt: -1 }).lean(),
      StorePayment.find().sort({ createdAt: -1 }).lean(),
      StoreLedger.find().sort({ createdAt: -1 }).limit(5000).lean(),
      StoreFraudAlert.find().sort({ createdAt: -1 }).limit(5000).lean(),
    ]);

  return {
    session: {
      role: 'admin',
      user: serializeAdmin(auth.user),
    },
    data: {
      ...baseData,
      admins: admins.map(serializeAdmin),
      customers: customers.map(serializeCustomer),
      workers: workers.map(serializeWorker),
      orders: orders.map(serializeOrder),
      reviews: reviews.map(serializeReview),
      blogPosts: blogPosts.map(serializeBlogPost),
      visitorLogs: visitorLogs.map(serializeVisitorLog),
      contactMessages: contactMessages.map(serializeContactMessage),
      payments: payments.map(serializePayment),
      ledger: ledger.map(serializeLedgerEntry),
      fraudAlerts: fraudAlerts.map(serializeFraudAlert),
    },
  };
};

router.get('/bootstrap', async (req, res) => {
  try {
    const auth = await getAuthFromRequest(req);
    const payload = await getBootstrapData(auth);
    return res.json({ success: true, ...payload });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/auth/signup/request', async (req, res) => {
  try {
    const { role, name, email, phone, password, profileImage = '' } = req.body;
    const normalizedRole = role === 'admin' ? 'admin' : role === 'customer' ? 'customer' : '';
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPhone = normalizePhone(phone);
    const normalizedName = String(name || '').trim();

    if (!normalizedRole || !normalizedName || !normalizedEmail || !normalizedPhone || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    if (!PHONE_REGEX.test(normalizedPhone)) {
      return res.status(400).json({ success: false, message: 'Phone must be in +92XXXXXXXXXX format.' });
    }
    if (normalizedRole === 'admin' && !profileImage) {
      return res.status(400).json({ success: false, message: 'Profile image is required for admin signup.' });
    }

    const [existingAdmin, existingCustomer] = await Promise.all([
      StoreAdmin.findOne({ $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] }).lean(),
      StoreCustomer.findOne({ $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] }).lean(),
    ]);
    if (existingAdmin || existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email or phone already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const emailOtp = generateOtpCode();
    const phoneOtp = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await StoreOtpSession.deleteMany({ 'payload.email': normalizedEmail, role: normalizedRole });
    const otpSession = await StoreOtpSession.create({
      role: normalizedRole,
      payload: {
        name: normalizedName,
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash,
        profileImage,
      },
      emailOtp,
      phoneOtp,
      expiresAt,
    });

    await Promise.all([
      safeSendOtpEmail(normalizedEmail, emailOtp, `${normalizedRole}_signup`),
      safeSendOtpSms(normalizedPhone, phoneOtp, `${normalizedRole}_signup`),
    ]);

    const includeDebugOtp =
      process.env.EXPOSE_DEBUG_OTP === 'true' ||
      process.env.NODE_ENV !== 'production' ||
      !process.env.SMTP_HOST ||
      !process.env.TWILIO_ACCOUNT_SID;

    return res.status(201).json({
      success: true,
      message: 'OTP sent to email and phone.',
      otpSessionId: toId(otpSession._id),
      ...(includeDebugOtp ? { debugEmailOtp: emailOtp, debugPhoneOtp: phoneOtp } : {}),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/auth/signup/verify', async (req, res) => {
  try {
    const { otpSessionId, emailOtp, phoneOtp } = req.body;
    if (!otpSessionId || !emailOtp || !phoneOtp) {
      return res.status(400).json({
        success: false,
        message: 'OTP session and both OTP codes are required.',
      });
    }

    const otpSession = await StoreOtpSession.findById(otpSessionId).lean();
    if (!otpSession) {
      return res.status(404).json({
        success: false,
        message: 'OTP session not found. Please sign up again.',
      });
    }
    if (new Date(otpSession.expiresAt).getTime() < Date.now()) {
      await StoreOtpSession.findByIdAndDelete(otpSessionId);
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new OTP.' });
    }
    if (String(emailOtp) !== otpSession.emailOtp || String(phoneOtp) !== otpSession.phoneOtp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP codes.' });
    }

    const model = otpSession.role === 'admin' ? StoreAdmin : StoreCustomer;
    const created = await model.create({
      name: otpSession.payload.name,
      email: otpSession.payload.email,
      phone: otpSession.payload.phone,
      passwordHash: otpSession.payload.passwordHash,
      profileImage: otpSession.payload.profileImage || '',
      isActive: true,
      verifiedAt: new Date(),
    });

    if (otpSession.role === 'customer') {
      await getOrCreateCustomerCart(created._id);
    }

    await StoreOtpSession.findByIdAndDelete(otpSessionId);

    const token = createToken({ role: otpSession.role, userId: toId(created._id) });
    return res.json({
      success: true,
      message: 'Account verified and activated.',
      token,
      role: otpSession.role,
      user: otpSession.role === 'admin' ? serializeAdmin(created) : serializeCustomer(created),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { role, email, password } = req.body;
    const normalizedRole = role === 'admin' ? 'admin' : role === 'customer' ? 'customer' : '';
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedRole || !normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: 'Role, email and password are required.' });
    }

    const model = normalizedRole === 'admin' ? StoreAdmin : StoreCustomer;
    const user = await model.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = createToken({ role: normalizedRole, userId: toId(user._id) });
    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      role: normalizedRole,
      user: normalizedRole === 'admin' ? serializeAdmin(user) : serializeCustomer(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/auth/worker/login', async (req, res) => {
  try {
    const phone = normalizePakPhone(req.body.phone || '');
    const password = String(req.body.password || '');
    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'Phone and password are required.' });
    }

    const worker = await StoreWorker.findOne({ phone }).select('+passwordHash');
    if (!worker || worker.status !== 'active') {
      return res.status(401).json({ success: false, message: 'Invalid worker credentials.' });
    }

    const passwordValid = await bcrypt.compare(password, worker.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Invalid worker credentials.' });
    }

    const token = createToken({ role: 'worker', userId: toId(worker._id) });
    return res.json({
      success: true,
      message: 'Worker login successful.',
      token,
      role: 'worker',
      user: serializeWorker(worker),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/auth/me', requireAuth, async (req, res) =>
  res.json({
    success: true,
    role: req.auth.role,
    user:
      req.auth.role === 'admin'
        ? serializeAdmin(req.auth.user)
        : req.auth.role === 'worker'
          ? serializeWorker(req.auth.user)
          : serializeCustomer(req.auth.user),
  })
);

router.post('/auth/logout', requireAuth, async (req, res) => res.json({ success: true, message: 'Logged out.' }));

router.put('/profile', requireAuth, async (req, res) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) {
      const value = String(req.body.name || '').trim();
      if (!value) return res.status(400).json({ success: false, message: 'Name cannot be empty.' });
      updates.name = value;
    }
    if (req.body.phone !== undefined) {
      const normalizedPhone = normalizePhone(req.body.phone);
      if (!PHONE_REGEX.test(normalizedPhone)) {
        return res.status(400).json({ success: false, message: 'Phone must be in +92XXXXXXXXXX format.' });
      }
      updates.phone = normalizedPhone;
    }
    if (req.body.profileImage !== undefined) {
      updates.profileImage = req.body.profileImage || '';
    }

    const model =
      req.auth.role === 'admin' ? StoreAdmin : req.auth.role === 'worker' ? StoreWorker : StoreCustomer;
    const user = await model.findByIdAndUpdate(req.auth.userId, updates, { new: true, runValidators: true }).lean();
    return res.json({
      success: true,
      message: 'Profile updated.',
      user:
        req.auth.role === 'admin'
          ? serializeAdmin(user)
          : req.auth.role === 'worker'
            ? serializeWorker(user)
            : serializeCustomer(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/visitor-log', async (req, res) => {
  try {
    const auth = await getAuthFromRequest(req);
    const { page, action, details = {}, visitorId } = req.body;
    if (!page || !action) {
      return res.status(400).json({ success: false, message: 'Page and action are required.' });
    }

    await StoreVisitorLog.create({
      visitorId: String(visitorId || `visitor_${Date.now()}`),
      userId: auth?.userId || '',
      userRole: auth?.role || 'guest',
      page: String(page),
      action: String(action),
      details,
    });
    return res.json({ success: true, message: 'Visitor event tracked.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone = '', message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
    }

    await StoreContactMessage.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: normalizePhone(String(phone || '')),
      message: String(message).trim(),
      status: 'new',
    });

    return res.status(201).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/cart', requireAuth, requireCustomer, async (req, res) => {
  try {
    const cart = await getOrCreateCustomerCart(req.auth.userId);
    return res.json({ success: true, items: serializeCartItems(cart) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/cart/add', requireAuth, requireCustomer, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const parsedQuantity = Number(quantity || 1);
    if (!productId || Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ success: false, message: 'Valid product and quantity are required.' });
    }

    const product = await StoreProduct.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    if (product.stockQuantity <= 0) {
      return res.status(400).json({ success: false, message: 'Product is out of stock.' });
    }

    const cart = await getOrCreateCustomerCart(req.auth.userId);
    const existing = cart.items.find((item) => toId(item.productId) === toId(product._id));
    if (existing) {
      existing.quantity = Math.min(existing.quantity + parsedQuantity, product.stockQuantity);
    } else {
      cart.items.push({
        productId: product._id,
        quantity: Math.min(parsedQuantity, product.stockQuantity),
      });
    }

    await cart.save();

    return res.json({
      success: true,
      message: 'Product added to cart.',
      items: serializeCartItems(cart),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/cart/item', requireAuth, requireCustomer, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const parsedQuantity = Number(quantity);
    if (!productId || Number.isNaN(parsedQuantity)) {
      return res.status(400).json({ success: false, message: 'Product and quantity are required.' });
    }

    const cart = await getOrCreateCustomerCart(req.auth.userId);
    cart.items = cart.items
      .map((item) => {
        if (toId(item.productId) !== String(productId)) return item;
        return {
          ...item.toObject(),
          quantity: parsedQuantity,
        };
      })
      .filter((item) => item.quantity > 0);
    await cart.save();

    return res.json({
      success: true,
      message: 'Cart updated.',
      items: serializeCartItems(cart),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/cart/item/:productId', requireAuth, requireCustomer, async (req, res) => {
  try {
    const cart = await getOrCreateCustomerCart(req.auth.userId);
    cart.items = cart.items.filter((item) => toId(item.productId) !== req.params.productId);
    await cart.save();
    return res.json({
      success: true,
      message: 'Item removed from cart.',
      items: serializeCartItems(cart),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/cart/clear', requireAuth, requireCustomer, async (req, res) => {
  try {
    const cart = await getOrCreateCustomerCart(req.auth.userId);
    cart.items = [];
    await cart.save();
    return res.json({ success: true, message: 'Cart cleared.', items: [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

const createOrder = async (req, res) => {
  try {
    const {
      address,
      notes = '',
      paymentMethod = 'cash_on_delivery',
      transactionId = '',
      senderPhone = '',
      paymentProofImage = '',
    } = req.body;
    const normalizedPaymentMethod = PAYMENT_METHODS.includes(paymentMethod) ? paymentMethod : '';
    if (!normalizedPaymentMethod) {
      return res.status(400).json({ success: false, message: 'Invalid payment method.' });
    }
    if (!address?.fullName || !address?.phone || !address?.city || !address?.area || !address?.addressLine) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required.' });
    }

    if (
      normalizedPaymentMethod !== 'cash_on_delivery' &&
      (!transactionId || !senderPhone || !paymentProofImage)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID, sender phone, and payment screenshot are required for wallet payments.',
      });
    }

    const cart = await getOrCreateCustomerCart(req.auth.userId);
    if (!cart.items.length) return res.status(400).json({ success: false, message: 'Cart is empty.' });

    const products = await StoreProduct.find({ _id: { $in: cart.items.map((item) => item.productId) } });
    const productMap = products.reduce((acc, product) => {
      acc[toId(product._id)] = product;
      return acc;
    }, {});

    const orderItems = [];
    for (const cartItem of cart.items) {
      const product = productMap[toId(cartItem.productId)];
      if (!product) return res.status(400).json({ success: false, message: 'One or more cart products are invalid.' });
      if (cartItem.quantity > product.stockQuantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}.` });
      }

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: cartItem.quantity,
        pricePerKg: product.pricePerKg,
        lineTotal: Number((cartItem.quantity * product.pricePerKg).toFixed(2)),
      });
    }

    const subtotal = Number(orderItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
    const deliveryCharge = subtotal > 5000 ? 0 : 250;
    const totalAmount = Number((subtotal + deliveryCharge).toFixed(2));
    const initialStatus =
      normalizedPaymentMethod === 'cash_on_delivery'
        ? STATUS_FLOW.CONFIRMED
        : STATUS_FLOW.PENDING_PAYMENT_VERIFICATION;

    const order = await StoreOrder.create({
      orderNumber: `RR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      customerId: req.auth.userId,
      customerName: req.auth.user.name,
      customerEmail: req.auth.user.email,
      items: orderItems,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentMethod: normalizedPaymentMethod,
      orderStatus: initialStatus,
      address,
      notes,
    });

    await StoreOrderItem.insertMany(
      orderItems.map((item) => ({
        orderId: order._id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        pricePerKg: item.pricePerKg,
        lineTotal: item.lineTotal,
        customerId: req.auth.userId,
      }))
    );

    let payment = null;
    if (normalizedPaymentMethod !== 'cash_on_delivery') {
      const paymentDoc = await StorePayment.create({
        orderId: order._id,
        paymentMethod: normalizedPaymentMethod,
        amount: totalAmount,
        transactionId: String(transactionId).trim(),
        senderPhone: normalizePakPhone(senderPhone),
        paymentProofImage: paymentProofImage || '',
        verificationStatus: 'pending',
        verified: false,
      });
      payment = serializePayment(paymentDoc);
    }

    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message:
        normalizedPaymentMethod === 'cash_on_delivery'
          ? 'Order confirmed. Cash will be collected on delivery.'
          : 'Order submitted. Payment is pending admin verification.',
      order: serializeOrder(order),
      payment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

router.post('/orders', requireAuth, requireCustomer, createOrder);
router.post('/orders/create', requireAuth, requireCustomer, createOrder);

router.get('/orders', requireAuth, async (req, res) => {
  try {
    let filter = { customerId: req.auth.userId };
    if (req.auth.role === 'admin') filter = {};
    if (req.auth.role === 'worker') filter = { workerId: req.auth.userId };
    const orders = await StoreOrder.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, orders: orders.map(serializeOrder) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/orders/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    if (!ADMIN_SETTABLE_ORDER_STATUSES.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Valid order status is required.' });
    }

    const order = await StoreOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (orderStatus === STATUS_FLOW.COMPLETED) {
      if (order.paymentMethod !== 'cash_on_delivery') {
        const approvedPayment = await StorePayment.findOne({
          orderId: order._id,
          verificationStatus: 'approved',
          verified: true,
        }).lean();
        if (!approvedPayment) {
          return res.status(400).json({
            success: false,
            message: 'Wallet payment must be approved before completing this order.',
          });
        }
      }
      const completedOrder = await completeOrderFinancials(order._id);
      return res.json({ success: true, message: 'Order marked as completed.', order: serializeOrder(completedOrder) });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === STATUS_FLOW.DELIVERED) {
      order.deliveredAt = new Date();
      if (order.paymentMethod !== 'cash_on_delivery') {
        const approvedPayment = await StorePayment.findOne({
          orderId: order._id,
          verificationStatus: 'approved',
          verified: true,
        }).lean();
        if (!approvedPayment) {
          await createFraudAlert({
            orderId: order._id,
            workerId: order.workerId || null,
            type: 'missing_payment_proof',
            severity: 'high',
            details: `Order ${order.orderNumber} was delivered without approved wallet payment proof.`,
          });
        }
      }
    }
    if (orderStatus === STATUS_FLOW.PAID) {
      order.paidAt = new Date();
    }

    await order.save();
    return res.json({ success: true, message: 'Order status updated.', order: serializeOrder(order) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/reviews', requireAuth, requireCustomer, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const parsedRating = Number(rating);
    if (!productId || Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5 || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Valid product, rating (1-5), and comment are required.',
      });
    }
    const product = await StoreProduct.findById(productId).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const existing = await StoreReview.findOne({ productId, customerId: req.auth.userId }).lean();
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
    }

    await StoreReview.create({
      productId,
      customerId: req.auth.userId,
      customerName: req.auth.user.name,
      rating: parsedRating,
      comment: String(comment).trim(),
      isApproved: false,
    });
    return res.status(201).json({ success: true, message: 'Review submitted and awaiting admin approval.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/reviews/:id/approve', requireAuth, requireAdmin, async (req, res) => {
  try {
    const approve = req.body.approve !== false;
    const review = await StoreReview.findByIdAndUpdate(req.params.id, { isApproved: approve }, { new: true }).lean();
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

    await recalculateProductRating(review.productId);
    return res.json({
      success: true,
      message: approve ? 'Review approved.' : 'Review unapproved.',
      review: serializeReview(review),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/reviews/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const review = await StoreReview.findByIdAndDelete(req.params.id).lean();
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    await recalculateProductRating(review.productId);
    return res.json({ success: true, message: 'Review deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/categories', requireAuth, requireAdmin, async (req, res) => {
  try {
    const normalizedName = String(req.body.name || '').trim();
    const description = String(req.body.description || '').trim();
    if (!normalizedName) return res.status(400).json({ success: false, message: 'Category name is required.' });

    const category = await StoreCategory.create({ name: normalizedName, description });
    return res.status(201).json({
      success: true,
      message: 'Category created.',
      category: serializeCategory(category),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/categories/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) {
      const name = String(req.body.name || '').trim();
      if (!name) return res.status(400).json({ success: false, message: 'Category name cannot be empty.' });
      updates.name = name;
    }
    if (req.body.description !== undefined) {
      updates.description = String(req.body.description || '').trim();
    }

    const category = await StoreCategory.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean();
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    return res.json({
      success: true,
      message: 'Category updated.',
      category: serializeCategory(category),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/categories/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const productCount = await StoreProduct.countDocuments({ categoryId: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category while products are assigned to it.',
      });
    }

    const deleted = await StoreCategory.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ success: false, message: 'Category not found.' });
    return res.json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/products', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, categoryId, pricePerKg, stockQuantity, description, image = '', isFeatured = false } = req.body;
    if (!name || !categoryId || !pricePerKg || stockQuantity === undefined || !description) {
      return res.status(400).json({ success: false, message: 'Please fill all required product fields.' });
    }

    const category = await StoreCategory.findById(categoryId).lean();
    if (!category) return res.status(400).json({ success: false, message: 'Invalid category selected.' });

    const product = await StoreProduct.create({
      name: String(name).trim(),
      categoryId,
      pricePerKg: Number(pricePerKg),
      stockQuantity: Number(stockQuantity),
      description: String(description).trim(),
      image: image || '',
      isFeatured: Boolean(isFeatured),
      rating: 0,
      reviewCount: 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Product added successfully.',
      product: serializeProduct(product),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/products/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.pricePerKg !== undefined) updates.pricePerKg = Number(updates.pricePerKg);
    if (updates.stockQuantity !== undefined) updates.stockQuantity = Number(updates.stockQuantity);
    if (updates.isFeatured !== undefined) updates.isFeatured = Boolean(updates.isFeatured);

    const product = await StoreProduct.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      product: serializeProduct(product),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/products/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await StoreProduct.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found.' });

    await Promise.all([
      StoreReview.deleteMany({ productId: req.params.id }),
      StoreCart.updateMany({ 'items.productId': req.params.id }, { $pull: { items: { productId: req.params.id } } }),
    ]);

    return res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/blog', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, image = '', status = 'published' } = req.body;
    if (!title || !excerpt || !content) {
      return res.status(400).json({ success: false, message: 'Title, excerpt, and content are required.' });
    }

    let slug = toSlug(title);
    const exists = await StoreBlogPost.findOne({ slug }).lean();
    if (exists) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const post = await StoreBlogPost.create({
      title: String(title).trim(),
      slug,
      excerpt: String(excerpt).trim(),
      content: String(content).trim(),
      image: image || '',
      status: status === 'draft' ? 'draft' : 'published',
    });

    return res.status(201).json({
      success: true,
      message: 'Blog post created.',
      post: serializeBlogPost(post),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/blog/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.title) {
      let slug = toSlug(updates.title);
      const conflict = await StoreBlogPost.findOne({ slug, _id: { $ne: req.params.id } }).lean();
      if (conflict) slug = `${slug}-${Date.now().toString().slice(-4)}`;
      updates.slug = slug;
    }

    const post = await StoreBlogPost.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean();
    if (!post) return res.status(404).json({ success: false, message: 'Blog post not found.' });

    return res.json({
      success: true,
      message: 'Blog post updated.',
      post: serializeBlogPost(post),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/blog/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await StoreBlogPost.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ success: false, message: 'Blog post not found.' });
    return res.json({ success: true, message: 'Blog post deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/messages/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const status = ['new', 'read', 'resolved'].includes(req.body.status) ? req.body.status : '';
    if (!status) return res.status(400).json({ success: false, message: 'Invalid message status.' });

    const message = await StoreContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();
    if (!message) return res.status(404).json({ success: false, message: 'Message not found.' });

    return res.json({
      success: true,
      message: 'Message status updated.',
      contactMessage: serializeContactMessage(message),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/payment-options', async (req, res) => {
  try {
    await ensureSeedData();
    const settings = await StoreSettings.findOne({ key: 'default' }).lean();
    const serialized = serializeSettings(settings || {});
    return res.json({
      success: true,
      paymentOptions: {
        cashOnDelivery: true,
        easyPaisaNumber: serialized.easyPaisaNumber,
        jazzCashNumber: serialized.jazzCashNumber,
        easyPaisaQrImage: serialized.easyPaisaQrImage,
        jazzCashQrImage: serialized.jazzCashQrImage,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/payments/upload', requireAuth, async (req, res) => {
  try {
    const { orderId, paymentMethod, transactionId = '', senderPhone = '', paymentProofImage = '' } = req.body;
    const normalizedPaymentMethod = PAYMENT_METHODS.includes(paymentMethod) ? paymentMethod : '';

    if (!orderId || !normalizedPaymentMethod || !transactionId || !senderPhone || !paymentProofImage) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, payment method, transaction ID, sender phone, and screenshot are required.',
      });
    }

    const order = await StoreOrder.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (req.auth.role === 'customer' && toId(order.customerId) !== req.auth.userId) {
      return res.status(403).json({ success: false, message: 'You can only upload payments for your own orders.' });
    }
    if (req.auth.role === 'worker' && toId(order.workerId) !== req.auth.userId) {
      return res.status(403).json({ success: false, message: 'You can only upload payments for assigned deliveries.' });
    }

    const payment = await StorePayment.create({
      orderId: order._id,
      paymentMethod: normalizedPaymentMethod,
      amount: Number(order.totalAmount || 0),
      transactionId: String(transactionId).trim(),
      senderPhone: normalizePakPhone(senderPhone),
      paymentProofImage,
      verificationStatus: 'pending',
      verified: false,
      createdByWorker: req.auth.role === 'worker' ? req.auth.userId : null,
    });

    if (normalizedPaymentMethod !== 'cash_on_delivery') {
      order.orderStatus = STATUS_FLOW.PENDING_PAYMENT_VERIFICATION;
      await order.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Payment proof uploaded and pending admin verification.',
      payment: serializePayment(payment),
      order: serializeOrder(order),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/orders/mark-paid', requireAuth, async (req, res) => {
  try {
    if (!['admin', 'worker'].includes(req.auth.role)) {
      return res.status(403).json({ success: false, message: 'Only admin or worker can mark orders as paid.' });
    }

    const { orderId, paymentProofImage = '', transactionId = '', senderPhone = '', complete = true } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: 'Order ID is required.' });

    const order = await StoreOrder.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (req.auth.role === 'worker' && toId(order.workerId) !== req.auth.userId) {
      return res.status(403).json({ success: false, message: 'You can only mark your assigned orders as paid.' });
    }

    if (order.paymentMethod !== 'cash_on_delivery') {
      let approvedPayment = await StorePayment.findOne({
        orderId: order._id,
        verificationStatus: 'approved',
        verified: true,
      }).lean();

      if (!approvedPayment && paymentProofImage && transactionId && senderPhone) {
        await StorePayment.create({
          orderId: order._id,
          paymentMethod: order.paymentMethod,
          amount: Number(order.totalAmount || 0),
          transactionId: String(transactionId).trim(),
          senderPhone: normalizePakPhone(senderPhone),
          paymentProofImage,
          verificationStatus: 'pending',
          verified: false,
          createdByWorker: req.auth.role === 'worker' ? req.auth.userId : null,
        });
      }

      approvedPayment = await StorePayment.findOne({
        orderId: order._id,
        verificationStatus: 'approved',
        verified: true,
      }).lean();

      if (!approvedPayment) {
        order.orderStatus = STATUS_FLOW.PENDING_PAYMENT_VERIFICATION;
        await order.save();
        return res.status(400).json({
          success: false,
          message: 'Wallet payment is not approved yet. Uploaded proof has been sent for verification.',
          order: serializeOrder(order),
        });
      }
    }

    if (req.auth.role === 'worker') {
      order.workerId = req.auth.userId;
    }
    order.orderStatus = STATUS_FLOW.PAID;
    order.paidAt = new Date();
    await order.save();

    if (!paymentProofImage && order.paymentMethod === 'cash_on_delivery') {
      await createFraudAlert({
        orderId: order._id,
        workerId: order.workerId || null,
        type: 'missing_payment_proof',
        severity: 'medium',
        details: `Cash payment marked as paid for ${order.orderNumber} without proof upload.`,
      });
    }

    let latestOrder = order.toObject();
    if (complete) {
      const completed = await completeOrderFinancials(order._id);
      latestOrder = completed || latestOrder;
    }

    if (req.auth.role === 'worker' && order.paymentMethod === 'cash_on_delivery') {
      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const workerOrders = await StoreOrder.find({
        workerId: req.auth.userId,
        paymentMethod: 'cash_on_delivery',
        paidAt: { $gte: dayStart, $lt: dayEnd },
        orderStatus: { $in: [STATUS_FLOW.PAID, STATUS_FLOW.COMPLETED] },
      }).lean();

      const expectedAmount = workerOrders.reduce((sum, workerOrder) => sum + Number(workerOrder.totalAmount || 0), 0);
      const orderIds = workerOrders.map((workerOrder) => workerOrder._id);
      const ledgerEntries = await StoreLedger.find({
        type: 'sale',
        orderId: { $in: orderIds },
        workerId: req.auth.userId,
      }).lean();
      const ledgerAmount = ledgerEntries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
      const delta = Math.abs(expectedAmount - ledgerAmount);
      if (delta > 1) {
        const dateKey = dayStart.toISOString().slice(0, 10);
        const existing = await StoreFraudAlert.findOne({
          workerId: req.auth.userId,
          type: 'daily_collection_mismatch',
          details: { $regex: dateKey },
        }).lean();
        if (!existing) {
          await createFraudAlert({
            orderId: order._id,
            workerId: req.auth.userId,
            type: 'daily_collection_mismatch',
            severity: 'high',
            details: `Cash mismatch on ${dateKey}: expected ${expectedAmount}, ledger ${ledgerAmount}.`,
          });
        }
      }
    }

    return res.json({
      success: true,
      message: complete ? 'Order marked paid and completed.' : 'Order marked as paid.',
      order: serializeOrder(latestOrder),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/payments', requireAuth, async (req, res) => {
  try {
    let payments = [];
    if (req.auth.role === 'admin') {
      payments = await StorePayment.find().sort({ createdAt: -1 }).lean();
    } else if (req.auth.role === 'worker') {
      payments = await StorePayment.find({ createdByWorker: req.auth.userId }).sort({ createdAt: -1 }).lean();
    } else {
      const orders = await StoreOrder.find({ customerId: req.auth.userId }).select('_id').lean();
      const orderIds = orders.map((order) => order._id);
      payments = await StorePayment.find({ orderId: { $in: orderIds } }).sort({ createdAt: -1 }).lean();
    }
    return res.json({ success: true, payments: payments.map(serializePayment) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/admin/orders', requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await StoreOrder.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, orders: orders.map(serializeOrder) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/admin/payments', requireAuth, requireAdmin, async (req, res) => {
  try {
    const statusFilter = String(req.query.status || '').toLowerCase();
    const query = {};
    if (['pending', 'approved', 'rejected'].includes(statusFilter)) {
      query.verificationStatus = statusFilter;
    }
    const payments = await StorePayment.find(query).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, payments: payments.map(serializePayment) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/admin/payments/:id/verify', requireAuth, requireAdmin, async (req, res) => {
  try {
    const approve = req.body.approve === true;
    const rejectionReason = String(req.body.rejectionReason || '').trim();

    const payment = await StorePayment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });

    const order = await StoreOrder.findById(payment.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (approve) {
      payment.verificationStatus = 'approved';
      payment.verified = true;
      payment.verifiedByAdmin = req.auth.userId;
      payment.verifiedAt = new Date();
      payment.rejectionReason = '';
      await payment.save();

      if (
        [STATUS_FLOW.PENDING_PAYMENT, STATUS_FLOW.PENDING_PAYMENT_VERIFICATION].includes(order.orderStatus)
      ) {
        order.orderStatus = STATUS_FLOW.CONFIRMED;
        await order.save();
      }

      return res.json({
        success: true,
        message: 'Payment approved successfully.',
        payment: serializePayment(payment),
        order: serializeOrder(order),
      });
    }

    payment.verificationStatus = 'rejected';
    payment.verified = false;
    payment.rejectionReason = rejectionReason || 'Payment details do not match records.';
    payment.failedAttempts = Number(payment.failedAttempts || 0) + 1;
    await payment.save();

    order.failedPaymentVerifications = Number(order.failedPaymentVerifications || 0) + 1;
    order.orderStatus = STATUS_FLOW.PENDING_PAYMENT;
    await order.save();

    if (order.failedPaymentVerifications >= 3) {
      await createFraudAlert({
        orderId: order._id,
        workerId: order.workerId || null,
        type: 'multiple_failed_verifications',
        severity: 'high',
        details: `Order ${order.orderNumber} has ${order.failedPaymentVerifications} failed payment verifications.`,
      });
    }

    return res.json({
      success: true,
      message: 'Payment rejected.',
      payment: serializePayment(payment),
      order: serializeOrder(order),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/admin/workers', requireAuth, requireAdmin, async (req, res) => {
  try {
    const workers = await StoreWorker.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, workers: workers.map(serializeWorker) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/workers', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, phone, email = '', password, profileImage = '', status = 'active', notes = '' } = req.body;
    const normalizedPhone = normalizePakPhone(phone || '');
    if (!name || !normalizedPhone || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone and password are required.' });
    }
    if (!PHONE_REGEX.test(normalizedPhone)) {
      return res.status(400).json({ success: false, message: 'Worker phone must be in +92XXXXXXXXXX format.' });
    }

    const existing = await StoreWorker.findOne({
      $or: [{ phone: normalizedPhone }, ...(email ? [{ email: String(email).trim().toLowerCase() }] : [])],
    }).lean();
    if (existing) {
      return res.status(400).json({ success: false, message: 'Worker with this phone/email already exists.' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const worker = await StoreWorker.create({
      name: String(name).trim(),
      phone: normalizedPhone,
      email: String(email || '').trim().toLowerCase() || undefined,
      passwordHash,
      profileImage,
      status: status === 'inactive' ? 'inactive' : 'active',
      notes: String(notes || '').trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Worker created successfully.',
      worker: serializeWorker(worker),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/admin/workers/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = String(req.body.name || '').trim();
    if (req.body.phone !== undefined) updates.phone = normalizePakPhone(req.body.phone || '');
    if (req.body.email !== undefined) updates.email = String(req.body.email || '').trim().toLowerCase() || undefined;
    if (req.body.profileImage !== undefined) updates.profileImage = req.body.profileImage || '';
    if (req.body.status !== undefined) updates.status = req.body.status === 'inactive' ? 'inactive' : 'active';
    if (req.body.notes !== undefined) updates.notes = String(req.body.notes || '').trim();
    if (req.body.password) {
      updates.passwordHash = await bcrypt.hash(String(req.body.password), 10);
    }
    if (updates.phone && !PHONE_REGEX.test(updates.phone)) {
      return res.status(400).json({ success: false, message: 'Worker phone must be in +92XXXXXXXXXX format.' });
    }

    const worker = await StoreWorker.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean();
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found.' });
    return res.json({ success: true, message: 'Worker updated successfully.', worker: serializeWorker(worker) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/orders/:id/assign-worker', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { workerId } = req.body;
    if (!workerId) return res.status(400).json({ success: false, message: 'Worker ID is required.' });

    const worker = await StoreWorker.findById(workerId).lean();
    if (!worker || worker.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Selected worker is unavailable.' });
    }

    const order = await StoreOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.workerId = workerId;
    if ([STATUS_FLOW.CONFIRMED, STATUS_FLOW.DELIVERED].includes(order.orderStatus)) {
      order.orderStatus = STATUS_FLOW.OUT_FOR_DELIVERY;
    }
    await order.save();

    return res.json({
      success: true,
      message: 'Worker assigned to order.',
      order: serializeOrder(order),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/admin/ledger', requireAuth, requireAdmin, async (req, res) => {
  try {
    const ledger = await StoreLedger.find().sort({ createdAt: -1 }).limit(10000).lean();
    return res.json({ success: true, ledger: ledger.map(serializeLedgerEntry) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/admin/fraud-alerts', requireAuth, requireAdmin, async (req, res) => {
  try {
    const fraudAlerts = await StoreFraudAlert.find().sort({ createdAt: -1 }).limit(5000).lean();
    return res.json({ success: true, fraudAlerts: fraudAlerts.map(serializeFraudAlert) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/admin/fraud-alerts/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const status = ['open', 'investigating', 'resolved'].includes(req.body.status) ? req.body.status : '';
    if (!status) return res.status(400).json({ success: false, message: 'Invalid fraud alert status.' });

    const fraudAlert = await StoreFraudAlert.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).lean();
    if (!fraudAlert) return res.status(404).json({ success: false, message: 'Fraud alert not found.' });

    return res.json({ success: true, message: 'Fraud alert updated.', fraudAlert: serializeFraudAlert(fraudAlert) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/admin/reports/overview', requireAuth, requireAdmin, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const [ordersToday, completedToday, workers] = await Promise.all([
      StoreOrder.find({ createdAt: { $gte: startOfDay, $lt: endOfDay } }).lean(),
      StoreOrder.find({
        completedAt: { $gte: startOfDay, $lt: endOfDay },
        orderStatus: STATUS_FLOW.COMPLETED,
      }).lean(),
      StoreWorker.find({ status: 'active' }).lean(),
    ]);

    const revenue = completedToday.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const productsSold = completedToday.reduce((sum, order) => {
      return sum + (order.items || []).reduce((subtotal, item) => subtotal + Number(item.quantity || 0), 0);
    }, 0);

    const workerCollections = await Promise.all(
      workers.map(async (worker) => {
        const workerOrders = completedToday.filter((order) => toId(order.workerId) === toId(worker._id));
        const amount = workerOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
        return {
          workerId: toId(worker._id),
          workerName: worker.name,
          amount,
          orders: workerOrders.length,
        };
      })
    );

    return res.json({
      success: true,
      report: {
        ordersToday: ordersToday.length,
        dailyRevenue: Number(revenue.toFixed(2)),
        productsSold,
        workerCollections,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/worker/deliveries', requireAuth, requireWorker, async (req, res) => {
  try {
    const statusFilter = req.query.status
      ? { orderStatus: String(req.query.status) }
      : { orderStatus: { $in: [STATUS_FLOW.OUT_FOR_DELIVERY, STATUS_FLOW.DELIVERED, STATUS_FLOW.PAID] } };
    const deliveries = await StoreOrder.find({
      workerId: req.auth.userId,
      ...statusFilter,
    })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, deliveries: deliveries.map(serializeOrder) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/worker/orders/:id/delivered', requireAuth, requireWorker, async (req, res) => {
  try {
    const order = await StoreOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (toId(order.workerId) !== req.auth.userId) {
      return res.status(403).json({ success: false, message: 'This order is not assigned to you.' });
    }

    order.orderStatus = STATUS_FLOW.DELIVERED;
    order.deliveredAt = new Date();
    await order.save();

    if (order.paymentMethod !== 'cash_on_delivery') {
      const approvedPayment = await StorePayment.findOne({
        orderId: order._id,
        verificationStatus: 'approved',
        verified: true,
      }).lean();
      if (!approvedPayment) {
        await createFraudAlert({
          orderId: order._id,
          workerId: req.auth.userId,
          type: 'missing_payment_proof',
          severity: 'high',
          details: `Worker delivered wallet order ${order.orderNumber} without approved payment proof.`,
        });
      }
    }

    return res.json({ success: true, message: 'Order marked as delivered.', order: serializeOrder(order) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/worker/orders/:id/upload-payment-proof', requireAuth, requireWorker, async (req, res) => {
  try {
    const order = await StoreOrder.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (toId(order.workerId) !== req.auth.userId) {
      return res.status(403).json({ success: false, message: 'This order is not assigned to you.' });
    }

    const { transactionId = '', senderPhone = '', paymentProofImage = '' } = req.body;
    if (!transactionId || !senderPhone || !paymentProofImage) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID, sender phone, and screenshot are required.',
      });
    }

    const payment = await StorePayment.create({
      orderId: order._id,
      paymentMethod: order.paymentMethod,
      amount: Number(order.totalAmount || 0),
      transactionId: String(transactionId).trim(),
      senderPhone: normalizePakPhone(senderPhone),
      paymentProofImage,
      verificationStatus: 'pending',
      verified: false,
      createdByWorker: req.auth.userId,
    });

    return res.status(201).json({
      success: true,
      message: 'Payment proof uploaded for admin verification.',
      payment: serializePayment(payment),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/settings', requireAuth, requireAdmin, async (req, res) => {
  try {
    const current = await StoreSettings.findOne({ key: 'default' });
    if (!current) {
      await StoreSettings.create({ key: 'default', ...defaultSettings, ...req.body });
    } else {
      Object.assign(current, req.body);
      await current.save();
    }
    const settings = await StoreSettings.findOne({ key: 'default' }).lean();

    return res.json({
      success: true,
      message: 'Settings saved successfully.',
      settings: serializeSettings(settings || {}),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/reset-demo', requireAuth, requireAdmin, async (req, res) => {
  try {
    await Promise.all([
      StoreCustomer.deleteMany({}),
      StoreCategory.deleteMany({}),
      StoreProduct.deleteMany({}),
      StoreOrder.deleteMany({}),
      StoreOrderItem.deleteMany({}),
      StoreReview.deleteMany({}),
      StoreBlogPost.deleteMany({}),
      StoreVisitorLog.deleteMany({}),
      StoreContactMessage.deleteMany({}),
      StorePayment.deleteMany({}),
      StoreWorker.deleteMany({}),
      StoreLedger.deleteMany({}),
      StoreFraudAlert.deleteMany({}),
      StoreCart.deleteMany({}),
      StoreOtpSession.deleteMany({}),
      StoreSettings.deleteMany({}),
    ]);

    await ensureSeedData();

    return res.json({
      success: true,
      message: 'Demo data reset successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
