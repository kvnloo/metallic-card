import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable compression for production
  compress: true,

  // Optimize production output
  swcMinify: true,

  // Enable tree shaking and dead code elimination
  productionBrowserSourceMaps: false,

  // Optimize bundles
  webpack: (config, { isServer }) => {
    // Optimize lucide-react imports
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      }
    }
    return config
  },
}

export default withBundleAnalyzer(nextConfig)
