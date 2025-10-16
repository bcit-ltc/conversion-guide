# Course Production Conversion Guide

Welcome to the Conversion Guide for BCIT Course Production!

## In this guide

The Course Production Conversion Guide is an online reference for anybody that develops, produces, or maintains an online course at BCIT. It provides up-to-date information regarding all of the default tools packaged into the LTC approved course framework. This includes:

1. Word markers - How to prepare your MS Word document when developing your content
1. HTML - How to use a feature in HTML format
1. Notes - Notes about various features

## Development

**Requirements**: Node.js 18+ (or Docker)

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

This creates optimized production files in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally at `http://localhost:4173` for testing.

## Docker Development

### Development with Docker

```bash
# Start development server with hot reload
docker-compose -f docker-compose.dev.yml up

# Or with rebuild
docker-compose -f docker-compose.dev.yml up --build
```

This runs the Vite dev server in a container with:
- Hot module replacement
- Volume mounting for live code changes
- Port 3000 accessible at `http://localhost:3000`

### Production with Docker

```bash
# Start production server
docker-compose up

# Or with rebuild
docker-compose up --build
```

This creates an optimized production build served by nginx at `http://localhost:8080`.

## Project Structure

```
├── src/
│   ├── pages/          # HTML entry points
│   ├── partials/        # HTML includes and components
│   ├── scss/           # SCSS stylesheets
│   ├── js/             # JavaScript modules
│   └── css/            # Static CSS files
├── public/
│   └── assets/         # Static assets (images, fonts, etc.)
├── dist/               # Production build output
├── vite.config.js      # Vite configuration
├── Dockerfile          # Multi-stage Docker build
├── docker-compose.yml  # Production Docker Compose
└── docker-compose.dev.yml # Development Docker Compose
```

## Features

- **Modern Build System**: Vite for fast development and optimized production builds
- **Multi-page Application**: Support for multiple HTML entry points
- **Custom Plugins**: 
  - HTML includes (`@@include()` syntax)
  - Partial processing (XML-like tags to HTML)
- **SCSS Support**: Native Sass preprocessing with Vite
- **Docker Support**: Both development and production containers
- **Hot Module Replacement**: Instant updates during development
- **Clean URLs**: SEO-friendly routing without file extensions

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill processes using port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- --port 3001
```

**Docker build fails:**
- Ensure Docker is running
- Check that all files are present in the project directory
- Try rebuilding with `--no-cache`: `docker-compose up --build --no-cache`

**Sass deprecation warnings:**
- These are warnings from Sass about deprecated `@import` syntax
- They don't affect functionality but can be addressed by migrating to `@use` syntax

### Development Tips

- Use `npm run dev` for local development with the fastest feedback
- Use `docker-compose -f docker-compose.dev.yml up` for consistent environment
- Use `npm run preview` to test production builds locally
- The floating navigation bar appears when scrolling down on any page