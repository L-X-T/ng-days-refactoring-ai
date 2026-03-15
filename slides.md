# Refactoring verstaubter Angular-Komponenten mithilfe von KI

Source: `refactoring-verstaubter-angular-komponenten.pdf`  
Pages: 69

This markdown was extracted from the PDF slide deck and lightly cleaned for LLM input. Page boundaries are preserved as slide sections.

## Slide 01: Refactoring verstaubter Angular-Komponenten

mithilfe von KI 🙂
https://LXT.dev
Alexander Thalhammer · ANGULARarchitects.io

---

## Slide 02: Good news!

🎉 Live Demos
🤙 Praxis-Beispiel
🤓
No Vibe Coding

---

## Slide 03: 0.1 Das Problem: Warum viele Angular- Komponenten zu Monstern werden

- Über Jahre kommen Features, Sonderfälle und Workarounds hinzu
- Verantwortlichkeiten verschwimmen zwischen UI, State und Business-Logik
- Code-Lesbarkeit sinkt und Änderungen werden riskanter
- Teams gewöhnen sich an schlechten Code statt ihn zu hinterfragen

---

## Slide 04: 0.2 Typische Symptome verstaubter Komponenten

- Alte Angular Patterns, die nicht modernisiert wurden (\*ngIf, @Input(), ngClass …)
- 400 bis 800 (oder noch mehr) LoC in einer einzelnen Datei
- Viele Lifecycle Hooks (ngOnChanges) und schwer nachvollziehbare Seiteneffekte
- Unklare Symbol-Benennung, AI-generierter Code und fehlende Struktur
- Komplexe View-Templates (.html) mit zu viel Logik
- Unaufgeräumte Stylesheets (.scss) mit viel Redundanz

---

## Slide 05: 0.3 Was kosten solche Komponenten

- Hohe mentale Last bei jeder Anpassung
- Fehleranfällige Änderungen und Regressionen
- Langsame Entwicklung trotz erfahrener Teams
- Schwieriges Onboarding neuer Entwickler:innen

---

## Slide 06: 0.4 Was wir in dem Workshop erreichen wollen

- Eine klare Vorstellung für moderne, saubere Angular Komponenten
- inkl. TypeScript-, Angular- und Template-Best-Practices
- Dann modernisieren wir systematisch: APIs, Templates, State, Datenfluss und Formulare
- Eine wiederholbare Modernisierungs- und Refactoringstrategie
- KI nutzen damit Refactoring schneller geht und Spaß macht J

---

## Slide 07: 0.5 Wie gute Angular Komponenten aussehen

- Kleine, klar fokussierte Komponenten mit einer erkennbaren Hauptverantwortung
- Signale, computed state und schlanke Templates ersetzen implizite Seiteneffekte
- Regeln aus Style Guide, ESLint und Teamkonventionen machen Qualität reproduzierbar
- KI beschleunigt Umbauten, aber die Architekturentscheidungen bleiben menschlich

---

## Slide 08: Agenda

🚀 2. Guardrails für gutes KI-Refactoring

1. Setup IDE & KI
2. Modern Angular, Angular Migrations & Angular Best Practices
3. Praxis: Refactoring
   einer verstaubten Angular-Komponente

---

## Slide 10: Hi, it's me à @LX_T

- Alexander Thalhammer aus Graz, AT, EU (est. 1983)
- Angular So+ware Tree GmbH (est. 2019)
- Web Dev seit 25 Jahren
- Seit 2017 Angular Dev
- Seot 2021 Angular Evangelist, Coach & Consultant
- Teil der Angular Architects
- Seit ein paar Monaten heavy AI User
  🤷
- What can you do?
  https://LXT.dev

---

## Slide 11: Disclaimer(s)

🧑🏫

- I consider myself an Angular guru
- But not yet an AI senior (who is?)
- à gerne Feedback (bzw. Kritik oder Anmerkungen!)
- Der Workshop läu\_ noch unter experiementell
- Alle Slides und Übungen (noch!) handgemacht

---

## Slide 12: @LX_T à meine Lieblingsthemen

Performance
🚀 Accessibility
♿
🤖
📈 Refactoring
Best Practices

---

## Slide 13: Teil 1 – Setup IDE & KI

🚀

---

## Slide 14: 1.0 Agenda Teil 1

- Zuerst richten wir Prettier, ESLint und IDE ein sodass
  jedes Ergebnis denselben Qualitätsrahmen hat
- Danach bekommt die KI Instruktionen über
- AI.md (.junie/instructions.md)
- MCP
- .aiignore
- Schließlich noch ein paar Tipps für AI Agents

---

## Slide 15: 1.1 Essential I: Prettier

pnpm i -D prettier
{
"bracketSameLine": true, "printWidth": 120, // or 140 "singleQuote": true }
"editor.defaultFormatter": "esbenp.prettier-vscode", "editor.formatOnPaste": true, "editor.formatOnSave": true, "prettier.documentSelectors": ["**/*.{css,html,js,md,scss,ts}"] }

---

## Slide 16: Demo: Pre6er

---

## Slide 17: 1.2 Essential II: ESLint

- Der Linter prüft unsere Best Practices konkret ab
- Standardsätze verwenden für JS, TS, Angular sowie Angular A11y
- Wichtige zusätzliche Regeln sind explizite Types und max 400 LoC
  🤓 als auch KI
  🤓
- Dient als wichtige Checkliste für sowohl Devs

---

## Slide 18: Demo: ESLint

---

## Slide 19: 1.3 Welche IDE nehmen?

---

## Slide 20: 1.4 IDE Vergleich

- VS Code punktet mit Plugin-Ökosystem und leichter MCP-Konfiguration
- WebStorm punktet mit starker Angular- und Refactoring-Unterstützung
- Cursor hatte als erste volle KI-Integration
- IDE ist Geschmacksache, aber Formatter, Linter und
  KI-Kontext sollten sauber vereinheitlicht sein

---

## Slide 21: 1.5 KI Options I: WebStorm mit Junie

- Achtung oppinionated: Mein Lieblingssetup!
- IMHO beste KI Integra\on unter allen IDEs
- Wahl des LLMs eher nebensächlich
- Claude Sonnet 4.6 oder Opus 4.6 (deep thinking)
- Gemini 3.1 Pro oder
- GPT 5.4 oder 5.3-codex

---

## Slide 22: Demo: WebStorm mit Junie

---

## Slide 23: 1.6 Option II: VS Code mit Claude Code

- Claude Code ist ein Refactoring Agent erster Klasse
- Funkioniert sehr gut in VS Code, derzeit populärste Option!?
- Alternativen
- Gemini CLI oder
- Codex Plugin
- GitHub Copilot (might be a bit outdated)

---

## Slide 24: Demo: VS Code mit Claude Code Plugin

---

## Slide 25: 1.7 OpWon III & IV: Cursor oder Windsurf

- Aternativen zu WebStorm und VS Code
- Cursor
- Windsurf
- Who will win the race?
- Nobody knows J

---

## Slide 26: 1.8 AI.md à AI instructions

- Hier stehen Regeln für die KI "AI.md" oder spezifisch z.B. "CLAUDE.md"
- Architekturentscheidungen, Angular-Version, modernes Angular,
  No-Gos und Refactoring-Prinzipien
- Wirken in Kombination mit Angular MCP
- Manche auch "SKILLS.md", aber ich bin skeptisch

---

## Slide 27: 1.9 MCP Config

- Angular MCP bringt aktuelle Dokumentation und Angular-Wissen direkt in den Agentenfluss
- Nx MCP liefert Monorepo-Kontext, Tasks, Projektgraph und AI-Hilfen für Workspace-Strukturen
- Figma MCP ergänzt Design-Kontext, Komponenten und Variablen für UI-nahe Refactorings
- Zusammen entsteht aus einem Sprachmodell ein besser informierter Architektur-Assistent

---

## Slide 28: 1.10 .aiignoreà AI ignore like .giWgnore

- Hier kommt alles rein, was die KI nicht angreifen soll
- node_modules
- cache
- coverage
- dist …

---

## Slide 30: Demo: AI.md, MCP Config & .aiignore

---

## Slide 31: 1.11 Agent Prompting in der IDE

- Gute Prompts starten mit Beobachtung, Ziel und Randbedingungen
- Spec: Je besser die SpezifikaXon (von Anfang an – nicht iterativ), desto besser das Ergebnis
- Scope: welcher Kontext, welche Datei, welcher gewünschte Output
- Prüfung: zum Beispiel ESLint-konform, alle Tests müssen validieren
- Abfolge:
- 1. Do a planing and ask me clarifica4on questions
- 2. Now implement it

---

## Slide 32: 1.12 AI Guardrails

- Umbau-Nutzen: weniger Komplexität, klarere Zuständigkeit oder modern
- Kommantere: Bestehende Kommentare und Domänen werden nicht gelöscht
- Reviews: Kein Rewrite ohne Zwischenschritte, die sich lesen und prüfen lassen
- Ich persönlich behandle (derzeit noch) alles vom Agent wie die Arbeit eines
  Juniors, das heißt ich prüfe alle gemachten Änderungen vor Commit

---

## Slide 33: Teil 1 Zusammenfassung

- prettierrc.json & eslint.config.js
- Choose your weapon of choice
- WebStorm mit Junie, VS Code mit Claude Code oder Cursor oder Windsurf
- AI.md, mcp.json, .aiignore
- Agent Prompting & AI Guardrails
  Als nächstes kümmern wir uns um weitere, spezifischere Guardrails

---

## Slide 34: Teil 2 – Guardrails für gutes KI-Refactoring

---

## Slide 35: 2.0 Agenda Teil 2

- Clean Code Principles
- Typisierung
- Funktionen
- TS Lint-Regeln
- Struktur

---

## Slide 36: 2.1 Warum Clean Code für KI?

- Schlechter Code ist nicht nur für Menschen teuer, sondern auch für KI-Agenten schwerer zu erfassen
- Gute Namen, kleine Funktionen und klare Typen reduzieren Missverständnisse und Halluzinationen

---

## Slide 37: 2.2 Clean Code Principles I - Naming

- Jedes Feld und jede Funk\on und sollte sich durch den Namen selbst erklären und eine klare Rolle im Lesefluss der Komponente haben
- Die Symbolnamen tragen Bedeutung, Typen machen Verträge explizit und kleine Einheiten begrenzen den Scope bzw. den Context

---

## Slide 38: 2.3 Clean Code Principles II – KISS & DRY

- KISS: Lesbarkeit vor Cleverness, Kommentare sollten in den meisten Fällen nicht notwendig sein
- und natürlich DRY: • gemeinsame Logik in Services, Direktiven, Pipes, UUls oder Sub-Komponenten

---

## Slide 39: 2.4 Clean Code Principles III

- Single Responsibility: Jeder Building Block hat eine klare Aufgabe • Rule of One: Jedes Ding bekommt seine eigene Datei • private, readonly und const bevorzugen • Max. ~400 LoC pro Datei • complexity beschränkt die Komplexität (auch in View-Templates) • sort-imports und prefer-const bringen Übersicht

---

## Slide 40: 2.5 Struktur statt Zufall

- Angular-spezifische Properties gruppieren statt wild verteilen
- Abhängigkeiten, Inputs, Outputs, Signals und Methoden klar ordnen
- Zusammengehörige Dinge nah beieinander halten
- Die Komponente soll von oben nach unten lesbar sein

---

## Slide 41: 2.6 Struktur statt Zufall – Vorschlag

- decorator (@Component) • class (extends & implements) • members
- injects • input • model • output • queries • signals • other members • methods
- static • constructor • other methods

---

## Slide 42: 2.7 FunkWonen verkleinern & präzisieren

- Große Event-Handler mischen häufig Validierung, Mapping, State-Update und UI-Nebenwirkungen • Ein gutes Refactoring trennt diese Schriie in kleine, benannte Funk\onen mit klarer Absicht • Benennungen wie buildRequest, validateInput oder updateSelec\on erklären den Code fast selbst • Die KI ist hier besonders stark, wenn sie zuerst den Ablauf beschreiben und dann schneiden darf

---

## Slide 43: 2.8 Typen als Sicherheitsnetz

- Strict Typing - any vermeiden • Returntyp • Parametertyp • einfach alles hat 'nen Typ J • Der erste Hebel in Legacy-Code ist oft das Ersetzen unscharfer Typen durch explizite Typen (oder Interfaces) • Meine Guidelines bevorzugen unknown vor any und types vor interfaces • Auch kleine Typenextraktionen reduzieren mentale Last • Komponente wird lesbarer, durch präzise benannte & typisierte In- und Outputs

---

## Slide 44: 2.9 Vorher vs Nachher – Naming & Typing

items: any[] = []; sel: any;
type OrderItem = {
id: string; label: string; }; !// put in another file J
save(data: any) {
const x = this.items.find(
(i) => i.id === data.id ); if (x) {
protected readonly items: OrderItem[] = []; protected selectedItem: OrderItem | null = null;
this.sel = x; } }
protected selectItem(item: OrderItem): void {
const selectedItem = this.items.find(
(currentItem) !=> currentItem.id !!=== item.id );
if (!selectedItem) {
return; }
this.selectedItem = selectedItem; }

---

## Slide 45: Teil 2 Zusammenfassung

- Clean Code reduziert mentale Last für Menschen und KI
- Klare Namen und präzise Typen machen Refactorings sicherer
- Kleine Komponenten und Funktionen machen Änderungen beherrschbar
- Gute Typisierung und Datenbindung hilft ebenfalls
  Jetzt, wo Struktur, Typen & Lesefluss stimmen, modernisieren wir Angular

---

## Slide 46: Teil 3 – Modern Angular, Angular MigraWons & Angular Best PracWces

---

## Slide 47: 3.0 Agenda Teil 3

- Modern Angular Speedrun
- Security & Updates
- Angular Migrations (ihmo obligatory!)
- Testing & Ökosystem
- Angular Coding Style Guide
- Angular Best Practices ESLint config

---

## Slide 48: 3.1 Modern Angular I

- inject()
- Standalone
- Control Flow
- Reactivity mit Signals und dem Gamechanger computed()
- DataBinding mit input, output & model, sowie signal queries & ressource API

---

## Slide 49: 3.2 Modern Angular II

- Ersetze all lifecycle hooks mit
- constructor() – besonders für Subscriptions mit takeUntiltilDestroyed
- effect(), aherNextRender(), aherEveryRender() und aherRenderEffect()
- ChangeDetec^on.OnPush & zoneless
- SignalStore (nur wenn Du ihn wirklich brauchst!)
- SignalForms (Forms endlich rich^g gemacht!)

---

## Slide 50: 3.3 Security

- CSP Policies
- Trusted Types Setup
- Alles Aktualisieren, insbesondere 3rd Party Pakete

---

## Slide 51: 3.4 Updates

- mindestens 2x pro Jahr (Major), besser alle 2 Monate (Minor)
- mit ng update bzw. nx migrate latest
- alle andere NPM-Pakete entsprechend mitnehmen,
  doch das alleine ist nicht genug

---

## Slide 52: 3.5 Angular Migrations (opt-in is a must!)

signal inputs,
build w/ esbuild & vite
outputs &
standalone
queries
inject() & cleanup
lazy-loaded
imports & self-
control flow
routes mit loadComponent
closing tags & ngClass & ngStyle
router & common

---

## Slide 53: Showcase: Angular MigraLons

hFps://angular.dev/reference/migraKons

---

## Slide 54: 3.6 Testing

- e2e Tests mit Playwright à für mich das Wich\gste
- Unit Tests mit Vitest, eventuell Analog für Tooling
- UI Component Doku mit Storybook
- alles andere wenn möglich migrieren à natürlich mit KI J

---

## Slide 55: 3.7 Ökosystem

- Unbedingt PNPM statt NPM / yarn
- Optional Stylelint wenn man SCSS auch Linten möchte
- Optional Nx für größere Projekte/Libraries/Monorepo
- Optional Component Libraries bzw. Design Systeme
- Angular Material (sehr eigen, schwer zu customizen)
- oder ZardUI (modern, lean, basiert auf shadcn)
- à super wenn es brauchbaren Figma MCP gibt

---

## Slide 56: 3.8 Official Angular Coding Style Guide (Excerpt)

- One concept per file and inject()
- Group Angular-specific proper^es before methods
- Keep components and direc^ves focused on presenta^on
- Avoid overly complex logic in templates
- Use protected on class members … only used by … template
- Use readonly for proper^es that shouldn't change

---

## Slide 57: Showcase: Angular v20 Style Guide

hFps://angular.dev/style-guide

---

## Slide 58: 3.9 LXT's Angular Coding Style Guide (Excerpt)

- suffix observables with $ • prefer using the AsyncPipe, use the takeUntil\lDestroyed() operator if subscribing manually • keep constructors and lifecycle hooks simple and clean (basically only call methods, except one-liners) • group components, direc\ves, pipes & services like this • …

---

## Slide 59: Showcase: My Coding Style Guide

hFps://github.com/L-X-T/ng-b357/blob/main/style-guide/style-guide.md

---

## Slide 60: 3.10 Angular ESLint Best Practices .ts

- '@angular-eslint/no-empty-lifecycle-method' à beier no lifecycle at all
- '@angular-eslint/prefer-on-push-component-change-detec\on'
- '@angular-eslint/prefer-output-readonly'
- '@angular-eslint/prefer-signals'
- '@angular-eslint/prefer-standalone'

---

## Slide 61: 3.11 Angular ESLint Best PracWces .html

- '@angular-eslint/template/attributes-order'
- '@angular-eslint/template/button-has-type'
- '@angular-eslint/template/prefer-control-flow'
- '@angular-eslint/template/prefer-ngsrc'
- '@angular-eslint/template/prefer-self-closing-tags'

---

## Slide 62: Teil 3 Zusammenfassung

- Angular unbedingt up2date halten um Sicherheit und moderne Features
  zu gewährleisten à auch die Migra\ons mitnehmen à KI hilu J
- Angular Coding Style Guide befolgen à KI braucht Angular MCP
- Angular ESLint Regeln scharf schalten à KI braucht extra Hinweis

---

## Slide 63: Teil 4 – Praxis: Refactoring einer (sehr) verstaubten Angular-Komponente

https://github.com/L-X-T/ng-days-refactoring-ai

---

## Slide 64: Live: AgenLc Refactoring

hFps://

---

## Slide 65: Let AI do the hard work to improve & modernize our Angular workspaces!

---

## Slide 67: What will you refactor?

---

## Slide 68: Please share your feedback in the NG days app!

---

## Slide 69: Thank you for the attention

[X] @LX_T [web] https://LXT.dev
Workshops and Consul/ng
https://angulararchitects.io
