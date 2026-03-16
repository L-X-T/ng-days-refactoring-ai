import 'ag-grid-enterprise';
import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  input,
  model,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ColDef,
  FirstDataRenderedEvent,
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

import { TableColumn } from './entities/table-column';
import { TableColumnTranslations } from './entities/table-column-translations';
import { TableData } from './entities/table-data';
import { TableRow } from './entities/table-row';
import { Toolbar } from './entities/toolbar';
import { ToolbarAction } from './entities/toolbar-action';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { PageSelectorComponent } from './page-selector/page-selector.component';
import { CellData } from './entities/cell-data-type';
import {
  renderBooleanTemplate,
  renderCheckboxTemplate,
  renderDateTemplate,
  renderDefaultTemplate,
  renderOrdinalNumberTemplate,
  renderProgressTemplate,
  renderStatusTemplate,
} from './cell-renderer/renderer-templates';
import { customCellRendererMask, Types } from './entities/types-bitmask';
import { left } from '@popperjs/core';

@Component({
  selector: 'lxt-table',
  imports: [AgGridAngular, FormsModule, ReactiveFormsModule, ToolbarComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class TableComponent {
  // Inputs
  readonly tableData = input<TableData>();
  readonly toolbar = input<Toolbar>();
  readonly editRoute = input('');
  readonly rowId = input('id');
  readonly rowHeight = model(0);
  readonly allowMultiSelection = input<boolean | undefined>(undefined);
  readonly isLoading = input(false);
  readonly componentDefaultColumns = input<TableColumn[]>([]);
  readonly columnTranslations = input<TableColumnTranslations>();
  readonly paginationPageSize = input<number | undefined>(20);
  readonly isSelectionEnabled = model(true);
  readonly columnsSizeStrategy = input<'fitGridWidth' | 'fitCellContents' | 'fitProvidedWidth'>('fitProvidedWidth');
  readonly rowGroupPanelShow = input<'always' | 'onlyWhenGrouping' | 'never' | undefined>('onlyWhenGrouping');
  readonly dateFormat = input('yyyy-MM-dd');
  readonly allowRowGrouping = input(true);
  readonly pagination = input(true);
  readonly primaryKeyColumns = input<string[]>([]);

  // Outputs
  readonly actionExecuted = output<ToolbarAction>();
  readonly rowSelected = output<TableRow[]>();

  // View queries
  readonly grid = viewChild.required<AgGridAngular>('myGrid');
  readonly gridRef = viewChild.required('myGrid', { read: ElementRef });

  // Computed state derived from inputs
  readonly columns = computed<TableColumn[]>(() => {
    const tableData = this.tableData();
    const translations = this.columnTranslations();
    const defaultColumns = this.componentDefaultColumns();

    if (tableData?.columns?.length) {
      return tableData.columns
        .filter((col) => col.isVisible)
        .map((col) => ({
          ...col,
          headerName: translations?.[col.localizerKey ?? ''] ?? col.field,
          cellStyle: col.cellDataType === 'number' ? { textAlign: 'right' } : {},
        }));
    }

    return defaultColumns;
  });

  readonly rows = computed<TableRow[]>(() => {
    const tableData = this.tableData();
    return tableData?.rows?.length ? [...tableData.rows] : [];
  });

  // Mutable signals (grid-driven state)
  readonly selectedRows = signal<TableRow[]>([]);
  readonly selectedRowCount = signal(0);
  readonly selectionMessage = signal('');

  // Grid configuration (initialised once)
  columnTypes!: { [key: string]: ColDef };
  defaultColDef!: ColDef;
  paginationAutoPageSize = false; // [TODO] set true for mobile
  paginationNumberFormatter!: (params: PaginationNumberFormatterParams<any, any>) => string;
  sideBar!: SideBarDef | string | string[] | boolean | null;
  gridOptions!: GridOptions;
  autoSizeStrategy!:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy;

  overlayLoadingTemplate =
    '<object style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%) scale(2)" type="image/svg+xml" data="https://ag-grid.com/images/ag-grid-loading-spinner.svg" aria-label="loading"></object>';
  overlayNoRowsTemplate = '<span>No rows to show</span>';

  getRowId: GetRowIdFunc<any> = (params) => {
    let rowId = '';
    this.primaryKeyColumns().forEach((column) => {
      if (rowId !== '') {
        rowId += '-';
      }
      rowId += params.data[column];
    });
    return rowId;
  };

  private isAutoSized = false;

  constructor() {
    // Initialise grid configuration once (replaces ngOnInit)
    this.setUpGridOptions();
    this.setUpColumnTypes();
    this.setUpRowHeight();
    this.setUpSideBar();
    this.setUpAutoSizing();

    // Set up intersection observer after the view is rendered (replaces ngAfterViewInit)
    afterNextRender(() => {
      this.setUpOnIntersection();
    });

    // Side-effect: sync loading overlay and selection with grid API
    effect(() => {
      const loading = this.isLoading();
      const selectionEnabled = this.isSelectionEnabled();
      const grid = this.grid();

      if (grid?.api) {
        if (loading) {
          grid.api.showLoadingOverlay();
        } else {
          grid.api.hideOverlay();
        }
        grid.api.updateGridOptions({ suppressRowClickSelection: !selectionEnabled });
        this.refreshGrid();
      }
    });

    // Side-effect: refresh cell rendering when the date format changes
    effect(() => {
      this.dateFormat(); // track
      if (this.grid()?.api) {
        this.refreshGrid();
      }
    });
  }

  @HostListener('keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    const activeElement = (event as any).explicitOriginalTarget;
    if (activeElement?.tagName === 'INPUT' || !event.shiftKey) {
      return;
    }

    switch (event.key) {
      case 'Home':
        this.grid().api.paginationGoToFirstPage();
        break;
      case 'End':
        this.grid().api.paginationGoToLastPage();
        break;
      case 'ArrowLeft':
        this.grid().api.paginationGoToPreviousPage();
        break;
      case 'ArrowRight':
        this.grid().api.paginationGoToNextPage();
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  private setUpOnIntersection() {
    const options: IntersectionObserverInit = {
      root: document.documentElement,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!this.isAutoSized && entry.intersectionRatio > 0) {
          this.grid().api.autoSizeAllColumns();
          this.isAutoSized = true;
          observer.disconnect();
          return;
        }
      });
    }, options);

    observer.observe(this.gridRef().nativeElement);
  }

  private getMainMenuItems = (params: any) => {
    let items = params.defaultItems;
    if (!this.allowRowGrouping()) {
      items = items.filter((item: any) => item !== 'rowGroup');
    }
    return items;
  };

  private getContextMenuItems = (_params: any) => {
    return this.getRowContextMenu();
  };

  private getRowContextMenu(): (string | MenuItemDef)[] {
    const result: (string | MenuItemDef)[] = [];
    const toolbar = this.toolbar();
    if (toolbar?.actions) {
      for (const action of toolbar.actions) {
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
    result.push({
      name: 'Clear all settings',
      action: () => {},
    });
    result.push({
      name: 'Send message',
      action: () => {},
    });
    result.push('separator');
    result.push({
      name: 'Reload',
      action: () => {},
    });
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

  onCellContextMenu = () => {
    setTimeout(() => {
      const menu = this.gridRef().nativeElement.querySelector('.ag-menu') as HTMLElement;
      if (!menu) {
        return;
      }
      const menuRect = menu.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (menuRect.bottom > viewportHeight) {
        const gridElement = this.gridRef().nativeElement;
        const gridHeight = gridElement.offsetHeight - (gridElement.getBoundingClientRect().bottom - viewportHeight);
        const top = Math.floor(Math.max(0, gridHeight - (menuRect.height + 16)));
        menu.style.top = `${top}px`;
      }
    }, 0);
  };

  protected reload(): void {
    if (this.grid().api.getDisplayedRowCount() === 0) {
      this.grid().api.showNoRowsOverlay();
    } else {
      this.grid().api.hideOverlay();
    }
  }

  private setUpColumnTypes(): void {
    // Setting properties across ALL Columns
    this.defaultColDef = {
      checkboxSelection: (params) => {
        // If the row selection is disabled we do not want to show the redundant checkboxes
        if (!this.isSelectionEnabled()) {
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
          return {
            component: 'agGroupCellRenderer',
          };
        }
        if (params.node.group && params.colDef?.colId === 'ag-Grid-AutoColumn') {
          return {
            component: 'agGroupCellRenderer',
          };
        }
        const type = params.colDef?.cellDataType as keyof typeof Types;
        if (!customCellRendererMask.checkFlag(Types[type])) {
          return {
            component: undefined,
          };
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
            columns: this.tableData()?.columns,
            dateFormat: this.dateFormat(),
          },
        };
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

  private setUpRowHeight(): void {
    this.rowHeight.set(30); // [TODO]
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
        this.autoSizeStrategy = {
          type: 'fitCellContents',
        };
        break;
      case 'fitProvidedWidth':
        this.autoSizeStrategy = {
          type: 'fitProvidedWidth',
          width: 1000,
        };
        break;
      default:
        this.autoSizeStrategy = {
          type: 'fitGridWidth',
        };
    }
  }

  onSelectionChanged(): void {
    this.readSelectedRowsAndEmitThem();
  }

  private readSelectedRowsAndEmitThem(): void {
    const selected = this.grid().api.getSelectedRows();
    this.selectedRows.set(selected);
    this.selectedRowCount.set(selected ? selected.length : 0);
    this.prepareSelectionMessage();
    this.rowSelected.emit(selected?.length ? selected : []);
  }

  private prepareSelectionMessage(): void {
    const totalRowCount = this.rows()?.length ?? 0;
    let rowCount = this.grid().api.getDisplayedRowCount();
    if (rowCount > totalRowCount) {
      rowCount = totalRowCount;
    }
    this.selectionMessage.set(`${rowCount} rows`);
  }

  onFirstDataRendered(_params: FirstDataRenderedEvent): void {
    this.selectFirstRow();
  }

  private selectFirstRow(): void {
    const rowModel = this.grid().api.getModel();
    const firstRowNode = rowModel.getRow(0);
    if (firstRowNode && this.isSelectionEnabled()) {
      firstRowNode.setSelected(true);
    }
  }

  onSearch(searchTerm: string): void {
    this.grid().api.setQuickFilter(searchTerm);
    this.prepareSelectionMessage();
  }

  onColumnChanged() {
    this.reload();
  }

  onColumnGroupChanged(): void {
    const columns = this.grid().api.getColumns();
    const isColumnGrouped = columns?.some((column) => column['rowGroupActive']) ?? false;
    this.setVisibilityValuesSection(isColumnGrouped);
  }

  refreshGrid() {
    this.grid().api.redrawRows();
    this.reload();
  }

  private setVisibilityValuesSection(visible: boolean): void {
    const columnToolPanel = this.grid().api.getToolPanelInstance('columns');
    if (columnToolPanel) {
      columnToolPanel.setValuesSectionVisible(visible);
    }
  }

  onRowDataUpdated(): void {
    this.readSelectedRowsAndEmitThem();
  }
}
