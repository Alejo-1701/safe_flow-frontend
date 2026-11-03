import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';

import { Login, LoginUserType } from './login';
import { VerificationCodeService } from '../../../../shared/services/verification-code.service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  /**
   * Crea el login fijando el tipo de usuario ANTES de montar la vista.
   *
   * `NgModel` reescribe el `<select>` en cada `whenStable`, así que asignar
   * `userType` con el selector ya renderizado no persiste. La forma fiable de
   * montar un rol concreto es el `@Input() initialUserType`.
   */
  const montarConTipo = async (tipo: LoginUserType): Promise<HTMLElement> => {
    fixture.componentRef.setInput('initialUserType', tipo);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, FormsModule],
      // El template usa routerLink; sin esto NG0201: No provider found for `ActivatedRoute`.
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial empty credentials and rememberMe set to false', () => {
    expect(component.credentials.identifier).toBe('');
    expect(component.credentials.password).toBe('');
    expect(component.credentials.rememberMe).toBe(false);
  });

  it('should toggle password visibility state', () => {
    expect(component.showPassword).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(false);
  });

  it('should render form elements (identifier, password inputs and submit button)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const identifierInput = compiled.querySelector('#identifier');
    const passwordInput = compiled.querySelector('#password');
    // El submit es <app-button type="submit">, no un <button class="btn-submit"> nativo.
    const submitButton = compiled.querySelector('app-button[type="submit"]');

    expect(identifierInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it('abre en residente por defecto', () => {
    expect(component.userType).toBe('residente');
    expect(component.isResidente).toBe(true);
  });

  it('ofrece los cuatro tipos de usuario', () => {
    expect(component.userTypes.map((tipo) => tipo.value)).toEqual([
      'residente',
      'guardia',
      'admin',
      'propietario'
    ]);
  });

  it('renderiza el selector con una opción por tipo de usuario', () => {
    const opciones = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLOptionElement>('#userType option')
    );

    // Con [ngValue] Angular escribe "índice: valor" en el atributo, así que se
    // comprueba el número de opciones y su etiqueta visible, no `option.value`.
    expect(opciones).toHaveLength(4);
    expect(opciones.map((opcion) => opcion.textContent?.trim())).toEqual([
      'Residente',
      'Guardia',
      'Administrador',
      'Propietario'
    ]);
  });

  it('permite fijar el tipo de usuario con el que abre el formulario', async () => {
    const compiled = await montarConTipo('guardia');

    expect(component.userType).toBe('guardia');
    expect(compiled.querySelector<HTMLSelectElement>('#userType')?.value).toBe('1: guardia');
  });

  // Requisito: el código solo lo puede ver el residente.
  it('muestra el código de verificación al residente', async () => {
    const code = TestBed.inject(VerificationCodeService).code();
    const compiled = await montarConTipo('residente');

    expect(compiled.querySelector('app-verification-code')).toBeTruthy();
    expect(compiled.textContent).toContain(code);
  });

  it('oculta el código a todos los usuarios que no son residentes', async () => {
    for (const tipo of ['guardia', 'admin', 'propietario'] as LoginUserType[]) {
      const compiled = await montarConTipo(tipo);

      expect(compiled.querySelector('app-verification-code')).toBeNull();
      expect(compiled.querySelector('.code-value')).toBeNull();
    }
  });

  it('limpia el error de validación al cambiar de tipo de usuario', () => {
    component.errorMessage = 'Ingresa tu contraseña.';

    component.onUserTypeChange('guardia');

    expect(component.errorMessage).toBe('');
  });
});
