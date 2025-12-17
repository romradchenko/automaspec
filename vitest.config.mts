import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./__tests__/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                '__tests__/',
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
                '**/ui/**',
                '**/components/ui/**',
                'app/**',
                '**/app/**',
                '**/test-results.json'
            ],
            thresholds: {
                lines: 70,
                functions: 70,
                branches: 70,
                statements: 70
            }
        }
    }
})
