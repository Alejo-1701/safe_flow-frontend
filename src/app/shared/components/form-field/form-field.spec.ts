import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'date' | 'tel';
  placeholder?: string;
  options?: { label: string; value: any }[];
}

@Component({
  selector: 'form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-field.html',
  styleUrls: ['./form-field.scss']
})
export class FormFieldComponent {
  @Input() form!: FormGroup;
  @Input() fields: FieldConfig[] = [];
  @Input() title: string = '';
  @Input() iconClass: string = '';
  @Input() submitLabel: string = 'Guardar Cambios';
  @Input() cancelLabel: string = 'Cancelar';

  @Output() formSubmitted = new EventEmitter<any>();
  @Output() formCancelled = new EventEmitter<void>();

  onSubmit() {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.formCancelled.emit();
  }
}
