import mongoose from 'mongoose';
import chalk from 'chalk';

const mongoUri =
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  'mongodb://localhost:27017/rohanrice';

let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }

  try {
    const conn = await connectionPromise;
    console.log(chalk.green(`MongoDB connected: ${conn.connection.host}`));
    return conn.connection;
  } catch (error) {
    connectionPromise = null;
    console.error(chalk.red(`MongoDB connection error: ${error.message}`));
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log(chalk.yellow('MongoDB disconnected'));
});

mongoose.connection.on('error', (error) => {
  console.error(chalk.red(`Database error: ${error.message}`));
});

export default mongoose;
