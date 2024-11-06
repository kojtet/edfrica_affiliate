/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https', // or 'http' if your images use http
          hostname: 'edfrica.com',
          port: '',
          pathname: '/images/**',
        },
      ],
    },
  };

export default nextConfig;
