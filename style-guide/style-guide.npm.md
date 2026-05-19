# NPM Packages Style Guide

Last updated on 2026-05-19.

This document contains guidelines for NPM packages.

Before including 3rd party package:

## Do

### Must do

- check license
- check vulnerabilities
- use devDependencies for development tools

### Should do

- ensure the package provides TypeScript definitions (either built-in or via `@types/`)
- prefer packages with low dependencies
- make sure package is necessary
- only use maintained packages
- check for better alternatives
- check package size and impact on bundle (e.g., using Bundlephobia)
- prefer Angular packages that support modern features (Standalone components, Zoneless)

## Don't

- avoid using abandoned packages
- avoid using commercial packages with license fee without approval by project steering
- avoid mixing package managers (e.g., stick to `pnpm` if `pnpm-lock.yaml` is present)
- avoid installing global packages unnecessarily

## Back to index

- [Angular Coding Style Guide](style-guide.md)
