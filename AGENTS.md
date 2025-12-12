# Repository Guidelines

## Project Structure & Module Organization
- Laravel backend lives in `app/` with HTTP controllers, models, policies, and requests; database migrations, factories, and seeders sit under `database/`.
- Inertia + React UI is in `resources/js/` with components and pages; shared styling is handled by Tailwind 4 via `resources/css/`.
- Routes are defined in `routes/web.php`; tests are in `tests/` (feature and unit) and rely on Laravel’s testing helpers.
- Public assets build to `public/`; Vite configuration is in `vite.config.ts`.

## Build, Test, and Development Commands
- `composer install && npm install` to install PHP and Node dependencies.
- `composer run dev` starts PHP server, queue listener, log viewer, and Vite in one process group.
- `composer run dev:ssr` runs the same stack plus Inertia SSR.
- `npm run dev` launches Vite; `npm run build` builds client assets; `npm run build:ssr` also emits the SSR bundle.
- `npm run types` checks TypeScript types; `npm run format` / `npm run format:check` manage Prettier formatting; `npm run lint` applies ESLint fixes.
- `composer test` (wraps `php artisan test`) runs the PHP suite; clear config with `php artisan config:clear` when environment changes.

## Coding Style & Naming Conventions
- Follow Laravel defaults (PSR-12) for PHP; name controllers `*Controller`, requests `*Request`, events `*Event`, and jobs `*Job`.
- Use TypeScript for frontend modules; prefer functional React components with hooks and PascalCase filenames.
- Tailwind utility-first styling lives alongside components; keep class lists ordered by intent and rely on Prettier (with Tailwind plugin) to sort.
- Keep implementations lean; inline trivial variables or extract shared logic into helpers/services to stay DRY and focused.

## Testing Guidelines
- Add feature or unit tests under `tests/`; mirror app namespaces and use `fake()` in factories instead of hard-coded values.
- Use model factories and database transactions to isolate cases; seed only what the scenario needs.
- Run `php artisan test` before opening a PR and ensure new behavior ships with coverage.

## Commit & Pull Request Guidelines
- Use short, imperative commit messages (e.g., “Add user onboarding flow”); scope each commit to one change set.
- Reference related issues in PR descriptions, describe behavior changes, migration impacts, and include screenshots or GIFs for UI changes.
- Before submitting, confirm migrations run cleanly, assets build (`npm run build`), and tests pass locally.

## Security & Configuration Tips
- Never commit `.env` or secrets; generate keys with `php artisan key:generate` and keep environment parity via `.env.example`.
- Run migrations with `php artisan migrate` (or the automated steps in `composer run setup`) and queue workers with `php artisan queue:listen`.
- Validate incoming data with Form Requests and authorize actions via policies to guard access consistently.

## Frontend libraries
See [chadcn-agent.md](./docs/chadcn-agents.md) for chadcn guildelines 
