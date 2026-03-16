/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // pdfjs-dist references 'canvas' (Node-only); mammoth may reference 'fs'/'path'.
      // Tell webpack to ignore these on the client side.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
        stream: false,
        zlib: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
