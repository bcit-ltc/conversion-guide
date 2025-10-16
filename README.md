# Course Production Conversion Guide

Welcome to the Conversion Guide for BCIT Course Production!

## In this guide

The Course Production Conversion Guide is an online reference for anybody that develops, produces, or maintains an online course at BCIT. It provides up-to-date information regarding all of the default tools packaged into the LTC approved course framework. This includes:

1. Word markers - How to prepare your MS Word document when developing your content
1. HTML - How to use a feature in HTML format
1. Notes - Notes about various features

## Development

**Requirements**: Node.js 24+ (or Docker)

> **Modernized**: This project has been modernized from Gulp to Vite for faster development and better performance.

### Local Development

```bash
npm install
npm run dev
```

This will start the Vite dev server at `http://localhost:3000` with hot module replacement.

### Production Build

```bash
npm run build
```

This creates optimized production files in the `dist/` directory with gzip and Brotli compression.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally at `http://localhost:4173` for testing.

## Docker Development

### Development with Docker

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This runs the Vite dev server in a container with hot module replacement at `http://localhost:3000`.

### Production with Docker

```bash
docker-compose up --build
```

This creates an optimized production build served by nginx at `http://localhost:8080`.

## Project Structure

```
├── src/
│   ├── pages/          # HTML entry points
│   ├── partials/        # HTML includes and components
│   ├── scss/           # SCSS stylesheets
│   └── js/             # JavaScript modules
├── public/
│   └── assets/         # Static assets
├── dist/               # Production build output
└── vite.config.js      # Vite configuration
```

## Features

- **Modern Build System**: Vite for fast development and optimized production builds
- **Multi-page Application**: Support for multiple HTML entry points
- **Custom Plugins**: HTML includes (`@@include()`) and partial processing
- **SCSS Support**: Native Sass preprocessing with modern `@use` syntax
- **Compression**: Automatic gzip and Brotli compression for production
- **Docker Support**: Both development and production containers
- **Hot Module Replacement**: Instant updates during development
- **Clean URLs**: SEO-friendly routing without file extensions

## Troubleshooting

**Port already in use:**
```bash
npx kill-port 3000
```

**Docker build fails:**
- Ensure Docker is running
- Try rebuilding with `--no-cache`: `docker-compose up --build --no-cache`

**Missing styles after Docker rebuild:**
- Ensure HTML files reference `/css/page-setup.css` (not SCSS source)
- Check that `src/js/page-setup.js` imports the main SCSS file