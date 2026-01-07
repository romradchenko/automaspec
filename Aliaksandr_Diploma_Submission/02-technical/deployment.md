# Deployment & DevOps

## Infrastructure

### Deployment Architecture

The application adopts a hybrid deployment strategy using **Vercel** for the frontend/backend execution and **Docker** for local development and containerized portability.

```mermaid
graph TD
    User[User] --> Edge[Vercel Edge Network]
    Edge --> Function[Serverless Functions (Next.js)]
    Function --> DB[(Turso / libSQL)]
    
    subgraph "Local Development"
        LocalUser[Developer] --> Docker[Docker Container / Local Node]
        Docker --> DB
    end
```

-   **Production (PaaS):** Hosted on **Vercel**, leveraging serverless functions and global edge network.
-   **Database:** Hosted on **Turso** (libSQL) as a managed service.
-   **Local:** Dockerized environment for reproducible development setups.

### Environments

| Environment | URL | Branch | Trigger |
|-------------|-----|--------|---------|
| **Preview** | `https://automaspec-git-*.vercel.app` | `dev` / PRs | Automated on Pull Request |
| **Production** | `https://automaspec.vercel.app` | `main` | Automated on Push to Main |
| **Local** | `http://localhost:3000` | - | Manual Start |

## CI/CD Pipeline

The Continuous Integration and Delivery pipeline is managed by **GitHub Actions**.

### Pipeline Stages

1.  **Quality Checks (CI):**
    -   Installs dependencies via `pnpm`.
    -   Runs Security Audit (`pnpm audit`).
    -   Executes Verification Hooks: Linting (`oxlint`), Formatting (`oxfmt`), Typechecking (`tsc`), and Unit Tests (`vitest`).
2.  **E2E Testing:**
    -   Sets up Playwright.
    -   Runs End-to-End tests against a built version of the app.
3.  **Deployment (CD):**
    -   **Preview:** Deploys to Vercel Preview environment on valid PRs.
    -   **Production:** Deploys to Vercel Production environment on merge to `main`.

### Workflow Configuration

The deployment is handled via the Vercel CLI in GitHub Actions:

```yaml
- name: Deploy Project Artifacts to Vercel
  run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Local Development (Docker)

While production runs on Vercel, Docker is used locally to ensure a consistent environment for developers.

### Running with Docker

1.  **Build the Image:**
    ```bash
    pnpm docker:dev:build
    ```
2.  **Start Services:**
    ```bash
    pnpm docker:dev:up
    ```
    The application will be available at `http://localhost:3000`.

### Docker Configuration
-   **Dockerfile:** Uses multi-stage builds (`base` -> `deps` -> `builder` -> `runner`) to minimize image size.
-   **Docker Compose:** Defines services and resource limits for local simulation.

## Monitoring & Observability

Observability is primarily handled by the Vercel platform:

| Aspect | Tool | Description |
|--------|------|-------------|
| **Logs** | Vercel Logs | Real-time function logs and build output |
| **Performance** | Vercel Speed Insights | Web Vitals (LCP, FID, CLS) tracking |
| **Analytics** | Vercel Web Analytics | Visitor traffic and engagement metrics |
| **Uptime** | GitHub Status Checks | Pass/Fail status of deployment pipelines |
