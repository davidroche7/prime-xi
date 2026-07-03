/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Set BASE_PATH when hosting under a subpath (e.g. GitHub Pages demo).
  // Empty (the default) for Cloudflare Pages / root-domain hosting.
  basePath,
};

export default nextConfig;
