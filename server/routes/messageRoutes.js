import express from 'express';
import Message from '../models/Message.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { sendContactEmail } from '../services/emailService.js';
import { emitEvent, emitToRoom } from '../realtime/io.js';

const router = express.Router();

// ====== SUBMIT MESSAGE/INQUIRY ======
router.post('/submit', async (req, res) => {
  try {
    const { types, senderName, senderEmail, senderPhone, subject, message, productId } = req.body;

    if (!senderEmail || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Email, subject, and message are required',
      });
    }

    const newMessage = new Message({
      types,
      senderName,
      senderEmail,
      senderPhone,
      subject,
      message,
      productId,
      userId: req.user?._id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await newMessage.save();

    // Send confirmation email
    await sendContactEmail({
      name: senderName || 'Visitor',
      email: senderEmail,
      phone: senderPhone,
      subject,
      message,
    });

    // Notify admin via socket
    emitEvent('new-message', {
      messageId: newMessage._id,
      senderEmail,
      subject,
      types,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent. We will respond within 24 hours.',
      messageId: newMessage._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== GET MESSAGES (Admin Only) ======
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const skip = (page - 1) * limit;
    const filter = {};
    if (status) filter.status = status;

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments(filter);

    res.json({
      success: true,
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== GET MESSAGE STATS (Admin Only) ======
router.get('/stats/overview', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const stats = await Message.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const newCount = stats.find(s => s._id === 'new')?.count || 0;
    const respondedCount = stats.find(s => s._id === 'responded')?.count || 0;
    const closedCount = stats.find(s => s._id === 'closed')?.count || 0;

    res.json({
      success: true,
      stats: {
        newCount,
        respondedCount,
        closedCount,
        totalCount: newCount + respondedCount + closedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== RESPOND TO MESSAGE (Admin Only) ======
router.put('/:id/respond', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { response, responderName } = req.body;

    if (!response) {
      return res.status(400).json({
        success: false,
        message: 'Response text is required',
      });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        status: 'responded',
        adminResponse: {
          responderName: responderName || req.user.firstName,
          response,
          responseDate: new Date(),
        },
        respondedAt: new Date(),
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Notify user via socket if logged in
    emitToRoom(`user-${message.userId}`, 'message-responded', {
      messageId: message._id,
      response,
    });

    res.json({
      success: true,
      message: 'Response sent',
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== CLOSE MESSAGE (Admin Only) ======
router.put('/:id/close', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        status: 'closed',
        closedAt: new Date(),
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message closed',
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== MARK AS READ (Admin Only) ======
router.put('/:id/read', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
