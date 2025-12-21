import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    experimental: {
        browserDebugInfoInTerminal: true,
        typedEnv: true,
        turbopackFileSystemCacheForDev: true
    },
    logging: {
        incomingRequests: {
            ignore: [/\/rpc/] // Handled by oRPC logger
        }
    },
    reactCompiler: false, // Broke react-headless-tree
    reactStrictMode: false,
    typedRoutes: true
}

// oxlint-disable-next-line no-commonjs
module.exports = nextConfig
