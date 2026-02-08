# Feature-based React SPA Template

## Актуальный стек

- React 18
- React Router DOM 7
- Vite 5
- ESLint 8
- Prettier 3
- Vitest + Testing Library

## Структура проекта

```text
src/
  App.jsx
  main.jsx
  _archive/      # архивные модули, не подключены в runtime
  components/    # общие UI-компоненты
  config/        # конфигурация API
  context/       # контексты приложения
  features/      # функциональные блоки
  hooks/         # переиспользуемые хуки
  routes/        # маршруты и route-guards
  styles/        # глобальные и общие стили
  utils/         # утилиты
public/
  docs/          # публичные документы
  logos/         # логотипы
  media/         # медиа-ресурсы
```

## Конвенции именования

- `src/features/*`:
  - директории фич — `kebab-case` (пример: `team-showcase`, `upcoming-matches`);
  - компонент фичи — `PascalCase` (`TeamShowcase.jsx`), стили рядом с компонентом.
- Ассеты:
  - не использовать временные имена (`ChatGPT Image ...`, `image_YYYY-MM-DD...`);
  - использовать доменные имена по назначению (`brand-logo.png`, `hero-background.png`);
  - в имени файла — `kebab-case`, без пробелов.
- Конфиги:
  - локальный конфиг фичи — только `config.json` в директории фичи;
  - общие runtime-конфиги — в `src/config/` с осмысленными именами (`apiEndpoints.js`).

## Архив и runtime

- `src/_archive/**` — только архивный код, не участвует в runtime.
- Импорты из `src/_archive/**` в рабочие модули запрещены правилом ESLint `no-restricted-imports`.
- Проверка запускается командой `npm run lint`.

