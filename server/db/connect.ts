import mongoose from 'mongoose';

let isConnected = false;
let dbMode: 'persistent' | 'memory' = 'persistent';
let memoryServer: any = null;

export function getDbInfo() {
  return {
    connected: mongoose.connection.readyState === 1,
    mode: dbMode,
    database: mongoose.connection.name || null,
    persistent: dbMode === 'persistent',
  };
}

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and configure it.');
  }

  mongoose.set('strictQuery', true);

  if (process.env.NODE_ENV === 'development' && (uri.includes('localhost') || uri.includes('127.0.0.1'))) {
    try {
      console.log('[db] Attempting to connect to local MongoDB at', uri, '...');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      isConnected = true;
      dbMode = 'persistent';
      console.log('[db] ✅ MongoDB connected (persistent) →', uri);
    } catch (err) {
      console.warn('');
      console.warn('╔══════════════════════════════════════════════════════════════╗');
      console.warn('║  ⚠  LOCAL MongoDB NOT FOUND — using in-memory database     ║');
      console.warn('║                                                              ║');
      console.warn('║  Your data (users, forms) will be LOST when the server      ║');
      console.warn('║  stops. This is why sign-in fails after restarting.         ║');
      console.warn('║                                                              ║');
      console.warn('║  To fix this, start MongoDB locally:                        ║');
      console.warn('║    • Install: https://www.mongodb.com/docs/manual/install/  ║');
      console.warn('║    • Or run:  mongod                                        ║');
      console.warn('║    • Or use MongoDB Atlas (free cloud DB)                   ║');
      console.warn('╚══════════════════════════════════════════════════════════════╝');
      console.warn('');

      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memoryUri = memoryServer.getUri();
        console.log('[db] Starting in-memory MongoDB at:', memoryUri);
        await mongoose.connect(memoryUri);
        isConnected = true;
        dbMode = 'memory';
        console.log('[db] ⚡ Connected to in-memory MongoDB (NON-PERSISTENT)');
        console.log('[db] ⚡ Register a new user — data resets on every server restart.');
      } catch (memErr) {
        console.error('[db] Failed to start in-memory MongoDB server:', memErr);
        throw err;
      }
    }
  } else {
    await mongoose.connect(uri);
    isConnected = true;
    dbMode = 'persistent';
    console.log('[db] ✅ MongoDB connected (persistent)');
  }

  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
    isConnected = false;
  });
}
