/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self' https://assets.mailerlite.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.mailerlite.com; style-src 'self' 'unsafe-inline' https://assets.mailerlite.com; img-src 'self' data: https://assets.mailerlite.com;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 