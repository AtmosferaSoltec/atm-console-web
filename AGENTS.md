# atm-console-web — Development Rules & Conventions

## Rules

1. **Language policy**: 100% of code, variables, functions, components, interfaces, types, database fields, routes, and file names must be in English. Only literal text rendered to the end user (UI labels, placeholders, headings, toast messages) may be in Spanish.
2. **Modular architecture**: business logic lives inside `src/features/[module-name]/`. Do not spread business logic across global folders.
3. **Component reusability**: check `src/components/ui/` and the module's own components before creating a new UI element. Never hardcode inline styles or write custom unmanaged buttons if a shared component exists.
4. **Strict typing**: every function, component prop, and API response must be strictly typed with TypeScript interfaces/types located in the corresponding `types/` folder.

## Project structure

```
project/
├── public/                 # Global static files (favicons, public images)
├── src/
│   ├── assets/             # Global resources (fonts, logos, global CSS)
│   ├── components/         # Global reusable UI components (shadcn/ui)
│   │   ├── ui/             # Base components (button.tsx, dialog.tsx, input.tsx)
│   │   └── common/         # Shared business components (Navbar.tsx, Sidebar.tsx)
│   ├── config/             # Global config (axios, env, base routes)
│   ├── features/           # Modular architecture
│   │   └── [module]/       # e.g. members, memberships, dashboard
│   │       ├── components/ # Module-only components (MemberTable.tsx, MemberForm.tsx)
│   │       ├── hooks/      # Module hooks (useMembers.ts)
│   │       ├── services/   # Module API calls (memberService.ts)
│   │       ├── types/      # Module TypeScript types (member.types.ts)
│   │       └── index.ts    # Barrel file: public exports of the module
│   ├── hooks/              # Global reusable hooks (useAuth, useLocalStorage)
│   ├── layouts/            # Page structures (DashboardLayout.tsx, AuthLayout.tsx)
│   ├── pages/              # Main views wired to routing (LoginPage.tsx, MembersPage.tsx)
│   ├── routes/             # Route config (AppRoutes.tsx, PrivateRoute.tsx)
│   ├── services/           # Global HTTP clients or interceptors
│   ├── store/              # Global state (Zustand or Context API if needed)
│   ├── types/              # Global TypeScript types (api.types.ts, user.types.ts)
│   ├── utils/              # Helpers/formatters (formatCurrency.ts, formatDate.ts)
│   ├── App.tsx             # Root component
│   └── main.tsx            # React entry point
├── .env                    # Environment variables
├── eslint.config.js        # Linter rules
└── package.json
```

Other modules import from a feature only through its `index.ts` barrel.
