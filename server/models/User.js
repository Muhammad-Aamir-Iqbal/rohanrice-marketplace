import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
  },
  password: {
    type: String,
    required: function() {
      return this.authType === 'email';
    },
    minlength: 6,
    select: false,
  },
  authType: {
    type: String,
    enum: ['email', 'google', 'otp'],
    default: 'email',
  },
  company: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: String,
  verifyExpire: Date,
  profileImage: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  preferences: {
    newsletter: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate token
userSchema.methods.getJWT = function() {
  return {
    id: this._id,
    email: this.email,
    role: this.role,
  };
};

// Hide sensitive fields
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verifyToken;
  delete obj.verifyExpire;
  return obj;
};

export default mongoose.model('User', userSchema);
