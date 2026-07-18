/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // We run Next.js through our own Express server (see server/index.ts),
  // so this config stays minimal. Add image domains, redirects, etc. here later.
};

module.exports = nextConfig;
