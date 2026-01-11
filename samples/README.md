# Automaspec Samples

Sample projects demonstrating Automaspec integration with different testing frameworks.

## Available Samples

### [vitest-npm](./vitest-npm)

Minimal Vitest project using **npm** with GitHub Actions workflow.

- Vitest configuration
- Example tests
- GitHub Actions workflow (npm)
- Setup instructions

### [vitest-pnpm](./vitest-pnpm)

Minimal Vitest project using **pnpm** with GitHub Actions workflow.

- Vitest configuration
- Example tests
- GitHub Actions workflow (pnpm)
- Setup instructions

## Usage

1. Choose a sample that matches your tech stack
2. Copy the sample folder to your project
3. Follow the README in the sample folder for setup instructions
4. Configure your GitHub secrets
5. Push to trigger the workflow

## Adding Your Own Tests

When writing tests, name your `it()` blocks to match requirement names in Automaspec:

```typescript
it('should validate user email format', () => {
    // Your test code
})
```

This test will sync with any requirement named "should validate user email format" in your Automaspec project.
