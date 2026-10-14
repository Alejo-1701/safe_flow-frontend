import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // El template llama estos métodos directamente. El spec anterior redeclaraba una
  // copia del componente sin ellos, así que la suite compilaba contra un stub y
  // nunca ejercitaba el componente real.
  it('alterna la visibilidad de una contraseña', () => {
    expect(component.isPasswordVisible('pwd')).toBe(false);

    component.togglePassword('pwd');

    expect(component.isPasswordVisible('pwd')).toBe(true);
    expect(component.inputType({ key: 'pwd', label: 'Clave', type: 'password' })).toBe('text');
  });

  it('no altera la visibilidad de campos que no son contraseña', () => {
    expect(component.inputType({ key: 'email', label: 'Email', type: 'email' })).toBe('email');
  });
});