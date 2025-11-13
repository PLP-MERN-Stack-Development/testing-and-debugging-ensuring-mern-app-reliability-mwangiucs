# Testing Strategy and Debugging Guide

## Overview
This project implements a comprehensive testing setup for a MERN-style application covering unit, integration, and end-to-end (E2E) tests, along with debugging tools on both server and client.

## Tools
- Unit/Integration: Jest
- Client testing: React Testing Library, jest-dom
- API testing: Supertest
- E2E: Cypress (headless via Electron)
- Transforms: Babel (React + env)

## Structure
- Client tests
  - Unit: `client/src/tests/unit/*.test.jsx`
  - Integration: `client/src/tests/integration/*.int.test.jsx`
- Server tests
  - Unit: `server/tests/unit/*.test.js`
  - Integration: `server/tests/integration/*.test.js`
- E2E tests
  - `cypress/e2e/*.cy.js`

## How to run
- Install deps
  - Root: `npm install`
  - Client/Server: `npm run install-all`
- All tests: `npm test`
- Unit tests only: `npm run test:unit`
- Integration tests (server): `npm run test:integration`
- E2E tests (Cypress): `npm run test:e2e`

## Coverage
- Coverage thresholds configured in `jest.config.js` (70% lines/functions global)
- Reports output to:
  - Client: `coverage/client/index.html`
  - Server: `coverage/server/index.html`

Steps to capture screenshots:
1. Run `npm test` to generate coverage.
2. Open the HTML reports above in a browser.
3. Take screenshots of the summary pages and include them in the repo (e.g., `docs/screenshots/coverage-client.png`, `docs/screenshots/coverage-server.png`).

## Implemented Tests
- Client unit
  - `Button` component behavior
  - `ErrorBoundary` fallback rendering
  - `useFetchPosts` custom hook (success + error paths)
- Client integration
  - `PostForm` submission with validation, success, and server error paths
- Server unit
  - `auth` middleware + `generateToken`
- Server integration
  - Posts API CRUD with authentication and validation paths
- E2E
  - API CRUD flow for posts using `/__test__` helper routes to get token and reset data

## Notes on Test Database
For integration tests, this project uses an in-memory data store implemented in the server models to avoid external services. If a true database-backed test environment is required, switch to `mongodb-memory-server-core` in server tests and reintroduce Mongoose models.

## Debugging Techniques
- Server
  - Request timing logger: logs method, path, status, and duration
  - Global error handler and 404 handler
- Client
  - React `ErrorBoundary` to catch render-time exceptions
- Performance
  - Basic server-side timing logged per request

## Future Enhancements
- Switch server integration tests to `mongodb-memory-server-core` for a realistic MongoDB test database
- Add UI routing and pages, then expand Cypress tests for navigation, error handling, and auth-like flows
- Add visual regression testing (e.g., Percy or `cypress-plugin-snapshots`)
