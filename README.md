# Terminus

Terminus is a self-hosted team calendar and issue tracker built with [Astro](https://astro.build). Events and issues are stored as Markdown files with YAML frontmatter, browsable and editable through a simple web UI — no database required.

## ✨ Features

- **Work-week calendar** — view scheduled events (meetings, workshops, social events, deadlines) grouped by day, with a week picker to navigate forward and back.
- **Issue tracker** — file, browse, and triage issues with status, priority, category, assignee, and tags.
- **File-based content** — events and issues are plain Markdown files under [src/events](src/events) and [src/issues](src/issues), organized by year/month, powered by [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/).
- **Full CRUD via API routes** — create, update, and delete events/issues through server-rendered API endpoints in [src/pages/api](src/pages/api).
- **Styled with Tailwind CSS** — dark-themed UI using [Tailwind CSS v4](https://tailwindcss.com/).

## 🧱 Tech Stack

- [Astro 7](https://astro.build) (server output via [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/))
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Zod](https://zod.dev/) for content schema validation
- TypeScript

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/jschlachter/terminus.git
cd terminus
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The site will be available at `http://localhost:4321`.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command          | Action                                            |
| :--------------- | :------------------------------------------------ |
| `pnpm install`   | Install dependencies                              |
| `pnpm dev`       | Start local dev server at `localhost:4321`        |
| `pnpm build`     | Build the production site to `./dist/`            |
| `pnpm preview`   | Preview the production build locally              |
| `pnpm astro ...` | Run CLI commands like `astro add`, `astro check`  |

## 🚀 Project Structure

```
.
├── public/                  # Static assets
├── src/
│   ├── assets/               # Images and other bundled assets
│   ├── components/           # Reusable Astro components (e.g. WeekPicker)
│   ├── events/YYYY/MM/*.md   # Event content, organized by year/month
│   ├── issues/YYYY/MM/*.md   # Issue content, organized by year/month
│   ├── layouts/               # Shared page layouts
│   ├── pages/                 # Routes, including API endpoints under pages/api
│   ├── styles/                # Global styles (Tailwind)
│   └── content.config.ts     # Content collection schemas (events, issues)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 📅 Adding Events or Issues

Events and issues can be created through the web UI (`/events/new` and `/issues/new`), or by adding a Markdown file directly under `src/events/YYYY/MM/` or `src/issues/YYYY/MM/` with the appropriate frontmatter. See [src/content.config.ts](src/content.config.ts) for the full schema of each collection.

## 🤝 Contributing

Contributions are welcome! Please open an issue to discuss significant changes before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to your branch and open a pull request

## 📄 License

This project is licensed under the [MIT License](LICENSE).
