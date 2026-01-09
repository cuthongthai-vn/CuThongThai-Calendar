/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: false,
    compress: true,

    // Empty turbopack config to silence Next.js 16 warning
    turbopack: {},

    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        minimumCacheTTL: 31536000,
    },

    // Webpack config for bundle analyzer
    // Run: ANALYZE=true npm run build --webpack
    webpack: (config, { isServer }) => {
        if (process.env.ANALYZE === 'true') {
            const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    reportFilename: isServer
                        ? '../analyze/server.html'
                        : './analyze/client.html',
                    openAnalyzer: false,
                })
            );
        }
        return config;
    },
};

export default nextConfig;
