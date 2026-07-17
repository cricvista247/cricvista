/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  async rewrites() {
    // Render serves these API routes itself. A separately deployed frontend can
    // proxy relative /api calls to the same Render backend URL.
    if (process.env.RENDER === "true") {
      return [];
    }

    const apiProxyTarget = (
      process.env.API_PROXY_TARGET || process.env.NEXT_PUBLIC_API_URL
    )?.replace(/\/$/, "");

    if (!apiProxyTarget) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${apiProxyTarget}/api/:path*`,
      },
    ];
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
