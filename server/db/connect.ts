import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  let uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and configure it.');
  }

  mongoose.set('strictQuery', true);

  // If in development mode and pointing to local DB, try connecting first. If it fails, fall back to mongodb-memory-server.
  if (process.env.NODE_ENV === 'development' && (uri.includes('localhost') || uri.includes('127.0.0.1'))) {
    try {
      console.log('[db] Attempting to connect to local MongoDB...');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      isConnected = true;
      console.log('[db] MongoDB connected to local instance');
    } catch (err) {
      console.warn('[db] Local MongoDB connection failed. Starting in-memory MongoDB server as fallback...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();
        console.log(`[db] In-memory MongoDB server started at: ${memoryUri}`);
        await mongoose.connect(memoryUri);
        isConnected = true;
        console.log('[db] Connected to in-memory MongoDB');
      } catch (memErr) {
        console.error('[db] Failed to start in-memory MongoDB server:', memErr);
        throw err; // throw original connection error
      }
    }
  } else {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('[db] MongoDB connected');
  }

  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
    isConnected = false;
  });
}
