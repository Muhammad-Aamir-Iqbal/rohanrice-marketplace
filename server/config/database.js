import mongoose from 'mongoose';
import chalk from 'chalk';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rohanrice';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(chalk.green(`✓ MongoDB connected: ${conn.connection.host}`));
    return conn;
  } catch (error) {
    console.error(chalk.red(`✗ MongoDB connection error: ${error.message}`));
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on('disconnected', () => {
  console.log(chalk.yellow('⚠ MongoDB disconnected'));
});

mongoose.connection.on('error', (error) => {
  console.error(chalk.red(`Database error: ${error.message}`));
});

export default mongoose;
