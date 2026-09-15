/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'ufs.sh',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i1z8h726r3.ufs.sh',
      },
    ],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@tabler/icons-react'],
  },
};

export default nextConfig;
