/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // the URL generator is the main page; avoid a duplicate /url page
      { source: "/tools/qr-generator/url", destination: "/tools/qr-generator", permanent: true },
      // retired tool
      { source: "/worksheet", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
