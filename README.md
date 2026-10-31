# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## Deploy

Pushing to the `production` branch runs `.github/workflows/deploy.yml`: builds the console, publishes the image to GHCR and restarts it on the VPS.

| | |
|---|---|
| Domain | `console.atmosferast.com` (nginx on the host, Cloudflare in front) |
| Container | `console-web`, loopback port `3131` (static files served by nginx) |
| Server folder | `/opt/console-web` (`docker-compose.yml` is copied on every deploy) |
| API | Same origin: the host nginx forwards `/v1` to `auth-api` (port `3130`), so there is no API URL in the build and no CORS |

The console has no configuration or secrets on the server.

## Systems and Pulso

- **Roles are fixed too.** Each system's roles are declared in the auth API catalog; the console lists them (read-only tab) and assigns them to users. The API refuses any role outside the catalog (`unknown_role`).
- **Systems are not created here.** `atm-auth-api` seeds the catalog of systems (and their roles) from code at startup; the console only lists them, manages their credential and session policy, enables them per company and assigns users. To add a system, add it to that catalog in the auth API.
- **Pulso** (`src/features/pulso`) is the one place to configure everything per system for Pulso. Pulso's model is Group > Gym > Branch (Grupo > Gimnasio > Sede): a group is an internal label that bundles related gyms (not a user); a gym is a company of the auth API with the `pulso` system enabled. From the page the superadmin can:
  - create, rename and delete groups (`/admin/groups`; deleting a group that still has gyms answers 409 `GROUP_IN_USE`);
  - create a gym inside a group ("Nuevo gimnasio"): a company with only a name (no RUC) of an auth client, with Pulso enabled. Pulso records the gym and its main branch the next time it lists groups and places it in the group of another gym of the same auth client; the console then moves it to the chosen group;
  - move a gym to another group (`PATCH /pulso-api/api/v1/admin/gyms/{id}` with `group_id`);
  - set the gym's colour (same endpoint, `brand_color`) and open its company profile (name, logo) in the usual company dialog;
  - create, rename and delete its branches (admins of a gym can never create branches);
  - manage its team: people with access to the company in the `pulso` system. Adding a person creates their account by DNI when it does not exist and gives them access with role `admin` (always with `manage_users`, so they can create their own receptionists) or `receptionist`; the icon removes the access, never the account.
  Prices are agreed with the customer and are not recorded in any system.
- The RUC of a company is optional everywhere in the console (a gym starts without one).
- The console reaches the Pulso API on its own origin under `/pulso-api/` (Vite proxy in development, port 3001; host nginx in production, see `deploy/nginx-host-pulso-api.conf.example`, loopback port 3081). Override with `VITE_PULSO_API_URL` if needed. The Pulso API must accept the superadmin token of the auth API on `/api/v1/admin/*`.

