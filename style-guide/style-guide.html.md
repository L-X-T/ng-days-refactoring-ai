# HTML Template Style Guide

Last updated on 2024-11-18.

This document contains guidelines for _Angular_ view templates (HTML files).

## Do

### Must do

- use [**Angular coding style guide**](https://angular.io/guide/styleguide)
- use [**Prettier**](https://prettier.io/)
- use [**valid HTML**](https://validator.w3.org/)
- use **strict formatting**
  - use **2 spaces intents** (Prettier)
  - use **`"double quotes"`** rather than single quotes (Prettier)
  - use only **lowercase** for tags and attributes
  - use only necessary html attributes (e.g. no id="", no name="")
- use new **control flow (@if, @for) syntax**
- prefer `class.[name]` and `style.[property]` over `ngClass` and `ngStyle`
- ensure accessibility (a11y) by using semantic HTML tags and ARIA attributes where necessary
- use a unique identifier for the `track` expression in `@for` loops

### Should do

- avoid overly complex logic in templates (move into component class, max cyclomatic complexity of 10)
- order of one HTML element's properties by category
  - `*structuralDirectives` (deprecated, prefer `@if` and `@for`)
  - `#templateReferenceVariables`
  - `htmlAttributes`
  - `[propertyBindings]`
  - `[(twoWayBindings)]`
  - `(eventHandlers)`
- name event handlers for what they do, not for the triggering event
- add empty lines between siblings that don't belong together
- use `<!-- comment -->` for comments where really necessary
- use `<!-- section -->` for labeling sections in the template if necessary
- mark todos with `<!-- @ToDo: task description -->`
- use `<self-closing-tags />` for components without content
- use `ngSrc`, `width` & `height` (if known) and `alt` attributes for images
- use `Angular Pipes` for formatting and filtering
- control flow (`@if`, `@for`)
  - use boolean flags for complex `@if` statements
  - use `@else` and `@empty` to increase readability
- use spaces in string interpolation `{{ example }}`
- use spaces between pipes `{{ example | translate }}`
- use local loading indicators (e.g. spinners) for async data
- it's okay to use service properties and 1-liners directly in the View Template (HTML)
- use `@defer` to lazy load non-critical or heavy parts of the UI
- always specify a `type` attribute on `<button>` elements (e.g., `type="button"`, `type="submit"`)
- use strict equality (`===`) in template expressions

## Don't

- try to **avoid divs and other elements without a reason**
- try to avoid empty lines between siblings that belong together
- try to avoid functions in HTML templates (except for event handlers), signals don't count
- try to avoid inline styles (except if computed/dynamic e.g., with [style.--l-row-count])
- try to avoid hardcoding user-facing strings; prefer translation pipes (e.g., `{{ 'KEY' | translate }}`)

## Resources

- [Prettier](https://prettier.io/)
- [Google HTML Style Guide](https://google.github.io/styleguide/htmlcssguide.html#HTML_Style_Rules)

## Back to index

- Angular [coding style guide](style-guide.md)
