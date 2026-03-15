import 'ag-grid-enterprise';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ColDef,
  FirstDataRenderedEvent,
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  GetRowIdFunc,
  GridOptions,
  ICellRendererParams,
  MenuItemDef,
  PaginationNumberFormatterParams,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from 'ag-grid-community';
import { SideBarDef } from 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';
import { left } from '@popperjs/core';

import { TableColumn } from './entities/table-column';
import { TableColumnTranslations } from './entities/table-column-translations';
import { TableData } from './entities/table-data';
import { TableRow } from './entities/table-row';
import { Toolbar } from './entities/toolbar';
import { ToolbarAction } from './entities/toolbar-action';
import { Aggregation } from './entities/aggregations';
import { CellData } from './entities/cell-data-type';
import { BitMask, customCellRendererMask, Types } from './entities/types-bitmask';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { PageSelectorComponent } from './page-selector/page-selector.component';
import { AggregationRowComponent } from './aggregation-row/aggregation-row.component';
import {
  renderBooleanTemplate,
  renderCheckboxTemplate,
  renderDateTemplate,
  renderDefaultTemplate,
  renderOrdinalNumberTemplate,
  renderProgressTemplate,
  renderStatusTemplate,
} from './cell-renderer/renderer-templates';
import { BottomRowData, TableAggregationService } from './table-aggregation.service';

@Component({
  selector: 'lxt-table',
  imports: [AgGridAngular, FormsModule, ReactiveFormsModule, ToolbarComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [TableAggregationService],
})
export class TableComponent implements AfterViewInit, OnChanges, OnInit {
  // 1. inject()
  private readonly aggregationService = inject(TableAggregationService);

  // 2. Inputs & Outputs
  readonly tableData = input.required<TableData>();
  readonly toolbar = input.required<Toolbar>();
  readonly editRoute = input('');
  readonly rowId = input('id');
  readonly allowMultiSelection = input<boolean | undefined>(undefined);
  readonly isLoading = input(false);
  readonly componentDefaultColumns = input.required<TableColumn[]>();
  readonly columnTranslations = input.required<TableColumnTranslations>();
  readonly paginationPageSize = input<number | undefined>(20);
  readonly isSelectionEnabled = input(true);
  readonly columnsSizeStrategy = input<'fitGridWidth' | 'fitCellContents' | 'fitProvidedWidth'>('fitProvidedWidth');
  readonly rowGroupPanelShow = input<'always' | 'onlyWhenGrouping' | 'never' | undefined>('onlyWhenGrouping');
  readonly showAggRowInput = input(false, { alias: 'showAggRow' });
  readonly dateFormat = input('yyyy-MM-dd');
  readonly allowRowGrouping = input(true);
  readonly pagination = input(true);
  readonly primaryKeyColumns = input<string[]>([]);

  readonly actionExecuted = output<ToolbarAction>();
  readonly rowSelected = output<TableRow[]>();

  // 3. View queries
  @ViewChild('myGrid') grid!: AgGridAngular;
  @ViewChild('myGrid', { read: ElementRef }) gridRef!: ElementRef;

  // 4. State
  bottomRowData: BottomRowData[] = [{}];
  appliedAggFuncs: { [key in Aggregation]?: boolean } = {};
  columns: TableColumn[] = [];
  rows: TableRow[] = [];
  selectedRows: TableRow[] = [];
  selectedRowCount = 0;
  selectionMessage = '';
  showAggRow = false;

  // 5. Other members
  columnTypes!: { [key: string]: ColDef };
  defaultColDef!: ColDef;
  rowHeight = 0;
  paginationAutoPageSize = false; // [TODO] set true for mobile
  paginationNumberFormatter!: (params: PaginationNumberFormatterParams) => string;
  sideBar!: SideBarDef | string | string[] | boolean | null;
  gridOptions!: GridOptions;
  autoSizeStrategy!:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy;

  overlayLoadingTemplate =
    '<object style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%) scale(2)" type="image/svg+xml" data="https://ag-grid.com/images/ag-grid-loading-spinner.svg" aria-label="loading"></object>';
  overlayNoRowsTemplate = '<span>No rows to show</span>';

  getRowId: GetRowIdFunc = (params) => {
    let rowId = '';
    this.primaryKeyColumns().forEach((column) => {
      if (rowId !== '') {
        rowId += '-';
      }
      rowId += (params.data as Record<string, unknown>)[column];
    });
    return rowId;
  };

  onCellContextMenu = (): void => {
    setTimeout(() => {
      const menu = this.gridRef.nativeElement.querySelector('.ag-menu') as HTMLElement;
      if (!menu) {
        return;
      }
      const menuRect = menu.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (menuRect.bottom > viewportHeight) {
        const gridElement = this.gridRef.nativeElement;
        const gridHeight = gridElement.offsetHeight - (gridElement.getBoundingClientRect().bottom - viewportHeight);
        const top = Math.floor(Math.max(0, gridHeight - (menuRect.height + 16)));
        menu.style.top = `${top}px`;
      }
    }, 0);
  };

  private isAutoSized = false;

  // Lifecycle hooks
  ngOnInit(): void {
    this.showAggRow = this.showAggRowInput();
    this.setUpGridOptions();
    this.setUpColumnTypes();
    this.setUpPagination();
    this.setUpRowHeight();
    this.setUpSideBar();
    this.setUpAutoSizing();
    this.setUpAggRow();
  }

  ngAfterViewInit(): void {
    this.setUpOnIntersection();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      const tableData: TableData = this.tableData();
      if (tableData && changes['tableData']) {
        if (tableData.columns?.length) {
          this.setUpColumns(tableData);
        }

        // WARNING we need to update the rows via the grid API because only then the event
        // onRowDataUpdated is emitted, which we need to propagate the current selection
        // after a data reload
        if (changes['tableData'].previousValue) {
          this.grid.api.setGridOption('rowData', tableData.rows.length ? tableData.rows : []);
        } else {
          this.rows = tableData.rows?.length ? [...tableData.rows] : [];
        }
      }
      if (changes['dateFormat']) {
        this.refreshGrid();
      }
      if (changes['isSelectionEnabled']) {
        this.setSelection(this.isSelectionEnabled());
      }
      if (this.grid?.api) {
        if (this.isLoading()) {
          this.grid.api.showLoadingOverlay();
        } else {
          this.grid.api.hideOverlay();
        }
      }
    }

    // If data has no rows currently no columns are returned, so we use the query params from the screen definition
    if (!this.columns || this.columns?.length < 1) {
      this.columns = this.componentDefaultColumns();
    }

    if (changes['columnTranslations'] && !changes['columnTranslations'].firstChange) {
      this.updateColumnTranslations(this.columnTranslations());
    }

    this.prepareSelectionMessage();
  }

  @HostListener('keydown', ['$event'])
  keydown(event: KeyboardEvent): void {
    const activeElement = (event as KeyboardEvent & { explicitOriginalTarget?: HTMLElement }).explicitOriginalTarget;
    if (activeElement?.tagName === 'INPUT' || !event.shiftKey) {
      return;
    }

    switch (event.key) {
      case 'Home':
        this.grid.api.paginationGoToFirstPage();
        break;
      case 'End':
        this.grid.api.paginationGoToLastPage();
        break;
      case 'ArrowLeft':
        this.grid.api.paginationGoToPreviousPage();
        break;
      case 'ArrowRight':
        this.grid.api.paginationGoToNextPage();
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  // 6. Public methods
  onSelectionChanged(): void {
    this.readSelectedRowsAndEmitThem();
  }

  onFirstDataRendered(_params: FirstDataRenderedEvent): void {
    this.selectFirstRow();
  }

  onSearch(searchTerm: string): void {
    this.grid.api.setQuickFilter(searchTerm);
    this.prepareSelectionMessage();
  }

  onColumnChanged(): void {
    this.reload();
  }

  onColumnGroupChanged(): void {
    const columns = this.grid.api.getColumns();
    const isColumnGrouped =
      columns?.some((column) => (column as unknown as Record<string, unknown>)['rowGroupActive']) ?? false;
    this.setVisibilityValuesSection(isColumnGrouped);
  }

  refreshGrid(): void {
    if (!this.grid) {
      return;
    }
    this.grid?.api.redrawRows();
    this.reload();
  }

  onRowDataUpdated(): void {
    this.readSelectedRowsAndEmitThem();
  }

  // 7. Private methods
  private setUpOnIntersection(): void {
    const options: IntersectionObserverInit = {
      root: document.documentElement,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!this.isAutoSized && entry.intersectionRatio > 0) {
          this.grid.api.autoSizeAllColumns();
          this.isAutoSized = true;
          obs.disconnect();
          return;
        }
      });
    }, options);

    observer.observe(this.gridRef.nativeElement);
  }

  private setUpColumns(tableData: TableData): void {
    this.columns = [
      ...tableData.columns
        .filter((col) => col.isVisible)
        .map((col) => ({
          ...col,
          headerName: this.columnTranslations()?.[col.localizerKey ?? ''] ?? col.field,
          cellStyle: col.cellDataType === 'number' ? { textAlign: 'right' } : {},
        })),
    ];
  }

  private updateColumnTranslations(translations: TableColumnTranslations): void {
    this.columns = [
      ...this.columns.map((col) => ({ ...col, headerName: translations[col.localizerKey ?? ''] ?? col.field })),
    ];
  }

  private showIcon(aggFunc: Aggregation): string {
    if (this.appliedAggFuncs[aggFunc]) {
      return '<i class="icon i-lxt-check"></i>';
    }
    return '';
  }

  private getMainMenuItems = (params: GetMainMenuItemsParams): (string | MenuItemDef)[] => {
    let items: (string | MenuItemDef)[] = [...params.defaultItems] as (string | MenuItemDef)[];
    if (!this.allowRowGrouping()) {
      items = (items as string[]).filter((item) => item !== 'rowGroup') as (string | MenuItemDef)[];
    }
    items.push({
      name: 'Aggregation func.',
      subMenu: this.getAggregationContextMenu(params),
      icon: '<i class="fa fa-star"></i>',
      disabled: false,
    });
    return items;
  };

  private getContextMenuItems = (params: GetContextMenuItemsParams): (string | MenuItemDef)[] => {
    // Context menu for aggregation row
    if (params.node?.id?.match(/b-[0-9]{1,2}/g)) {
      return [];
    }

    return this.getRowContextMenu();
  };

  private getAggregationContextMenu(params: unknown): (string | MenuItemDef)[] {
    if (!this.grid.columnDefs) {
      return [];
    }
    const types = new BitMask();
    for (const columnDef of this.grid.columnDefs) {
      const column = (<ColDef>columnDef).field;
      if (!column) {
        continue;
      }

      const type = this.grid.api.getColumn(column)?.getUserProvidedColDef()?.cellDataType ?? 'text';
      switch (type) {
        case 'text':
        case 'boolean':
        case 'checkbox':
        case 'ordinalNumber':
          types.setFlag(Types.text);
          break;
        case 'number':
        case 'status':
        case 'progress':
          types.setFlag(Types.number);
          break;
        case 'date':
          types.setFlag(Types.date);
          break;
      }
    }
    const defaultActions: MenuItemDef[] = [
      {
        name: 'count',
        icon: this.showIcon(Aggregation.COUNT),
        action: () => this.addAggregation(Aggregation.COUNT),
      },
      {
        name: 'count_d',
        icon: this.showIcon(Aggregation.COUNT_DISTINCT),
        action: () => this.addAggregation(Aggregation.COUNT_DISTINCT),
      },
      {
        name: 'first',
        icon: this.showIcon(Aggregation.FIRST),
        action: () => this.addAggregation(Aggregation.FIRST),
      },
      {
        name: 'last',
        icon: this.showIcon(Aggregation.LAST),
        action: () => this.addAggregation(Aggregation.LAST),
      },
      {
        name: 'avg',
        icon: this.showIcon(Aggregation.AVERAGE),
        action: () => this.addAggregation(Aggregation.AVERAGE),
        disabled: !types.checkFlag(Types.number),
      },
      {
        name: 'median',
        icon: this.showIcon(Aggregation.MEDIAN),
        action: () => this.addAggregation(Aggregation.MEDIAN),
        disabled: !types.checkFlag(Types.number),
      },
      {
        name: 'sum',
        icon: this.showIcon(Aggregation.SUM),
        action: () => this.addAggregation(Aggregation.SUM),
        disabled: !types.checkFlag(Types.number),
      },
      {
        name: 'max',
        icon: this.showIcon(Aggregation.MAX),
        action: () => this.addAggregation(Aggregation.MAX),
        disabled: !types.checkFlag(Types.number | Types.date),
      },
      {
        name: 'min',
        icon: this.showIcon(Aggregation.MIN),
        action: () => this.addAggregation(Aggregation.MIN),
        disabled: !types.checkFlag(Types.number | Types.date),
      },
    ];
    return defaultActions;
  }

  private getRowContextMenu(): (string | MenuItemDef)[] {
    const result: (string | MenuItemDef)[] = [];
    if (this.toolbar()?.actions) {
      for (const action of this.toolbar().actions) {
        result.push({
          icon: `<span class="icon i-lxt-${action.icon}"></span>`,
          name: action.key,
          shortcut: action.keyBinding,
          cssClasses: action.destructive ? ['context-menu-item--destructive'] : [],
          disabled: action.disabled,
        });
      }
      result.push('separator');
    }
    result.push({ name: 'Clear all settings', action: () => {} });
    result.push({ name: 'Send message', action: () => {} });
    result.push('separator');
    result.push({ name: 'Reload', action: () => {} });
    return result;
  }

  private setUpGridOptions(): void {
    this.gridOptions = {
      autoGroupColumnDef: {
        headerCheckboxSelection: true,
        cellRendererParams: {
          checkbox: true,
          checkboxPosition: 'before',
        },
        suppressMovable: true,
        lockPosition: left,
      },
      suppressCopyRowsToClipboard: true,
      cellFlashDuration: 0,
      cellFadeDuration: 0,
      localeText: {
        values: 'Row groups values',
      },
      aggFuncs: {
        min: (rows) => this.aggregationService.minAggregation(rows),
        max: (rows) => this.aggregationService.maxAggregation(rows),
        sum: (rows) => this.aggregationService.sumAggregation(rows),
        avg: (rows) => this.aggregationService.averageAggregation(rows),
        first: (rows) => this.aggregationService.firstAggregation(rows),
        last: (rows) => this.aggregationService.lastAggregation(rows),
        count: (rows) => this.aggregationService.countAggregation(rows),
        count_d: (rows) => this.aggregationService.countDistinctAggregation(rows),
        median: (rows) => this.aggregationService.medianAggregation(rows),
      },
      suppressRowClickSelection: !this.isSelectionEnabled(),
      statusBar: this.pagination()
        ? {
            statusPanels: [
              { statusPanel: PageSelectorComponent, align: 'left' },
              { statusPanel: PaginatorComponent, align: 'right' },
            ],
          }
        : undefined,
      getContextMenuItems: this.getContextMenuItems,
      getMainMenuItems: this.getMainMenuItems,
      onCellContextMenu: this.onCellContextMenu,
    };
  }

  private setSelection(selection: boolean): void {
    if (this.grid) {
      this.grid.api.updateGridOptions({
        suppressRowClickSelection: !selection,
      });
      this.refreshGrid();
    }
  }

  protected reload(): void {
    const aggFuncs = this.bottomRowData.map((aggFunc) =>
      Object.keys(aggFunc).map((key) => ({ col: key, aggType: aggFunc[key].aggFunction })),
    );
    this.bottomRowData = [{}];
    for (const aggRow of aggFuncs) {
      for (const foo of aggRow) {
        this.addAggregation(foo.aggType);
      }
    }
    if (this.grid.api.getDisplayedRowCount() === 0) {
      this.grid.api.showNoRowsOverlay();
    } else {
      this.grid.api.hideOverlay();
    }
  }

  private setUpAggRow(): void {
    if (!this.showAggRow) {
      return;
    }
    this.bottomRowData = [{}];
  }

  private addAggregation(aggType: Aggregation): void {
    this.appliedAggFuncs[aggType] = !this.appliedAggFuncs[aggType];
    if (!this.grid.columnDefs) {
      return;
    }

    const columnEntries = this.grid.columnDefs
      .map((columnDef) => {
        const column = (<ColDef>columnDef).field;
        if (!column) return null;
        const values: unknown[] = [];
        this.grid.api.forEachNodeAfterFilterAndSort((node) => {
          if (!node.group) {
            values.push((node.data as Record<string, unknown>)[column]);
          }
        });
        return { column, colDef: columnDef as ColDef, values };
      })
      .filter((entry): entry is { column: string; colDef: ColDef; values: unknown[] } => entry !== null);

    this.bottomRowData = this.aggregationService.toggleAggregation(aggType, this.bottomRowData, columnEntries);

    this.showAggRow = Object.keys(this.bottomRowData[0]).length > 0;
  }

  private setUpColumnTypes(): void {
    // Setting properties across ALL Columns
    this.defaultColDef = {
      checkboxSelection: (params) => {
        // If the row selection is disabled we do not want to show the redundant checkboxes
        if (!this.isSelectionEnabled) {
          return false;
        }
        const displayedColumns = params.columnApi.getAllDisplayedColumns();
        const condition = params.node.group || params.colDef?.colId === 'ag-Grid-AutoColumn';
        return displayedColumns[0] === params.column && !condition;
      },
      editable: false,
      //flex: 1, // [TODO] Stretch columns to fill the grid
      headerCheckboxSelection: (params) => {
        const displayedColumns = params.columnApi.getAllDisplayedColumns();
        const condition = displayedColumns[0].getColDef().colId === 'ag-Grid-AutoColumn';
        return displayedColumns[0] === params.column && !condition;
      },
      resizable: true,
      sortable: true,
      unSortIcon: true,
      enableRowGroup: true,
      enableValue: true,
      filter: true,
      cellRendererSelector: (params) => {
        if (params.colDef?.colId === 'ag-Grid-AutoColumn' && !params.value) {
          return { component: 'agGroupCellRenderer' };
        }
        if (params.node.group && params.colDef?.colId === 'ag-Grid-AutoColumn') {
          return { component: 'agGroupCellRenderer' };
        }
        if (params.node.rowPinned) {
          return {
            component: AggregationRowComponent,
            params: {
              ...params,
              autoHeight: true,
              columns: this.tableData().columns,
              bottomRowData: this.bottomRowData,
              dateFormat: this.dateFormat(),
            },
          };
        } else {
          const type = params.colDef?.cellDataType as keyof typeof Types;
          if (!customCellRendererMask.checkFlag(Types[type])) {
            return { component: undefined };
          }
          return {
            component: (params: ICellRendererParams & TableColumn) => {
              let value = '';
              let aggFunc;
              const group = params.node.group ?? false;
              value = params?.value ?? '';
              if (group) {
                aggFunc = params.column?.getAggFunc() as string;
              }
              const dateFormat = params['dateFormat'];
              const columnType =
                params['columns'].find((column: TableColumn) => column.field === params.column?.getColId())
                  ?.cellDataType ?? CellData.TEXT;

              if (value || !group) {
                switch (columnType) {
                  case 'boolean':
                    return renderBooleanTemplate(value, aggFunc ?? '');
                  case 'checkbox':
                    return renderCheckboxTemplate(value, aggFunc ?? '');
                  case 'date':
                    return renderDateTemplate(value, aggFunc ?? '', dateFormat);
                  case 'ordinalNumber':
                    return renderOrdinalNumberTemplate(value, aggFunc ?? '');
                  case 'status':
                    return renderStatusTemplate(value, aggFunc ?? '');
                  case 'progress':
                    return renderProgressTemplate(value, aggFunc ?? '');
                  default:
                    return renderDefaultTemplate(value);
                }
              } else {
                return '';
              }
            },
            params: {
              ...params,
              columns: this.tableData().columns,
              dateFormat: this.dateFormat(),
            },
          };
        }
      },
    };

    // Setting a set of column properties for a group types
    this.columnTypes = {
      integer: {
        headerClass: 'ag-right-aligned-header',
        cellClass: 'ag-right-aligned-cell',
      },
      number: {
        headerClass: 'ag-right-aligned-header',
        cellClass: 'ag-right-aligned-cell',
      },
      decimal: {
        headerClass: 'ag-right-aligned-header',
        cellClass: 'ag-right-aligned-cell',
      },
      string: {},
      boolean: {},
      date: {},
    };
  }

  private setUpPagination(): void {
    const pageSize = this.paginationPageSize();
    if (pageSize && this.rows?.length > pageSize) {
      this.paginationNumberFormatter = (params: PaginationNumberFormatterParams) => params.value.toString();
    }
  }

  private setUpRowHeight(): void {
    this.rowHeight = 30; // [TODO]
  }

  private setUpSideBar(): void {
    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressPivotMode: true,
            suppressValues: true,
          },
        },
      ],
    };
  }

  private setUpAutoSizing(): void {
    switch (this.columnsSizeStrategy()) {
      case 'fitCellContents':
        this.autoSizeStrategy = { type: 'fitCellContents' };
        break;
      case 'fitProvidedWidth':
        this.autoSizeStrategy = { type: 'fitProvidedWidth', width: 1000 };
        break;
      default:
        this.autoSizeStrategy = { type: 'fitGridWidth' };
    }
  }

  private readSelectedRowsAndEmitThem(): void {
    this.selectedRows = this.grid.api.getSelectedRows();
    this.selectedRowCount = this.selectedRows ? this.selectedRows.length : 0;
    this.prepareSelectionMessage();
    this.rowSelected.emit(this.selectedRows?.length ? this.selectedRows : []);
  }

  private prepareSelectionMessage(): void {
    const totalRowCount = this.rows?.length ?? 0;
    let rowCount = 0;
    if (this.grid) {
      rowCount = this.grid.api.getDisplayedRowCount();
      if (rowCount > totalRowCount) {
        rowCount = totalRowCount;
      }
    } else {
      rowCount = totalRowCount;
    }
    this.selectionMessage = `${rowCount} rows`;
  }

  private selectFirstRow(): void {
    if (this.grid) {
      const rowModel = this.grid.api.getModel();
      const firstRowNode = rowModel.getRow(0);
      if (firstRowNode && this.isSelectionEnabled()) {
        firstRowNode.setSelected(true);
      }
    }
  }

  private setVisibilityValuesSection(visible: boolean): void {
    const columnToolPanel = this.grid.api.getToolPanelInstance('columns');
    if (columnToolPanel) {
      columnToolPanel.setValuesSectionVisible(visible);
    }
  }
}
