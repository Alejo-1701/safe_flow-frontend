import { Component, Input, ContentChildren, QueryList, Directive, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ColumnDefinition {
  key: string;
  label: string;
}

@Directive({
  selector: '[appCellTemplate]',
  standalone: true
})
export class CellTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.scss']
})
export class DataTableComponent<T extends Record<string, any>> {
  @Input({ required: true }) columns: ColumnDefinition[] = [];
  @Input({ required: true }) data: T[] = [];

  // Re-added locally just in case needed by template, 
  // but if it's unused, consider removing from HTML too.
  @ContentChildren(CellTemplateDirective) cellTemplates!: QueryList<CellTemplateDirective>;

  getCellTemplate(key: string): TemplateRef<any> | null {
    return this.cellTemplates?.find(t => true)?.template || null;
  }
}
