import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./__tests__/setup.ts'],
        exclude: ['e2e/**', '__tests__/e2e/**', 'node_modules/**', 'dist/**', '.next/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['lib/*.ts', 'orpc/middleware.ts', 'orpc/routes/**/*.ts'],
            exclude: [
                'node_modules/',
                '__tests__/',
                'e2e/**',
                'app/**',
                'components/**',
                'db/**',
                'lib/orpc/**',
                'lib/query/**',
                '**/*.test.ts',
                '**/*.test.tsx',
                '**/*.config.*',
                '**/types.ts',
                '**/types/**',
                '.next/',
                'coverage/',
                'dist/',
                'build/',
                '**/*.d.ts',
                '**/test-results.json'
            ],
            thresholds: {
                lines: 70,
                statements: 70,
                branches: 70,
                functions: 70
            }
        }
    }
})
