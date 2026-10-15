import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Perfil } from './perfil';

describe('Perfil', () => {
  let component: Perfil;
  let fixture: ComponentFixture<Perfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Perfil],
      // app-sidebar usa routerLink en su template; sin esto, NG0201.
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Perfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // El diálogo solo se monta cuando showSavedModal está activo.
  it('no muestra el diálogo de confirmación al entrar', async () => {
    component.showSavedModal.set(false);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-modal')).toBeNull();
  });

  it('abre el diálogo al guardar los datos del residente', async () => {
    component.showSavedModal.set(false);
    await fixture.whenStable();

    component.onSaveResident({ email: 'a@b.com' });
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-modal')).toBeTruthy();
  });

  it('abre el diálogo al guardar la contraseña', async () => {
    component.showSavedModal.set(false);
    await fixture.whenStable();

    component.onSavePassword({ newPassword: 'x' });
    await fixture.whenStable();

    expect(component.showSavedModal()).toBe(true);
  });

  it('expone el título y el mensaje que pide el diseño', () => {
    expect(component.savedModalTitle).toBe('¡Datos Actualizados!');
    expect(component.savedModalMessage).toBe(
      'Tu información personal ha sido actualizada correctamente en el sistema.'
    );
  });

  it('renderiza el título y el mensaje dentro del diálogo', async () => {
    component.showSavedModal.set(true);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('¡Datos Actualizados!');
    expect(compiled.textContent).toContain(
      'Tu información personal ha sido actualizada correctamente en el sistema.'
    );
  });

  it('usa el estado success para el círculo verde de confirmación', async () => {
    component.showSavedModal.set(true);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.icon-container.success')).toBeTruthy();
    expect(compiled.textContent).toContain('✓');
  });

  it('cierra el diálogo al pulsar Continuar', async () => {
    component.showSavedModal.set(true);
    await fixture.whenStable();

    component.onCloseSavedModal();
    await fixture.whenStable();

    expect(component.showSavedModal()).toBe(false);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-modal')).toBeNull();
  });
});