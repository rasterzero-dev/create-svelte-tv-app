# create-svelte-tv-app

Create a Svelte TV app with TypeScript, routing, ESLint, Prettier, and TV platform build configuration.

## Usage

```sh
pnpm create svelte-tv-app
```

The CLI asks for a project name, copies the starter template, replaces app identifiers in the platform configs, and can install dependencies for you.

## Generated App

The generated project includes:

- a small two-route Svelte TV demo app
- WebGL and Canvas renderer setup
- SDF font generation through the Svelte TV Vite plugin
- Chrome 49 legacy build support for the default web build
- Tizen build configuration targeting Chromium 69
- Capacitor Android project files
- LG webOS app metadata

## Scripts

Inside a generated project:

```sh
npm run dev
npm run build
npm run build:tizen
npm run build:lg
npm run build:android
npm run preview
```

`build:lg` expects the LG webOS CLI tools to provide `ares-package`. Android APK builds require a local Android SDK/JDK setup. On Windows, the easiest way to install a compatible JDK is through [Chocolatey](https://chocolatey.org/install). After installing Chocolatey, run:

```sh
choco install temurin17
```
