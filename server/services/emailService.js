import nodemailer from 'nodemailer';
import chalk from 'chalk';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT === '465', // true if port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send OTP via email
 */
export const sendOTPEmail = async (email, otp, purpose = 'login') => {
  try {
    const subject = `Your OTP for ${purpose}`;
    const htmlContent = `
      <h2>RohanRice Marketplace</h2>
      <p>Your One-Time Password (OTP) for ${purpose}:</p>
      <h1 style="color: #5a9c3d; font-size: 32px; font-weight: bold;">${otp}</h1>
      <p style="color: #666;">This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #999;">© 2025 RohanRice Marketplace. All rights reserved.</p>
    `;

    await transporter.sendMail({
      from: `"RohanRice" <${process.env.SMTP_FROM}>`,
      to: email,
      subject,
      html: htmlContent,
    });

    console.log(chalk.green(`✓ OTP email sent to ${email}`));
    return true;
  } catch (error) {
    console.error(chalk.red(`✗ Email send failed: ${error.message}`));
    throw error;
  }
};

/**
 * Send contact form email
 */
export const sendContactEmail = async (contactData) => {
  try {
    const { name, email, phone, company, subject, message } = contactData;

    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="font-size: 12px; color: #999;">This message was sent from RohanRice Marketplace.</p>
    `;

    // Send to admin
    await transporter.sendMail({
      from: `"RohanRice Contact" <${process.env.SMTP_FROM}>`,
      to: process.env.ADMIN_EMAIL || 'admin@rohanrice.com',
      subject: `New ${subject} from ${name}`,
      html: htmlContent,
      replyTo: email,
    });

    // Send confirmation to user
    await transporter.sendMail({
      from: `"RohanRice" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'We received your message',
      html: `
        <h2>Thank you for contacting RohanRice</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will respond within 24 hours.</p>
        <p style="color: #5a9c3d;"><strong>Reference ID:</strong> #${Date.now()}</p>
        <p>Best regards,<br>RohanRice Team</p>
      `,
    });

    console.log(chalk.green(`✓ Contact emails sent`));
    return true;
  } catch (error) {
    console.error(chalk.red(`✗ Email send failed: ${error.message}`));
    throw error;
  }
};

/**
 * Send order confirmation email
 */
export const sendOrderEmail = async (order, userEmail) => {
  try {
    const itemsHTML = order.items
      .map(
        item => `
        <tr>
          <td>${item.productName}</td>
          <td align="right">${item.quantity}</td>
          <td align="right">$${item.price.toFixed(2)}</td>
          <td align="right">$${item.subtotal.toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <h2>Order Confirmation</h2>
      <p>Hi ${order.shippingAddress.firstName},</p>
      <p>Thank you for your order! <strong>${order.orderNumber}</strong></p>
      
      <h3>Order Details:</h3>
      <table border="1" cellpadding="10" style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f5f5f5;">
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Subtotal</th>
        </tr>
        ${itemsHTML}
      </table>
      
      <h3 style="margin-top: 20px;">Total: $${order.totals.total.toFixed(2)}</h3>
      
      <p>Estimated Delivery: ${order.estimatedDelivery?.toDateString() || 'Soon'}</p>
      <p>We will send you tracking information once your order ships.</p>
      
      <p>Best regards,<br>RohanRice Team</p>
    `;

    await transporter.sendMail({
      from: `"RohanRice" <${process.env.SMTP_FROM}>`,
      to: userEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: htmlContent,
    });

    console.log(chalk.green(`✓ Order confirmation email sent to ${userEmail}`));
    return true;
  } catch (error) {
    console.error(chalk.red(`✗ Email send failed: ${error.message}`));
    throw error;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const htmlContent = `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}" style="background-color: #5a9c3d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p style="color: #666;">This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await transporter.sendMail({
      from: `"RohanRice" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Password Reset - RohanRice',
      html: htmlContent,
    });

    console.log(chalk.green(`✓ Password reset email sent to ${email}`));
    return true;
  } catch (error) {
    console.error(chalk.red(`✗ Email send failed: ${error.message}`));
    throw error;
  }
};

export default transporter;
