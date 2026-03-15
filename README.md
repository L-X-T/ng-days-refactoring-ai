# NG Days 2026 - Refactoring verstaubter Angular-Komponenten mithilfe von KI

Dieses Lab führt dich durch das Refactoring der Legacy-`TableComponent` hin zu einer modernen, sauberen und wartbaren Angular-Komponente mithilfe deines AI Agents. Die folgenden Schritte basieren auf den Prinzipien, die im Workshop „Refactoring verstaubter Angular-Komponenten mithilfe von KI“ besprochen wurden.

## Slides zum Workshop

Findest Du auf [LXT.dev](https://lxt.dev), genauer gesagt hier: https://lxt.dev/refactoring-ai.pdf.

## Inhaltsverzeichnis

<!-- TOC -->

- [Voraussetzungen](#voraussetzungen)
- [Empfehlung zum konkreten Fallbeispiel](#empfehlung-zum-konkreten-fallbeispiel)
- [Die 7-Schritte-Vorgehensweise (Blueprint)](#die-7-schritte-vorgehensweise-blueprint)
- [Schritt 1: Analyse der bestehenden `TableComponent`](#schritt-1-analyse-der-bestehenden-tablecomponent)
- [Schritt 2: Aggregationslogik auslagern und AG-Grid-Funktionalität nutzen](#schritt-2-aggregationslogik-auslagern-und-ag-grid-funktionalität-nutzen)
- [Schritt 3: Update auf Angular v21 inkl. Dependencies](#schritt-3-update-auf-angular-v21-inkl-dependencies)
- [Schritt 4a: Modernisierung der Component API (`@Input()` und `@Output()`)](#schritt-4a-modernisierung-der-component-api-input-und-output)
- [Schritt 4b: Eliminierung von Lifecycle Hooks (`ngOnChanges` & `ngOnInit`)](#schritt-4b-eliminierung-von-lifecycle-hooks-ngonchanges--ngoninit)
- [Schritt 5: Strict Typing & Entfernen von `any`](#schritt-5-strict-typing--entfernen-von-any)
- [Schritt 6: Clean-Code-Prinzipien (Komponentenstruktur & Größe)](#schritt-6-clean-code-prinzipien-komponentenstruktur--größe)
- [Schritt 7: Review und Validierung](#schritt-7-review-und-validierung)
<!-- TOC -->

## Voraussetzungen

- Stelle sicher, dass deine IDE (WebStorm mit Junie, VS Code mit Claude Code, Cursor oder Windsurf) mit deinem AI Agent eingerichtet ist.
- Vergewissere dich, dass Prettier, ESLint und deine AI-Anweisungen (`AI.md`, `mcp.json`, `.aiignore`) korrekt konfiguriert sind.

## Empfehlung zum konkreten Fallbeispiel

- Die Aggregationslogik in der `TableComponent` ist besonders komplex und funktioniert noch dazu nicht richtig.
- Es wäre sinnvoll, diesen Schritt als Erstes anzugehen, um die Komplexität der Hauptkomponente zu reduzieren.
- Statt der eigens erstellten Aggregationslogik wollen wir die `AG Grid`-Aggregationsfunktionalität nutzen.

## Die 7-Schritte-Vorgehensweise (Blueprint)

1. **Analyse:** Verstehe die aktuelle Struktur und Funktionalität der `TableComponent`, um gezielt refaktorieren zu können.
2. **Entschlacken:** Entferne alle nicht mehr benötigten Funktionen, Kommentare und veralteten Code aus der `TableComponent`, um die Übersicht zu verbessern.
3. **NG Update:** Aktualisiere Angular und alle relevanten Pakete auf die neueste Version, um von den neuesten Features und Verbesserungen zu profitieren.
4. **Modernisieren:** Ersetze veraltete Angular-APIs (wie `@Input()`, `@Output()`, Lifecycle Hooks) durch moderne signalbasierte APIs.
5. **Typisierung:** Ersetze alle `any`-Typen durch präzise Typen oder Interfaces, um die Wartbarkeit zu verbessern und die Fehleranfälligkeit zu reduzieren.
6. **Refactoring:** Strukturiere die Komponente neu, indem du Logik in Konstanten, Services oder Helper auslagerst, um die Hauptkomponente schlanker zu machen. Benenne Methoden und Variablen aussagekräftig und konsistent. Bring Ordnung in die Klasse, indem du Member gemäß der vorgeschlagenen Struktur anordnest.
7. **Review:** Überprüfe die refaktorisierte Komponente auf Einhaltung der Clean-Code-Prinzipien und Angular Best Practices und stelle sicher, dass die Funktionalität erhalten bleibt.

## Schritt 1: Analyse der bestehenden `TableComponent`

**Ziel:** Verstehe die aktuelle Struktur, Funktionalität und Komplexität der `TableComponent`, um gezielt refaktorieren zu können.

- **Dateigröße:** Die `table.component.ts` hat aktuell über 900 Zeilen Code, was weit über dem empfohlenen Limit von ca. 400 LoC liegt.
- **Komplexität:** Es gibt viele Verantwortlichkeiten in einer einzigen Komponente, einschließlich der Handhabung von Grid-Optionen, Spaltendefinitionen, Aggregationslogik, Event-Handling und Lifecycle-Management.
- **Veraltete APIs:** Die Komponente verwendet veraltete Angular-APIs wie `@Input()`, `@Output()`, `ngOnChanges`, `ngOnInit` und `@ViewChild`, die durch moderne signalbasierte APIs ersetzt werden sollten.
- **Typisierung:** Es gibt mehrere Stellen mit `any`, was die Wartbarkeit beeinträchtigt und die Fehleranfälligkeit erhöht.

_Bonus:_ Lass die KI eine Zusammenfassung der `TableComponent` erstellen, um sicherzustellen, dass du alle Aspekte der Komponente verstehst, bevor du mit dem Refactoring beginnst.

## Schritt 2: Aggregationslogik auslagern und AG-Grid-Funktionalität nutzen

**Ziel:** Reduzierung der Komplexität in der `TableComponent` und Nutzung der eingebauten AG-Grid-Aggregationsfunktionen.

- **AG Grid Aggregation nutzen:** Anstatt eine eigene Aggregationslogik zu implementieren, solltest du die von AG Grid bereitgestellten Funktionen verwenden.
- **Entrümpeln:** Entferne die gesamte benutzerdefinierte Aggregationslogik aus der `TableComponent`, einschließlich aller Methoden, die sich mit der Berechnung von Aggregationen beschäftigen.
- **Aggregationsfunktionen:** Definiere die Aggregationsfunktionen in den Spaltendefinitionen (`columnDefs`) und konfiguriere die entsprechenden `aggFunc`-Werte (z. B. `sum`, `avg`, `min`, `max`).
- **Gerne überspringen:** Um der knappen Zeit hier gerecht zu werden, kannst du die Spaltendefinitionen auch überspringen und direkt mit dem nächsten Schritt fortfahren.

_Pro Tip:_ Hier die KI arbeiten lassen. Nach jedem Schritt solltest du einen Git-Commit machen.

## Schritt 3: Update auf Angular v21 inkl. Dependencies

**Ziel:** Angular auf den neuesten Stand bringen, um die Vorteile der neuesten Features sowie den Angular MCP zu nutzen.

- **Angular & Core-Pakete aktualisieren:** Führe `nx migrate latest` aus, um Nx und Angular auf die neueste Version zu migrieren. Folge den Anweisungen der Angular CLI, um eventuelle automatische Migrationen anzuwenden.
- **Weitere Abhängigkeiten aktualisieren:** Aktualisiere alle Angular-Pakete manuell, um wirklich die neueste Version zu bekommen.
- **Angular MCP einrichten:** Füge den Angular Language Service MCP-Server zu deiner AI-Konfiguration (`mcp.json`) hinzu, damit dein AI Agent direkten Zugriff auf Angular-spezifisches Wissen und Compiler-Informationen erhält.
- **Kompilierung prüfen:** Stelle sicher, dass das Projekt nach dem Update weiterhin fehlerfrei baut (`nx serve` und `nx build`) und keine Breaking Changes übersehen wurden.

_Pro Tip:_ Mach das Update lieber selbst, ohne KI.

## Schritt 4a: Modernisierung der Component API (`@Input()` und `@Output()`)

**Ziel:** Migration der alten `@Input()`- und `@Output()`-Decorators auf moderne Angular-Signal-APIs.

- **Inputs konvertieren:** Ersetze alle `@Input()`-Properties (z. B. `tableData`, `toolbar`, `isLoading`) durch `input()` bzw. `input.required()`.
- **Outputs konvertieren:** Ersetze `@Output() actionExecuted = new EventEmitter<...>()` durch die moderne `output()`-Funktion.
- **Model einführen:** Führe gegebenenfalls `model()` ein, etwa als Kombination aus In- und Output und/oder als schreibbares Input.
- **View Queries:** Migriere `@ViewChild('myGrid')` zur neuen signalbasierten `viewChild('myGrid')`-API.
- **Keyboard Events:** Refaktoriere die große `@HostListener('keydown')`-Methode in modernes `:host`-Binding.

_Pro Tip:_ Nutze für einfachere Komponenten das Migrationstool von Angular. Falls das nicht klappt, lass dir von der KI helfen.

## Schritt 4b: Eliminierung von Lifecycle Hooks (`ngOnChanges` & `ngOnInit`) und Nutzung von `computed()`

**Ziel:** Entfernung von `ngOnChanges`, `ngOnInit` und `ngAfterViewInit` durch die Nutzung von Signals und moderner Reaktivität, insbesondere des Gamechangers **`computed()`**.

- **Initialisierung:** Verschiebe die Initialisierungslogik aus `ngOnInit` (wie `setUpPagination`, `setUpRowHeight` etc.) in den Konstruktor oder nutze sie, um den Component State direkt zu initialisieren.
- **`ngOnChanges` ersetzen:** Das aktuelle `ngOnChanges` ist komplex und imperativ. Refaktoriere dies, indem du `computed()`-Signals verwendest, um den State (wie `columns`, `rows`, `selectionMessage`) aus den neuen Signal-Inputs abzuleiten.
- **Side Effects:** Für Side Effects, die passieren müssen, wenn sich ein Input ändert (wie die Interaktion mit der `ag-grid`-API oder `setGridOption`), verwende `effect()` innerhalb des `constructor()`. Versuche, die Anzahl der Effekte zu minimieren, indem du sie logisch gruppierst.

_AI Tip:_ Lass dir von der KI helfen, aber prüfe jeden Schritt sorgfältig, um sicherzustellen, dass die Logik korrekt extrahiert wurde und alles wie gehabt funktioniert.

## Schritt 5: Strict Typing & Entfernen von `any`

**Ziel:** Sicherstellen, dass die Komponente strikt den TypeScript-Best-Practices folgt.

- Identifiziere alle Vorkommen von `any` (z. B. `bottomRowData: any[]`, `getRowId: GetRowIdFunc<any>`).
- Ersetze `any` durch präzise Typen oder Interfaces.
- Stelle sicher, dass alle Methoden explizite Rückgabetypen haben.

_AI Tip:_ Lass dir von der KI helfen, aber prüfe jeden Schritt sorgfältig, um sicherzustellen, dass die neuen Typen korrekt definiert wurden und die Logik weiterhin funktioniert.

## Schritt 6: Clean-Code-Prinzipien (Komponentenstruktur & Größe)

**Ziel:** Reduzierung der Dateigröße und Verbesserung der Lesbarkeit, indem Logik aus der massiven `table.component.ts` (aktuell über 900 LoC) ausgelagert wird.

- **Konfigurationen extrahieren:** Verschiebe statische Konfigurationen, Standard-Spaltendefinitionen und das Grid-Setup (wie `setUpGridOptions`, `setUpColumnTypes` und Kontextmenü-Konfigurationen) in separate Helper-Dateien, Services oder pure Utility-Funktionen.
- **Klasse strukturieren:** Ordne die verbleibenden Komponenten-Member gemäß der vorgeschlagenen Struktur an:
  1. `inject()`
  2. `input`, `model`, `output`
  3. `queries` (z. B. `viewChild`)
  4. `signals` (State)
  5. andere Member
  6. Methoden (Details siehe hier https://github.com/L-X-T/ng-b357/blob/main/style-guide/style-guide.ts.md#should-do)
- **Methoden refaktorisieren:** Benenne Methoden und Variablen aussagekräftig und konsistent. Gruppiere verwandte Methoden logisch zusammen (z. B. alle Methoden, die sich mit der Interaktion mit der `ag-grid`-API beschäftigen, sollten nahe beieinander liegen).

_AI Tip:_ Lass dir von der KI helfen, aber prüfe jeden Schritt sorgfältig, um sicherzustellen, dass die Logik korrekt extrahiert wurde und die Abhängigkeiten sauber gehandhabt werden.

## Schritt 7: Review und Validierung

**Ziel:** Überprüfen, ob die refaktorisierte Komponente unsere Qualitätsvorgaben erfüllt.

- Prüfe, ob die Dateigröße deutlich näher am Limit von ca. 400 LoC liegt.
- Führe ESLint aus, um sicherzustellen, dass keine Angular-ESLint-Best-Practice-Regeln (wie `no-empty-lifecycle-method`, `prefer-signals`, `prefer-output-readonly`) verletzt werden.
- Verifiziere, dass die App weiterhin kompiliert, baut und die Tabelle wie erwartet im Browser funktioniert.
