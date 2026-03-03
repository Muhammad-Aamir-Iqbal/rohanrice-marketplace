import jwt from 'jsonwebtoken';
import chalk from 'chalk';

/**
 * Generate JWT token
 */
export const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '30d' }
  );
};

/**
 * Verify token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error(chalk.red(`Token verification failed: ${error.message}`));
    return null;
  }
};

/**
 * Generate OTP (6 digits)
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Calculate OTP expiry (10 minutes from now)
 */
export const getOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000);
};

/**
 * Generate unique order number
 */
export const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RR-${timestamp}-${random}`;
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain numbers');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain special characters (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Add country code if not present
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }

  return `+${cleaned}`;
};

/**
 * Generate secure random string
 */
export const generateRandomString = (length = 32) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  generateOTP,
  getOTPExpiry,
  generateOrderNumber,
  validatePassword,
  formatPhoneNumber,
  generateRandomString,
};
