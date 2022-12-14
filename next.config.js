/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "nft-cdn.alchemy.com", "ipfs.io"],
  },
};

module.exports = nextConfig;
