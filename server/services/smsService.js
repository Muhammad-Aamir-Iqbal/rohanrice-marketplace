import twilio from 'twilio';
import chalk from 'chalk';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send OTP via SMS
 */
export const sendOTPSMS = async (phone, otp, purpose = 'login') => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID) {
      console.warn(chalk.yellow('⚠ Twilio not configured. Skipping SMS.'));
      return true;
    }

    const message = `Your RohanRice OTP for ${purpose} is: ${otp}. Valid for 10 minutes.`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log(chalk.green(`✓ OTP SMS sent to ${phone}`));
    return true;
  } catch (error) {
    console.error(chalk.red(`✗ SMS send failed: ${error.message}`));
    // SMS is optional, don't throw
    return false;
  }
};

/**
 * Send order notification SMS
 */
export const sendOrderSMS = async (phone, orderNumber) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID) return true;

    const message = `Order confirmation: ${orderNumber}. Track your shipment at rohanrice.com. Thank you!`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log(chalk.green(`✓ Order SMS sent to ${phone}`));
    return true;
  } catch (error) {
    console.error(chalk.red(`✗ SMS send failed: ${error.message}`));
    return false;
  }
};

export { client };
