---
name: angular-developer
description: Generates Angular code and provides architectural guidance. Trigger when creating projects, components, or services, or for best practices on reactivity (signals, linkedSignal, resource), forms, dependency injection, routing, SSR, accessibility (ARIA), animations, styling (component styles, Tailwind CSS), testing, or CLI tooling.
license: MIT
metadata:
  author: Copyright 2026 Google LLC
  version: '1.0'
---

# Angular Developer Guidelines

## Project Style Guide (read first)

This project ships its own style guide. The rules below **override** any conflicting guidance in the references in this skill or in upstream Angular docs. Before generating code, read:

- [../../style-guide/style-guide.md](../../style-guide/style-guide.md) — index
- [../../style-guide/style-guide.ts.md](../../style-guide/style-guide.ts.md) — TypeScript / Angular
- [../../style-guide/style-guide.html.md](../../style-guide/style-guide.html.md) — templates
- [../../style-guide/style-guide.scss.md](../../style-guide/style-guide.scss.md) — styles
- [../../style-guide/style-guide.git.md](../../style-guide/style-guide.git.md) — commit messages
- [../../style-guide/style-guide.npm.md](../../style-guide/style-guide.npm.md) — npm packages

High-leverage rules that diverge from defaults — apply these without being asked:

**TypeScript**

- Use `private` by default; `protected` only when the symbol is used in the template; never use the default `public`.
- Use `readonly` by default; always on Angular-initialized properties (inputs, queries, services).
- Use `const` by default.
- Boolean names start with `is` / `has` / `show` (e.g. `isLoading`, `hasChanges()`); event handlers start with `on` (e.g. `onSave()`).
- Suffix observables with `$`.
- Prefer `Type[]` over `Array<Type>`. Always use `{}` braces for control flow. Use `===` / `!==`.
- Prefer `types` over `interfaces`; no leading `I` on interface names. Prefer types over enums (enums OK for strings / magic numbers).
- Avoid `any`; prefer `unknown`. Use `!` non-null assertion only when truly safe.
- Prefer `inject()` over constructor DI; group all `inject()` calls at the top of the class.
- Group class members in this order: decorator → class (extends/implements) → injects → properties → methods (static → constructor → lifecycle hooks → CVA → host handlers → others). No alphabetic order; co-locate related fields and methods.
- Max 400 LoC per file, max 120 chars per line (160 for comments), max cyclomatic complexity 20.
- Annotate public/protected APIs, parameters, and non-obvious return types (incl. `void`). Prefer inference for obvious locals.
- Prefer `AsyncPipe`; if subscribing manually use `takeUntilDestroyed()`. Avoid nested subscriptions (use `switchMap` etc.).
- Lifecycle hooks: keep empty ones out; with signal-based I/O, avoid lifecycle hooks entirely. Never `DoCheck` / `AfterContentChecked` / `AfterViewChecked`.
- Use the `host` object in `@Component` / `@Directive`; never `@HostBinding` / `@HostListener`.
- Use Signals (`signal`, `computed`, `effect`) for state. Use signal `input()` / `input.required()` / `output()` / `viewChild()`; never the decorator forms.
- `ChangeDetectionStrategy.OnPush` on every component. Standalone is default in v20+ — **do not** set `standalone: true`.
- Immutability for OnPush: spread for shallow, `structuredClone()` (or `klona`) for deep clones; never `mutate` on signals — use `update` / `set`.
- Prefer default `ViewEncapsulation` (`Emulated`).
- Use `?: Type` shorthand over `: Type | undefined`. Prefer sensible defaults over `| undefined`. Use `value as Type` casts, not `<Type>value`.
- Lazy-load feature routes; use `@defer` for expensive non-critical view fragments.

**Templates**

- Native control flow only: `@if` / `@for` / `@switch`. Never `*ngIf` / `*ngFor` / `*ngSwitch`.
- `class.[name]` / `style.[prop]` bindings — never `ngClass` / `ngStyle`.
- Inline templates for small components; external file otherwise (relative path from the `.ts` file).
- `@for` requires a stable primitive `track` (e.g. `track item.id`); avoid `$index` / object identity except for static lists.
- Always set `type` on `<button>`. Use `NgOptimizedImage` (`ngSrc` + `width`/`height` + `alt`) for static images (does not work for base64).
- Use Angular pipes for formatting; spaces inside interpolation `{{ x }}` and around pipes `{{ x | translate }}`.
- Self-closing tags for content-less components. Use `<!-- @ToDo: ... -->` to mark todos.
- Accessibility is mandatory: must pass AXE and WCAG AA (focus management, contrast, ARIA, labels).

**Tooling**

- Prettier + ESLint run on save and pre-commit (configs at `/.prettierrc` and `/eslint.config.js`). LF, UTF-8 (no BOM).
- Sort imports (grouped and alphabetical within group).
- Don't commit AI slop — generated code must be reviewed and edited.

## Core rules

1. Always analyze the project's Angular version before providing guidance, as best practices and available features can vary significantly between versions. If creating a new project with Angular CLI, do not specify a version unless prompted by the user.

2. When generating code, follow the **Project Style Guide above first**, then Angular's official style guide and best practices for maintainability and performance. Use the Angular CLI for scaffolding components, services, directives, pipes, and routes to ensure consistency.

3. Once you finish generating code, run `ng build` to ensure there are no build errors. If there are errors, analyze the error messages and fix them before proceeding. Do not skip this step, as it is critical for ensuring the generated code is correct and functional. Also run `ng lint --fix` to keep ESLint clean.

## Creating New Projects

If no guidelines are provided by the user, here are same default rules to follow when creating a new Angular project:

1. Use the latest stable version of Angular unless the user specifies otherwise.
2. Prefer Reactive Forms for production forms in this workspace unless the user explicitly chooses experimental Signal Forms for a new Angular v21+ form or prototype. For Signal Forms, read [signal-forms.md](references/signal-forms.md). For Reactive Forms, read [reactive-forms.md](references/reactive-forms.md).

**Execution Rules for `ng new`:**
When asked to create a new Angular project, you must determine the correct execution command by following these strict steps:

**Step 1: Check for an explicit user version.**

- **IF** the user requests a specific version (e.g., Angular 15), bypass local installations and strictly use `npx`.
- **Command:** `npx @angular/cli@<requested_version> new <project-name>`

**Step 2: Check for an existing Angular installation.**

- **IF** no specific version is requested, run `ng version` in the terminal to check if the Angular CLI is already installed on the system.
- **IF** the command succeeds and returns an installed version, use the local/global installation directly.
- **Command:** `ng new <project-name>`

**Step 3: Fallback to Latest.**

- **IF** no specific version is requested AND the `ng version` command fails (indicating no Angular installation exists), you must use `npx` to fetch the latest version.
- **Command:** `npx @angular/cli@latest new <project-name>`

## Components

When working with Angular components, consult the following references based on the task:

- **Fundamentals**: Anatomy, metadata, core concepts, and template control flow (@if, @for, @switch). Read [components.md](references/components.md)
- **Inputs**: Signal-based inputs, transforms, and model inputs. Read [inputs.md](references/inputs.md)
- **Outputs**: Signal-based outputs and custom event best practices. Read [outputs.md](references/outputs.md)
- **Host Elements**: Host bindings and attribute injection. Read [host-elements.md](references/host-elements.md)

If you require deeper documentation not found in the references above, read the documentation at `https://angular.dev/guide/components`.

## Reactivity and Data Management

When managing state and data reactivity, use Angular Signals and consult the following references:

- **Signals Overview**: Core signal concepts (`signal`, `computed`), reactive contexts, and `untracked`. Read [signals-overview.md](references/signals-overview.md)
- **Dependent State (`linkedSignal`)**: Creating writable state linked to source signals. Read [linked-signal.md](references/linked-signal.md)
- **Async Reactivity (`resource`)**: Fetching asynchronous data directly into signal state. Read [resource.md](references/resource.md)
- **Side Effects (`effect`)**: Logging, third-party DOM manipulation (`afterRenderEffect`), and when NOT to use effects. Read [effects.md](references/effects.md)

## Forms

In this workspace, prefer Reactive Forms for production code unless the user explicitly asks for experimental Signal Forms or the task is a prototype. When making a forms decision, analyze the project and match existing form strategy.

- **Signal Forms**: Use signals for form state management. Read [signal-forms.md](references/signal-forms.md)
- **Template-driven forms**: Use for simple forms. Read [template-driven-forms.md](references/template-driven-forms.md)
- **Reactive forms**: Use for complex forms. Read [reactive-forms.md](references/reactive-forms.md)

## Dependency Injection

When implementing dependency injection in Angular, follow these guidelines:

- **Fundamentals**: Overview of Dependency Injection, services, and the `inject()` function. Read [di-fundamentals.md](references/di-fundamentals.md)
- **Creating and Using Services**: Creating services, the `providedIn: 'root'` option, and injecting into components or other services. Read [creating-services.md](references/creating-services.md)
- **Defining Dependency Providers**: Automatic vs manual provision, `InjectionToken`, `useClass`, `useValue`, `useFactory`, and scopes. Read [defining-providers.md](references/defining-providers.md)
- **Injection Context**: Where `inject()` is allowed, `runInInjectionContext`, and `assertInInjectionContext`. Read [injection-context.md](references/injection-context.md)
- **Hierarchical Injectors**: The `EnvironmentInjector` vs `ElementInjector`, resolution rules, modifiers (`optional`, `skipSelf`), and `providers` vs `viewProviders`. Read [hierarchical-injectors.md](references/hierarchical-injectors.md)

## Angular Aria

When building accessible custom components for any of the following patterns: Accordion, Listbox, Combobox, Menu, Tabs, Toolbar, Tree, Grid, consult the following reference:

- **Angular Aria Components**: Building headless, accessible components (Accordion, Listbox, Combobox, Menu, Tabs, Toolbar, Tree, Grid) and styling ARIA attributes. Read [angular-aria.md](references/angular-aria.md)

## Routing

When implementing navigation in Angular, consult the following references:

- **Define Routes**: URL paths, static vs dynamic segments, wildcards, and redirects. Read [define-routes.md](references/define-routes.md)
- **Route Loading Strategies**: Eager vs lazy loading, and context-aware loading. Read [loading-strategies.md](references/loading-strategies.md)
- **Show Routes with Outlets**: Using `<router-outlet>`, nested outlets, and named outlets. Read [show-routes-with-outlets.md](references/show-routes-with-outlets.md)
- **Navigate to Routes**: Declarative navigation with `RouterLink` and programmatic navigation with `Router`. Read [navigate-to-routes.md](references/navigate-to-routes.md)
- **Control Route Access with Guards**: Implementing `CanActivate`, `CanMatch`, and other guards for security. Read [route-guards.md](references/route-guards.md)
- **Data Resolvers**: Pre-fetching data before route activation with `ResolveFn`. Read [data-resolvers.md](references/data-resolvers.md)
- **Router Lifecycle and Events**: Chronological order of navigation events and debugging. Read [router-lifecycle.md](references/router-lifecycle.md)
- **Rendering Strategies**: CSR, SSG (Prerendering), and SSR with hydration. Read [rendering-strategies.md](references/rendering-strategies.md)
- **Route Transition Animations**: Enabling and customizing the View Transitions API. Read [route-animations.md](references/route-animations.md)

If you require deeper documentation or more context, visit the [official Angular Routing guide](https://angular.dev/guide/routing).

## Styling and Animations

When implementing styling and animations in Angular, consult the following references:

- **Using Tailwind CSS with Angular**: Integrating Tailwind CSS into Angular projects. Read [tailwind-css.md](references/tailwind-css.md)
- **Angular Animations**: Using native CSS (recommended) or the legacy DSL for dynamic effects. Read [angular-animations.md](references/angular-animations.md)
- **Styling components**: Best practices for component styles and encapsulation. Read [component-styling.md](references/component-styling.md)

## Testing

When writing or updating tests, consult the following references based on the task:

- **Fundamentals**: Best practices for unit testing (Vitest), async patterns, and `TestBed`. Read [testing-fundamentals.md](references/testing-fundamentals.md)
- **Component Harnesses**: Standard patterns for robust component interaction. Read [component-harnesses.md](references/component-harnesses.md)
- **Router Testing**: Using `RouterTestingHarness` for reliable navigation tests. Read [router-testing.md](references/router-testing.md)
- **End-to-End (E2E) Testing**: Best practices for E2E tests with Cypress. Read [e2e-testing.md](references/e2e-testing.md)

## Tooling

When working with Angular tooling, consult the following references:

- **Angular CLI**: Creating applications, generating code (components, routes, services), serving, and building. Read [cli.md](references/cli.md)
- **Code Modernization**: Automatically refactoring to modern standards using migrations. Read [migrations.md](references/migrations.md)
- **Angular MCP Server**: Available tools, configuration, and experimental features. Read [mcp.md](references/mcp.md)
