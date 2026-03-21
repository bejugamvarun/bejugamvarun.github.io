# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with Turbopack at localhost:3000
npm run build     # Build for production (outputs static files to /out)
npm run lint      # Run ESLint
npm run start     # Start production server (after build)
```

The `postbuild` script auto-generates `sitemap.xml` after every build.

## Architecture

This is a **Next.js 15 portfolio site** using the **Pages Router** (not App Router), deployed as a static export to GitHub Pages.

### Key architectural decisions

**Static export for GitHub Pages**: In production, `next.config.ts` sets `output: 'export'` and `basePath: '/bejugamvarun.github.io'`. In dev, basePath is empty. All images use `unoptimized: true`.

**Theme system**: Dark/light theme is managed via `context/ThemeContext.tsx` (React context + localStorage). Theme state is toggled on `document.documentElement` as `data-theme='dark'`. CSS variables in `styles/globals.css` define theme colors, and Tailwind extends them via `var(--*)` references.

**Blog system**: Markdown files in `posts/` are processed at build time via `lib/markdown.ts` using `gray-matter` (frontmatter) + `remark`/`remark-html`. `pages/blog/index.tsx` lists posts (SSG), and `pages/blog/[slug].tsx` renders individual posts.

**SEO**: `next-seo` handles meta/OG tags globally via `pages/_app.tsx`. Config is in `next-seo.config.ts`.

**Deployment**: GitHub Actions (`.github/workflows/nextjs.yml`) builds on push to `main` and deploys the `/out` directory to GitHub Pages.

### Adding a blog post

Create a new `.md` file in `posts/` with gray-matter frontmatter. The slug is derived from the filename.
