import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationCodeComponent } from './verification-code';
import { VerificationCodeService } from '@shared/services/verification-code.service';

describe('VerificationCodeComponent', () => {
  let fixture: ComponentFixture<VerificationCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationCodeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VerificationCodeComponent);
    await fixture.whenStable();
  });

  const compiled = (): HTMLElement => fixture.nativeElement as HTMLElement;

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra el código vigente', () => {
    const code = TestBed.inject(VerificationCodeService).code();

    expect(compiled().querySelector('.code-value')?.textContent).toContain(code);
  });

  it('expone un único botón: el de copiar', () => {
    const botones = Array.from(compiled().querySelectorAll('button'));

    expect(botones).toHaveLength(1);
    expect(botones[0].classList.contains('code-copy')).toBe(true);
  });

  // El código solo rota por tiempo: no debe existir control para regenerarlo.
  it('no ofrece ningún control para regenerar el código', () => {
    const etiquetas = Array.from(compiled().querySelectorAll('button'))
      .map((boton) => (boton.textContent ?? '').toLowerCase())
      .join(' ');

    expect(etiquetas).not.toContain('actualizar');
    expect(etiquetas).not.toContain('refrescar');
    expect(etiquetas).not.toContain('generar');
  });

  it('muestra el tiempo restante por defecto', () => {
    expect(compiled().querySelector('.code-timer')?.textContent).toMatch(/^\d+:\d{2}$/);
  });

  it('oculta el tiempo cuando showCountdown es false', async () => {
    fixture.componentRef.setInput('showCountdown', false);
    await fixture.whenStable();

    expect(compiled().querySelector('.code-timer')).toBeNull();
  });

  it('muestra el título y la aclaración recibidos', async () => {
    fixture.componentRef.setInput('heading', 'Tu código de verificación');
    fixture.componentRef.setInput('note', 'Díctale este código a tu visitante.');
    await fixture.whenStable();

    expect(compiled().querySelector('.code-heading')?.textContent)
      .toContain('Tu código de verificación');
    expect(compiled().querySelector('.code-note')?.textContent)
      .toContain('Díctale este código a tu visitante.');
  });

  it('omite el título y la aclaración cuando no se pasan', () => {
    expect(compiled().querySelector('.code-heading')).toBeNull();
    expect(compiled().querySelector('.code-note')).toBeNull();
  });
});
