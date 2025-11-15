import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
    // Enable Turbopack for faster builds (Next.js 15 feature)
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
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

  // SWC minification is enabled by default in Next.js 15
  // No need to specify swcMinify: true

  // Enable tree shaking and dead code elimination
  productionBrowserSourceMaps: false,

  // Optimize output
  poweredByHeader: false, // Remove X-Powered-By header for security
  reactStrictMode: true,  // Enable strict mode for better debugging

  // Optimize bundles
  webpack: (config, { isServer }) => {
    // Optimize lucide-react imports
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        minimize: true,
      }
    }
    return config
  },
}

export default withBundleAnalyzer(nextConfig)
