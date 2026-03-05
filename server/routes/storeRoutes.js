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
import { sendOTPEmail } from '../services/emailService.js';
import { sendOTPSMS } from '../services/smsService.js';
import { defaultBlogPosts, defaultCategories, defaultProducts, defaultSettings } from '../data/storeSeed.js';

const router = express.Router();

const PHONE_REGEX = /^\+92\d{10}$/;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

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
  orderStatus: doc.orderStatus || 'pending',
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
  email: doc.email || 'info@rohanrice.com',
  phone: doc.phone || '+92 XXX XXX XXXX',
  location: doc.location || 'Narowal, Punjab, Pakistan',
  heroTagline: doc.heroTagline || 'Premium Rice From the Heart of Punjab.',
  footerTagline: doc.footerTagline || 'Premium Rice. Trusted Quality.',
  founderCredit: doc.founderCredit || 'This platform was founded and built by the founder.',
  techRights:
    doc.techRights || 'All technical architecture, source code, and platform rights are reserved by the founder.',
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

const ensureSeedData = async () => {
  const settingsCount = await StoreSettings.countDocuments();
  if (!settingsCount) {
    await StoreSettings.create({
      key: 'default',
      ...defaultSettings,
    });
  }

  const categoryCount = await StoreCategory.countDocuments();
  if (!categoryCount) {
    await StoreCategory.insertMany(defaultCategories);
  }

  const productCount = await StoreProduct.countDocuments();
  if (!productCount) {
    const categories = await StoreCategory.find().lean();
    const categoryIdByName = categories.reduce((acc, category) => {
      acc[category.name] = category._id;
      return acc;
    }, {});

    const productDocs = defaultProducts.map((product) => ({
      name: product.name,
      categoryId: categoryIdByName[product.categoryName],
      pricePerKg: product.pricePerKg,
      stockQuantity: product.stockQuantity,
      description: product.description,
      image: product.image,
      isFeatured: product.isFeatured,
      rating: 0,
      reviewCount: 0,
    }));

    await StoreProduct.insertMany(productDocs);
  }

  const blogCount = await StoreBlogPost.countDocuments();
  if (!blogCount) {
    await StoreBlogPost.insertMany(defaultBlogPosts);
  }
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
    categories: categories.map(serializeCategory),
    products: products.map(serializeProduct),
    orders: [],
    reviews: [],
    blogPosts: [],
    visitorLogs: [],
    contactMessages: [],
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
        carts: customer ? { [toId(customer._id)]: serializeCartItems(cart) } : {},
      },
    };
  }

  const [admins, customers, orders, reviews, blogPosts, visitorLogs, contactMessages] = await Promise.all([
    StoreAdmin.find().sort({ createdAt: -1 }).lean(),
    StoreCustomer.find().sort({ createdAt: -1 }).lean(),
    StoreOrder.find().sort({ createdAt: -1 }).lean(),
    StoreReview.find().sort({ createdAt: -1 }).lean(),
    StoreBlogPost.find().sort({ createdAt: -1 }).lean(),
    StoreVisitorLog.find().sort({ createdAt: -1 }).limit(5000).lean(),
    StoreContactMessage.find().sort({ createdAt: -1 }).lean(),
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
      orders: orders.map(serializeOrder),
      reviews: reviews.map(serializeReview),
      blogPosts: blogPosts.map(serializeBlogPost),
      visitorLogs: visitorLogs.map(serializeVisitorLog),
      contactMessages: contactMessages.map(serializeContactMessage),
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

router.get('/auth/me', requireAuth, async (req, res) =>
  res.json({
    success: true,
    role: req.auth.role,
    user: req.auth.role === 'admin' ? serializeAdmin(req.auth.user) : serializeCustomer(req.auth.user),
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

    const model = req.auth.role === 'admin' ? StoreAdmin : StoreCustomer;
    const user = await model.findByIdAndUpdate(req.auth.userId, updates, { new: true, runValidators: true }).lean();
    return res.json({
      success: true,
      message: 'Profile updated.',
      user: req.auth.role === 'admin' ? serializeAdmin(user) : serializeCustomer(user),
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

router.post('/orders', requireAuth, requireCustomer, async (req, res) => {
  try {
    const { address, notes = '', paymentMethod = 'cash_on_delivery' } = req.body;
    if (!address?.fullName || !address?.phone || !address?.city || !address?.area || !address?.addressLine) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required.' });
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

    const order = await StoreOrder.create({
      orderNumber: `RR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      customerId: req.auth.userId,
      customerName: req.auth.user.name,
      customerEmail: req.auth.user.email,
      items: orderItems,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentMethod,
      orderStatus: 'pending',
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

    for (const item of orderItems) {
      await StoreProduct.findByIdAndUpdate(item.productId, { $inc: { stockQuantity: -item.quantity } });
    }

    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order: serializeOrder(order),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/orders', requireAuth, async (req, res) => {
  try {
    const filter = req.auth.role === 'admin' ? {} : { customerId: req.auth.userId };
    const orders = await StoreOrder.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, orders: orders.map(serializeOrder) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/orders/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    if (!orderStatus) return res.status(400).json({ success: false, message: 'Order status is required.' });
    const order = await StoreOrder.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true, runValidators: true }).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
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
