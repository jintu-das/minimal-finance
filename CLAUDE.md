# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev`: start the Vite dev server
- `npm run build`: `tsc -b && vite build` (the type check is part of the build)
- `npm run lint`: ESLint over the whole repo
- `npm run preview`: serve the production build

- `npm test`: run Vitest in watch mode. For a single CI-style run use `npx vitest run`; for one file use `npx vitest run src/path/to/file.test.ts`.

**Testing:** Vitest is the runner and reuses `vite.config.ts` (including the `@/` alias). Existing examples live in `src/features/categories/` (`schema.test.ts`, `api/fetch-categories.api.test.ts`). Name new tests `*.test.ts(x)` and colocate them next to the code under test. Only Vitest is installed: there is no `jsdom`/`happy-dom` and no React Testing Library, so add them (and set `test.environment` in `vite.config.ts`) before writing component tests. Until then, prefer unit tests for pure logic such as zod schemas in `schema.ts` and data helpers. Do not call the real backend from tests; mock the axios instance from `src/lib/api.ts`.

The backend lives in the sibling repo `../minimal-finance-api` (NestJS + Prisma).

## Environment

- `VITE_API_URL` (in `.env`) is the axios base URL for the backend. It is read in [src/lib/api.ts](src/lib/api.ts).

## Architecture

React 19 + TypeScript + Vite SPA. Path alias `@/` maps to `src/`.

**Routing:** TanStack Router with file-based routes in `src/routes/`. The Vite plugin generates `src/routeTree.gen.ts`, so don't edit it by hand. The router context carries the shared `QueryClient` (see [src/main.tsx](src/main.tsx) and [src/routes/__root.tsx](src/routes/__root.tsx)). Route files should preload with `loader: queryClient.ensureQueryData(...)` and read with `useSuspenseQuery` using the same `queryOptions` object (see [src/routes/categories.tsx](src/routes/categories.tsx)). Since the file-based route exports a non-component `Route`, local components in route files need `// eslint-disable-next-line react-refresh/only-export-components`.

**Feature folders:** `src/features/<name>/` holds `api/`, `components/`, `schema.ts` (zod) and `types.ts`. Shared UI and layout live in `src/components/` (`ui/` is shadcn, `common/` is app chrome).

**Data layer:** a shared axios instance in `src/lib/api.ts`. Each endpoint is a `*.api.ts` file that exports the fetcher plus a React Query hook or `queryOptions`. Query keys are plain strings (e.g. `["categories"]`), and mutations invalidate them on success. The backend wraps every response in an envelope (`{ success, data, meta }`; see `ApiSuccess`/`ApiList` in `src/lib/api-types.ts`), and a response interceptor in `src/lib/api.ts` (`unwrapResponse`) replaces `response.data` with the payload and puts the envelope `meta` on `response.meta` (malformed bodies reject; empty 204 bodies pass through). So type calls with the payload, e.g. `const { data } = await api.get<Array<Category>>(...)`, and return `data` from the fetcher; `queryOptions` needs no `select`. Tests mock the axios instance, which bypasses the interceptor, so mocks resolve `{ data: payload }`. Mutation errors are toasted globally by the `MutationCache` in `src/lib/query-client.ts`, so mutation hooks only set `meta: { errorMessage }` (or `meta: { silent: true }` to opt out) and keep their own success toast. Errors arrive as `{ success: false, statusCode, message, ... }` where `message` may be an array; use `getApiErrorMessage(error, fallback)` for user-facing text.

**Forms:** react-hook-form with `zodResolver` and `Controller`. Type the form with `z.input` for field values and `z.output` for the submit payload, because schemas may transform values (the budget field is a string input).

**UI:** shadcn with the `base-luma` style on `@base-ui/react` (not Radix). Components use `render={...}` props instead of `asChild`. Tailwind v4 is configured through `src/index.css`, with no tailwind config file. Add components with `npx shadcn@latest add <name>`. If the registry is unreachable, write the component by hand under `src/components/ui/`. Toasts use `sonner` via `<Toaster />` mounted in `main.tsx`.

**Transactions:** currently driven by `mock-data.ts` and TanStack Table, with no backend calls yet.
