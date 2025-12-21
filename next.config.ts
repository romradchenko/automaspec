import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    typescript: {
        // We already run typecheck as a part of ci and pre-push hooks
        // This speeds up build time considerably
        ignoreBuildErrors: true
    },
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
