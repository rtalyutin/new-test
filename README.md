# Feature-based React SPA Template

This project provides a baseline single-page application that follows the feature/block manifesto:

- **React** with Vite for a fast development experience.
- **Feature-based structure** where every block owns its UI component and JSON configuration.
- **Reusable shared components** kept in dedicated directories.
- **Prettier + ESLint** ensure consistent formatting and code quality.

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env` file (or adjust `.env.example`) to point the frontend to your backend API:

```bash
# Base URL of the backend API used for all requests
VITE_API_BASE_URL=http://localhost:3000

# REST endpoints (override if your backend uses custom paths)
VITE_SIGN_IN_ENDPOINT=/api/auth/sign-in
```

## Available Scripts

- `npm run dev` – start the development server.
- `npm run build` – create a production build.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint across the source files.
- `npm run format` – format the project with Prettier.

## Project Structure

```
src/
  App.jsx               # root application component
  main.jsx              # application bootstrap
  components/           # shared UI building blocks
  features/             # feature folders with component + config.json
  styles/               # global styles
```

Each feature folder contains a React component (e.g., `News.jsx`) and a JSON configuration file (`config.json`). Components import their configuration with a standard ES module import (`import config from './config.json'`).

You can duplicate an existing feature folder to bootstrap new blocks.

## Deployment & Configuration

- Set the `VITE_API_BASE_URL` environment variable to the public URL of your backend API when building or deploying. The app will use this base to resolve all relative API paths.

## Linting & Formatting

ESLint is configured with the recommended rules for React, hooks, and accessibility. Prettier integration guarantees consistent formatting. Run `npm run lint` and `npm run format` to keep the codebase clean.

## Code Style Requirements

- Стили, используемые несколькими блоками, храните в общих файлах, а специфические стили оставляйте в файлах компонентов.
- Не складывайте все стили в один файл: общий файл должен содержать только действительно общие правила, чтобы избежать излишней связанности и упростить сопровождение.
