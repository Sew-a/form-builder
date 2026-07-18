import 'dotenv/config';
import { createServer } from 'http';
import next from 'next';
import { createExpressApp } from './app';
import { initSocket } from './socket';
import { connectDB } from './db/connect';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

// Next.js app instance (this is what turns our custom server into a
// full Next.js host — it compiles/serves the React pages in src/app).
const nextApp = next({ dev });
const handleNextRequest = nextApp.getRequestHandler();

async function main() {
  await connectDB();
  await nextApp.prepare();

  const expressApp = createExpressApp();

  // Anything not matched by our Express routes (i.e. not /api/*) falls
  // through to Next.js, which renders the React pages.
  expressApp.all('*', (req, res) => handleNextRequest(req, res));

  const httpServer = createServer(expressApp);

  // Attach Socket.io to the SAME http server/port — this is what keeps
  // everything as one deployable app instead of two separate services.
  initSocket(httpServer);

  httpServer.listen(port, () => {
    console.log(`[server] Ready on http://localhost:${port} (${dev ? 'development' : 'production'})`);
  });
}

main().catch((err) => {
  console.error('[server] Failed to start:', err);
  process.exit(1);
});
