# NG Days 2026 - Refactoring verstaubter Angular-Komponenten mithilfe von KI

Dieses Lab führt dich durch das Refactoring der Legacy `TableComponent` in eine moderne, saubere und wartbare Angular-Komponente mithilfe deines AI Agents. Die folgenden Schritte basieren auf den Prinzipien, die im Workshop "Refactoring verstaubter Angular-Komponenten mithilfe von KI" besprochen wurden.

## Inhaltsverzeichnis

- [Voraussetzungen](#voraussetzungen)
- [Schritt 0: Update Angular 21 inkl. Dependencies](#schritt-0-update-angular-21-inkl-dependencies)
- [Schritt 1: Clean Code Prinzipien (Komponentenstruktur & Größe)](#schritt-1-clean-code-prinzipien-komponentenstruktur--größe)
- [Schritt 2: Modernisierung der Component API (Inputs & Outputs)](#schritt-2-modernisierung-der-component-api-inputs--outputs)
- [Schritt 3: Eliminierung von Lifecycle Hooks (`ngOnChanges` & `ngOnInit`)](#schritt-3-eliminierung-von-lifecycle-hooks-ngonchanges--ngoninit)
- [Schritt 4: Strict Typing & Entfernen von `any`](#schritt-4-strict-typing--entfernen-von-any)
- [Schritt 5: Refactoring von Event Handlern & View Queries](#schritt-5-refactoring-von-event-handlern--view-queries)
- [Schritt 6: Review und Validierung](#schritt-6-review-und-validierung)

## Voraussetzungen

- Stelle sicher, dass deine IDE (WebStorm mit Junie, VS Code mit Claude Code, Cursor oder Windsurf) mit deinem AI Agent eingerichtet ist.
- Vergewissere dich, dass Prettier, ESLint und deine AI-Anweisungen (`AI.md`, `mcp.json`, `.aiignore`) korrekt konfiguriert sind.

## Schritt 0: Update Angular 21 inkl. Dependencies

**Ziel:** Angular auf den neusten Stand bringen, um die Vorteile der neuesten Features, sowie den Angular MCP zu nutzen.

- **Angular & Core-Pakete aktualisieren:** Führe `ng update @angular/core @angular/cli` aus, um Angular auf die neueste Version zu migrieren. Folge den Anweisungen der Angular CLI, um eventuelle automatische Migrationen anzuwenden.
- **Weitere Abhängigkeiten aktualisieren:** Aktualisiere alle weiteren Angular-Pakete (z. B. `@angular/material`, `@angular/cdk`) mit `ng update`. Prüfe anschließend mit `npm outdated`, ob weitere Pakete veraltet sind, und aktualisiere sie bei Bedarf.
- **Angular MCP einrichten:** Füge den Angular Language Service MCP-Server zu deiner AI-Konfiguration (`mcp.json`) hinzu, damit dein AI Agent direkten Zugriff auf Angular-spezifisches Wissen und Compiler-Informationen erhält.
- **Kompilierung prüfen:** Stelle sicher, dass das Projekt nach dem Update weiterhin fehlerfrei baut (`ng build`) und keine Breaking Changes übersehen wurden.

_Pro Tip:_ Mach das Update lieber selbst, ohne KI.

## Schritt 1: Clean Code Prinzipien (Komponentenstruktur & Größe)

**Ziel:** Reduzierung der Dateigröße und Verbesserung der Lesbarkeit, indem Logik aus der massiven `table.component.ts` (aktuell über 900 LoC) ausgelagert wird.

- **Configurations extrahieren:** Verschiebe statische Konfigurationen, Standard-Spaltendefinitionen und das Grid-Setup (wie `setUpGridOptions`, `setUpColumnTypes` und Kontextmenü-Konfigurationen) in separate Helper-Dateien, Services oder pure Utility-Funktionen.
- **Aggregation Logic extrahieren:** Die `TableComponent` enthält massive Switch-Cases und Logik für Aggregationen (`addAggregation`, `firstAggregation`, `lastAggregation`, etc.). Extrahiere dies in einen dedizierten `table-aggregation.service.ts` oder Utility-Funktionen.
- **Klasse strukturieren:** Ordne die verbleibenden Komponenten-Member gemäß der vorgeschlagenen Struktur an:
  1. `inject()`
  2. `input`, `model`, `output`
  3. `queries` (z. B. `viewChild`)
  4. `signals` (State)
  5. Andere Member
  6. Methoden (public, dann private)

_AI Prompt Tip:_ Bitte deinen AI Agent: "Extract all aggregation logic from TableComponent into a new TableAggregationService, ensuring strict typing and pure functions where possible. Then sort the remaining members according to the Angular v20 style guide."

## Schritt 2: Modernisierung der Component API (Inputs & Outputs)

**Ziel:** Migration der alten `@Input()` und `@Output()` Decorators auf moderne Angular Signal APIs.

- **Inputs konvertieren:** Ersetze alle `@Input()` Properties (z. B. `tableData`, `toolbar`, `isLoading`) durch `input()`, `input.required()` oder `model()`.
- **Outputs konvertieren:** Ersetze `@Output() actionExecuted = new EventEmitter<...>()` durch die moderne `output()` Funktion.

_AI Prompt Tip:_ Bitte deinen AI Agent: "Convert all @Input and @Output decorators in TableComponent to the new Angular signal-based input() and output() API, ensuring strict typing and preserving all existing default values."

## Schritt 3: Eliminierung von Lifecycle Hooks (`ngOnChanges` & `ngOnInit`)

**Ziel:** Entfernung von `ngOnChanges`, `ngOnInit` und `ngAfterViewInit` durch die Nutzung von Signals und moderner Reactivity.

- **`ngOnChanges` ersetzen:** Das aktuelle `ngOnChanges` ist komplex und imperativ. Refactore dies, indem du `computed()` Signals verwendest, um den State (wie `columns`, `rows`, `selectionMessage`) aus den neuen Signal-Inputs abzuleiten.
- **Side Effects:** Für Side Effects, die passieren müssen, wenn sich ein Input ändert (wie die Interaktion mit der `ag-grid` API oder `setGridOption`), verwende `effect()` innerhalb des `constructor()`.
- **Initialisierung:** Verschiebe die Initialisierungslogik aus `ngOnInit` (wie `setUpPagination`, `setUpRowHeight`, etc.) in den Konstruktor oder nutze sie, um den Component-State direkt zu initialisieren.

_AI Prompt Tip:_ Bitte deinen AI Agent: "Replace ngOnChanges and ngOnInit in TableComponent. Use computed signals for derived state and the constructor with effect() for ag-grid side effects. Remove the OnChanges and OnInit interfaces."

## Schritt 4: Strict Typing & Entfernen von `any`

**Ziel:** Sicherstellen, dass die Komponente strikt den TypeScript Best Practices folgt.

- Identifiziere alle Vorkommen von `any` (z. B. `bottomRowData: any[]`, `getRowId: GetRowIdFunc<any>`).
- Ersetze `any` durch präzise Typen oder Interfaces. Wenn der Typ wirklich dynamisch ist, verwende `unknown`.
- Stelle sicher, dass alle Methoden explizite Rückgabetypen haben.

## Schritt 5: Refactoring von Event Handlern & View Queries

**Ziel:** Vereinfachung des Event Handlings und der DOM-Interaktion.

- **Keyboard Events:** Refactore die große `@HostListener('keydown')` Methode in kleinere, gut benannte Funktionen (z. B. `handlePaginationShortcut(event)`).
- **View Queries:** Migriere `@ViewChild('myGrid')` zum neuen Signal-basierten `viewChild('myGrid')`.

## Schritt 6: Review und Validierung

**Ziel:** Überprüfen, ob die refaktorisierte Komponente unsere Qualitätsvorgaben erfüllt.

- Prüfe, ob die Dateigröße deutlich näher am Limit von ~400 LoC liegt.
- Führe ESLint aus, um sicherzustellen, dass keine Angular ESLint Best Practice Regeln (wie `no-empty-lifecycle-method`, `prefer-signals`, `prefer-output-readonly`) verletzt werden.
- Verifiziere, dass die App weiterhin kompiliert und die Tabelle wie erwartet im Browser funktioniert.
