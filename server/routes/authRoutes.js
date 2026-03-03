import express from 'express';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { generateToken, generateOTP, getOTPExpiry } from '../utils/tokenUtils.js';
import { sendOTPEmail } from '../services/emailService.js';
import { sendOTPSMS } from '../services/smsService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// ====== SIGNUP ======
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, country } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      country,
      authType: 'email',
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== LOGIN with EMAIL/PASSWORD ======
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required',
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== REQUEST OTP ======
router.post('/request-otp', async (req, res) => {
  try {
    const { email, phone, purpose = 'login', otpType = 'email' } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone required',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiry();

    // Save OTP to database
    const otpRecord = new OTP({
      email: email || phone,
      phone,
      otp,
      purpose,
      otpType,
      expiresAt,
    });

    await otpRecord.save();

    // Send OTP via email
    if (otpType === 'email' || otpType === 'both') {
      if (email) {
        await sendOTPEmail(email, otp, purpose);
      }
    }

    // Send OTP via SMS
    if (otpType === 'sms' || otpType === 'both') {
      if (phone) {
        await sendOTPSMS(phone, otp, purpose);
      }
    }

    res.json({
      success: true,
      message: `OTP sent to ${email || phone}`,
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== VERIFY OTP ======
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, phone, otp, purpose = 'login' } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP required',
      });
    }

    const contact = email || phone;

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: contact,
      purpose,
    }).select('+otp');

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Request a new one.',
      });
    }

    // Verify OTP
    try {
      await otpRecord.verify(otp);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // For signup, create user
    if (purpose === 'signup') {
      let user = await User.findOne({ email: contact });

      if (!user) {
        user = new User({
          email: contact,
          phone,
          authType: 'otp',
          isVerified: true,
          firstName: contact.split('@')[0],
        });
        await user.save();
      }

      const token = generateToken(user._id, user.role);

      return res.json({
        success: true,
        message: 'OTP verified. Account created.',
        user: user.toJSON(),
        token,
      });
    }

    // For login, find existing user
    const user = await User.findOne({ email: contact });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'OTP verified. Login successful.',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== GET CURRENT USER ======
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== UPDATE PROFILE ======
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, company, country, address } = req.body;

    const user = req.user;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (company) user.company = company;
    if (country) user.country = country;
    if (address) user.address = { ...user.address, ...address };

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated',
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== LOGOUT ======
router.post('/logout', authMiddleware, async (req, res) => {
  // Token is managed on frontend
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;
