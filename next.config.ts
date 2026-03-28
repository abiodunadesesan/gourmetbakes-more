import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Allow Next.js Image to serve local SVG files without throwing an error
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Explicitly pin Turbopack's workspace root to this project directory.
  // Without this, Turbopack detects ~/package-lock.json and watches the entire
  // home folder, causing spurious recompilations and the infinite reload loop.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
