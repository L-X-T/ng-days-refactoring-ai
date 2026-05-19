# Angular Coding Style Guide

Version 1.0.2, last updated on 2026-05-19.

This document contains a general style guide for Angular projects.

It can be used by human developers as well as AI agents.

There are specific style guides for:

- [Git Commits](style-guide.git.md)
- [HTML View Templates](style-guide.html.md)
- [NPM Packages](style-guide.npm.md)
- [SCSS Styling Files](style-guide.scss.md)
- [TypeScript (Angular) Files](style-guide.ts.md)

## Do

### Must do

- run [**Prettier**](https://prettier.io/) on save and before committing
  - use config from /.prettierrc
  - use for these endings: {css,html,js,json,md,scss,ts}
- use **LF endings**
- use **UTF-8** (no BOM)

### Should do

- Be consistent
- KISS (Keep It Short & Simple)
- Prefer small, clear duplication over premature abstraction. Don't force abstraction in every case.

## Don't

- Don't commit AI slop. Always review and edit AI-generated code before committing it!

## Resources

- [Prettier](https://prettier.io/)

## ToDos

- @ToDo Add style guide for unit (Vitest), e2e (Playwright) tests and maybe Storybook.
- @ToDo Add detailed accessibility checklist for AXE, WCAG AA, focus management, color contrast, labels, ARIA, and dialogs.
