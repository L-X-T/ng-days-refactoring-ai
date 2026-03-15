# Angular Coding Style Guide

Version 1.0.1, last updated on 2026-03-15.

This document contains a general style guide for Angular projects.

It can be used by human developers as well as AI agents.

There are specific style guides for:

- [HTML View Templates](style-guide.html.md)
- [NPM Packages](style-guide.npm.md)
- [SCSS Styling Files](style-guide.scss.md)
- [TypeScript (Angular) Files](style-guide.ts.md)

## Do

### Must do

- run [**Prettier**](https://prettier.io/) on save and before committing
  - use config from /prettier.config.js
  - use for these endings: {css,html,js,json,md,scss,ts}
- use **LF endings**
- use **UTF-8** (no BOM)

### Should do

- Be consistent
- KISS (Keep It Short & Simple)

## Don't

- DRY (Don't Repeat Yourself) in general, unless it's a reasonably small piece of code that changes slightly. Don't force abstraction in every case.

## Resources

- [Prettier](https://prettier.io/)

## ToDos

- @ToDo Add style guide for unit (Vitest), e2e (Playwright) tests and maybe Storybook.
