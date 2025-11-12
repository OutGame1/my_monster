import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Autorisation des images hébergées sur Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  }
}

export default nextConfig
