# TypeScript Style Guide

Last updated on 2026-05-19.

This document contains guidelines for _Angular_ TypeScript files.

## Do

### Must do

- use [**Angular coding style guide**](https://angular.dev/style-guide)
  - rule of one (https://angular.dev/style-guide#rule-of-one)
  - put entities and services into the scope where they are being used
- use [**Prettier**](https://prettier.io/)
  - use config from /.prettierrc
  - use for .ts, .html, .scss, .md, .json
  - use Prettier on save hook
- use [**ESLint**](https://eslint.org/)
  - use config from /eslint.config.js
  - use ESLint on save hook
- use descriptive and meaningful names for all symbols
  - boolean fields always start with `is`, `has`, `show` or alike (e.g. `isLoading` or `hasChanges()`)
  - event functions start with `on` (e.g., `onSave()`)
- refactor symbol names if necessary (e.g., due to requirements changes)
- annotate public/protected APIs, function parameters, and non-obvious return values (also `void`)
  - prefer type inference for obvious locals and simple initializers (e.g. `const x = 1`)
- prefer `Type[]` over `Array<Type>` for array types
- always use curly braces `{}` for control flow statements
- clean up debug code before committing (e.g., no console.log, temporarily disabled in ESLint for debugging)
- remove unused variables and imports
- use `private` by default, to encapsulate properties and methods
- use `protected` for symbols that should be accessible in the component's view template
- use `readonly` by default, unless a property needs to be reassigned
  - always use `readonly` on properties that are initialized by Angular
- use `const` by default, unless a variable needs to be reassigned
- suffix observables with `$`
- prefer using the `AsyncPipe`, use the `takeUntilDestroyed()` operator if subscribing manually
  - prefer subscribing in field initializer or constructor, else `DestroyRef` has to be passed in
- keep constructors and lifecycle hooks simple and clean (basically only call methods, except one-liners)
  - avoid lifecycle hooks in the first place

### Should do

- keep components and directives focused on presentation
- max 400 LoC per file (e.g. extract static functions to utils)
- max 120 characters per line of code (160 for comments)
- avoid overly complex functions (max cyclomatic complexity of 20)
- prefer types to interfaces
- prefer types to enums (enums are okay for strings and magic numbers)
- group components, directives, pipes & services like this
  - decorator (`@Component`)
  - class with `extends` & `implements`
  - injects (`inject()`)
  - properties
  - methods
    - static
    - constructor
    - lifecycle hooks
    - control value accessor
    - host handler
    - other methods
- place fields and methods next to each other if they belong together
  - no alphabetic order, no order by access modifier
- avoid nested RxJS subscriptions (e.g., use switchMap instead)
- prefer easily understandable code over performance (except for performance-critical code)
- use strict equality (`===` / `!==`) instead of loose equality (`==` / `!=`)
- sort imports (group and sort named imports alphabetically)
- prefer short functions (no spaghetti code)
- avoid variable shadowing
- declare one variable per statement
- prefer arrow functions for callbacks
- use comments for complex code, and only if necessary (the usage of descriptive and meaningful names for methods and variables should be enough in many cases, comments do not make up for bad code)
- mark todos with `// @ToDo: task description`
- distinguish between Smart/Controller and Dumb/Presentational Components
- lazy-load feature routes; use `@defer` for expensive non-critical view fragments
- `immutability` over `mutability` (for `OnPush` and `OnChanges`)
  - use `...` spread operator for shallow copies
  - use `structuredClone()` or a well-maintained package such as `klona` for deep copies
- use `ChangeDetectionStrategy.OnPush`
- use `Standalone Components` over `Modules`
  - do not set `standalone: true` inside Angular decorators, it is the default in Angular v20+
- use the Signals API for state management (`signal()`, `computed()`, `effect()`)
- use signal inputs (`input()`, `input.required()`), outputs (`output()`), and queries (`viewChild()`) over decorators (`@Input()`, `@Output()`, `@ViewChild()`)
- prefer default `ViewEncapsulation` (`Emulated`)
- prefer `inject()` over constructor dependency injection
  - group all `inject()` calls at the top of the class
- it's okay to use `protected readonly` services directly in the View Template (HTML)
- prefer initial / default values over `:Type | undefined` (might not make sense for objects)
- prefer `?: Type` shorthand over `:Type | undefined`
- use `symbolName: Partial<Type> = {}` if possible for objects
- use `!` with caution and only if you are sure that the value can never be `null` or `undefined` (e.g. required `@Inputs`, static `@ViewChild`)
- use `input.required<Type>()` for required inputs
- use the `host` object in `@Component` or `@Directive` instead of `@HostBinding` and `@HostListener`
- use variable `as` Type for type castings instead of `<Type>variable`

## Don't

- don't use (default) `public` modifier for properties and methods
- don't use ambiguous or unfamiliar abbreviations
- don't leave debug logs in the codebase
- remove empty constructors
- remove empty methods
- don't default to external templates for very small components; prefer inline templates there
- avoid `any`, prefer `unknown`
- avoid these lifecycle hooks where possible
  - `DoCheck()`
  - `AfterContentChecked()`
  - `AfterViewChecked()`
- if using signal-based data binding (signal inputs, outputs and queries) already
  - avoid ALL lifecycle hooks
- don't put leading `I` for interfaces

## Resources

- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [Angular coding style guide](https://angular.dev/style-guide)
- Draft of new [Angular coding style guide](https://gist.github.com/jelbourn/0158b02cfb426e69c172db4ec92e3c0c)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

## Back to index

- [Angular Coding Style Guide](style-guide.md)
