import { Injectable } from '@angular/core';
import { ColDef } from 'ag-grid-community';

import { Aggregation } from './entities/aggregations';
import { numbersOnlyMask, Types } from './entities/types-bitmask';

export interface AggregationRows {
  colDef?: ColDef;
  values: unknown[];
}

export type AggregationValue = number | string;

export type BottomRowEntry = { aggFunction: Aggregation; value: AggregationValue };

export type BottomRowData = Record<string, BottomRowEntry>;

@Injectable()
export class TableAggregationService {
  firstAggregation(rows: AggregationRows): AggregationValue {
    return (rows.values[0] as AggregationValue) ?? '';
  }

  lastAggregation(rows: AggregationRows): AggregationValue {
    return (rows.values.at(-1) as AggregationValue) ?? '';
  }

  countAggregation(rows: AggregationRows): number {
    return rows.values.length;
  }

  countDistinctAggregation(rows: AggregationRows): number {
    return new Set(rows.values).size;
  }

  medianAggregation(rows: AggregationRows): AggregationValue {
    if (!rows.colDef || !this.isColTypeNumber(rows.colDef)) {
      return '';
    }
    const values = rows.values;
    if (!values || !Array.isArray(values)) {
      return '';
    }
    if (!values.every((item) => typeof item === 'number' && !isNaN(item))) {
      return '';
    }
    const nums = values as number[];
    const sortedRows = [...nums].sort((a, b) => a - b);
    const condition = !!(nums.length % 2) || isNaN(nums[0]);
    const index = Math.floor(nums.length / 2);
    return condition ? sortedRows[index] : (sortedRows[index] + sortedRows[index + 1]) / 2;
  }

  minAggregation(rows: AggregationRows): AggregationValue {
    const values = rows.values;
    if (
      !Array.isArray(values) ||
      !values.every((item) => (typeof item === 'number' && !isNaN(item)) || (item as Date)?.getTime)
    ) {
      return '';
    }
    return ([...values] as number[]).sort((a, b) => a - b)[0] ?? '';
  }

  maxAggregation(rows: AggregationRows): AggregationValue {
    const values = rows.values;
    if (
      !Array.isArray(values) ||
      !values.every((item) => (typeof item === 'number' && !isNaN(item)) || (item as Date)?.getTime)
    ) {
      return '';
    }
    return ([...values] as number[]).sort((a, b) => b - a)[0] ?? '';
  }

  sumAggregation(rows: AggregationRows): AggregationValue {
    if (!rows.colDef || !this.isColTypeNumber(rows.colDef)) {
      return '';
    }
    const values = rows.values;
    if (!values) {
      return '';
    }
    let sum = 0;
    for (const row of values) {
      if (isNaN(row as number) || (row as Date)?.getTime) {
        return '';
      }
      sum += row as number;
    }
    return sum;
  }

  averageAggregation(rows: AggregationRows): AggregationValue {
    if (!rows.colDef || !this.isColTypeNumber(rows.colDef)) {
      return '';
    }
    const values = rows.values;
    if (!values) {
      return '';
    }
    const sum = this.sumAggregation({ colDef: rows.colDef, values });
    if (isNaN(sum as number)) {
      return '';
    }
    return (sum as number) / values.length;
  }

  computeAggregationValue(aggType: Aggregation, rows: AggregationRows): AggregationValue {
    switch (aggType) {
      case Aggregation.SUM:
        return rows.colDef && numbersOnlyMask.checkFlag(Types[rows.colDef.type as keyof typeof Types])
          ? this.sumAggregation(rows)
          : '';
      case Aggregation.COUNT:
        return this.countAggregation(rows);
      case Aggregation.COUNT_DISTINCT:
        return this.countDistinctAggregation(rows);
      case Aggregation.AVERAGE:
        return this.averageAggregation(rows);
      case Aggregation.FIRST:
        return this.firstAggregation(rows);
      case Aggregation.LAST:
        return this.lastAggregation(rows);
      case Aggregation.MAX:
        return this.maxAggregation(rows);
      case Aggregation.MIN:
        return this.minAggregation(rows);
      case Aggregation.MEDIAN:
        return this.medianAggregation(rows);
      default:
        return '';
    }
  }

  isColTypeNumber(colDef: ColDef): boolean {
    const type = colDef.cellDataType as keyof typeof Types;
    return numbersOnlyMask.checkFlag(Types[type]);
  }

  /**
   * Toggles an aggregation type on/off across all bottom rows.
   * Returns the updated bottomRowData array (pure-ish: does not mutate the original).
   */
  toggleAggregation(
    aggType: Aggregation,
    currentBottomRowData: BottomRowData[],
    columnEntries: { column: string; colDef: ColDef; values: unknown[] }[],
  ): BottomRowData[] {
    let bottomRowData: BottomRowData[] = currentBottomRowData.map((row) => ({ ...row }));

    for (const { column, colDef, values } of columnEntries) {
      const index = bottomRowData.findIndex((row) => row[column]?.aggFunction === aggType);

      if (index >= 0) {
        // Remove this aggregation from the rows
        let idx = index;
        delete bottomRowData[idx][column];
        for (let i = idx + 1; i < bottomRowData.length; i++) {
          if (bottomRowData[i][column]) {
            bottomRowData[idx++][column] = bottomRowData[i][column];
          }
          delete bottomRowData[i][column];
        }
        bottomRowData = bottomRowData.filter((row) => Object.keys(row).length > 0);
        if (bottomRowData.length === 0) {
          bottomRowData = [{}];
        }
        continue;
      }

      const rows: AggregationRows = { colDef, values };
      const value = this.computeAggregationValue(aggType, rows);

      if (value === '') {
        continue;
      }

      const lastIndex = bottomRowData.length - 1;
      const entries = Object.entries(bottomRowData[lastIndex]);
      const entry: BottomRowEntry = { aggFunction: aggType, value };

      if (entries.length === 0 || entries.find(([, v]) => (v as BottomRowEntry)?.aggFunction === aggType)) {
        bottomRowData[lastIndex][column] = entry;
      } else {
        bottomRowData.push({ [column]: entry });
      }
    }

    return bottomRowData;
  }
}
