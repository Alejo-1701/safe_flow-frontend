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
  imports: [CommonModule, CellTemplateDirective],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.scss']
})
export class DataTableComponent<T> {
  @Input({ required: true }) columns: ColumnDefinition[] = [];
  @Input({ required: true }) data: T[] = [];

  @ContentChildren(CellTemplateDirective) cellTemplates!: QueryList<CellTemplateDirective>;

  getCellTemplate(key: string): TemplateRef<any> | null {
    // This is a simplified lookup; in a real project you'd match by column key
    return this.cellTemplates?.find(t => true)?.template || null;
  }
}
