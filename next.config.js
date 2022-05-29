/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.khanacademy.org', 'cdn.kastatic.org'],
  },
}

module.exports = nextConfig
