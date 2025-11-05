import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    experimental: {
        browserDebugInfoInTerminal: true,
        typedEnv: true,
        useLightningcss: true,
        turbopackFileSystemCacheForDev: true
    },
    reactCompiler: false, // Broke react-headless-tree
    typedRoutes: true,
    images: {
        unoptimized: true // FIXME
    }
}

module.exports = nextConfig
