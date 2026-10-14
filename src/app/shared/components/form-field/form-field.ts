import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

/**
 * Interfaz para definir la estructura y comportamiento de cada control del formulario.
 */
export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'date' | 'tel';
  placeholder?: string;
  options?: { label: string; value: any }[];
  required?: boolean; // Define si el campo es obligatorio (true por defecto)
  /** Valor inicial del campo (se usa al construir el formulario). */
  value?: string | number;
  /** Campo deshabilitado: no editable y excluido de la validación. */
  disabled?: boolean;
  /** Campo de solo lectura: se ve normal pero no se puede editar. */
  readonly?: boolean;
  /** Aplica mayúsculas automáticas al escribir (true por defecto). */
  uppercase?: boolean;
}

@Component({
  selector: 'form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-field.html',
  styleUrls: ['./form-field.scss']
})
export class FormFieldComponent implements OnChanges {
  // Inputs de configuración del componente
  @Input() fields: FieldConfig[] = [];
  @Input() title: string = '';
  @Input() iconClass: string = '';
  @Input() submitLabel: string = 'Guardar Cambios';
  @Input() cancelLabel: string = 'Cancelar';

  // CORRECCIÓN: Inicializamos el FormGroup de forma segura sin usar 'this' antes de tiempo
  @Input() form: FormGroup = new FormGroup({});

  // Outputs para comunicación con el componente padre
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() formCancelled = new EventEmitter<void>();

  /** Estado de visibilidad de cada campo de contraseña (indexado por `key`). */
  private passwordVisibility: { [key: string]: boolean } = {};

  constructor(private fb: FormBuilder) {}

  /**
   * Hook de ciclo de vida: Reconstruye el FormGroup de manera dinámica
   * cada vez que el arreglo de campos cambie o se reciba.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] && this.fields.length > 0) {
      this.buildForm();
    }
  }

  /**
   * Genera dinámicamente los controles del formulario, respetando el valor
   * inicial y el estado (deshabilitado) de cada campo, y aplicando las
   * restricciones de vacío obligatorias por defecto.
   */
  private buildForm(): void {
    const group: { [key: string]: any } = {};

    this.fields.forEach(field => {
      // Restricción explícita: Por defecto es requerido a menos que se indique lo contrario
      const isRequired = field.required !== false;
      group[field.key] = [
        { value: field.value ?? '', disabled: field.disabled === true },
        isRequired ? [Validators.required] : []
      ];
    });

    this.form = this.fb.group(group);
  }

  /**
   * Transforma el texto ingresado a mayúsculas en tiempo real (salvo que el
   * campo lo desactive con `uppercase: false`) sin disparar eventos innecesarios.
   */
  onInputUppercase(event: Event, field: FieldConfig): void {
    if (field.uppercase === false) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();
    const control = this.form.get(field.key);

    if (control) {
      control.setValue(upperValue, { emitEvent: false });
    }
  }

  /** Tipo efectivo del input (permite alternar la visibilidad de la contraseña). */
  inputType(field: FieldConfig): string {
    return field.type === 'password' && this.isPasswordVisible(field.key) ? 'text' : field.type;
  }

  /** Indica si la contraseña del campo está visible. */
  isPasswordVisible(key: string): boolean {
    return this.passwordVisibility[key] === true;
  }

  /** Alterna mostrar/ocultar la contraseña del campo. */
  togglePassword(key: string): void {
    this.passwordVisibility[key] = !this.isPasswordVisible(key);
  }

  /**
   * Manejador del submit: Valida el estado general y emite el payload
   * o marca los campos como tocados para mostrar errores visuales.
   */
  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  /**
   * Emite el evento de cancelación hacia el componente padre.
   */
  onCancel(): void {
    this.formCancelled.emit();
  }
}
