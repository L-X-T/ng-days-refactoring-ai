# NPM Packages Style Guide

Last updated on 2024-11-18.

This document contains guidelines for NPM packages.

Before including 3rd party package:

## Do

### Must do

- use devDependencies for development tools
- verify package license compatibility

### Should do

- ensure the package provides TypeScript definitions (either built-in or via `@types/`)
- prefer packages with low dependencies
- make sure package is necessary
- only use maintained packages
- check for better alternatives
- check vulnerabilities
- check package size and impact on bundle (e.g., using Bundlephobia)
- prefer Angular packages that support modern features (Standalone components, Zoneless)

## Don't

- try to avoid using abandoned packages
- avoid mixing package managers (e.g., stick to `pnpm` if `pnpm-lock.yaml` is present)
- avoid installing global packages unnecessarily

## Back to index

- Angular [coding style guide](style-guide.md)
