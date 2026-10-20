import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPerfilComponent } from './modal-perfil';

describe('ModalPerfilComponent', () => {
  let component: ModalPerfilComponent;
  let fixture: ComponentFixture<ModalPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPerfilComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPerfilComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // El modal es condicional: con open=false no debe renderizar nada.
  it('no renderiza nada mientras open es false', async () => {
    fixture.componentRef.setInput('open', false);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.perfil-modal')).toBeNull();
  });

  // Con open=true se monta el contenido íntegro de la antigua vista.
  it('renderiza el encabezado y las tarjetas de la vista', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.perfil-modal')).toBeTruthy();
    expect(compiled.textContent).toContain('Editar Información Personal');
    expect(compiled.textContent).toContain('Datos del Residente');
    expect(compiled.textContent).toContain('Cambiar Contraseña');
    expect(compiled.textContent).toContain('Información de Seguridad');
  });

  it('se declara como diálogo accesible', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();

    const panel = (fixture.nativeElement as HTMLElement).querySelector('.perfil-modal');
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-modal')).toBe('true');
  });

  it('emite cerrado al pulsar Cancelar', () => {
    let emitido = false;
    component.cerrado.subscribe(() => (emitido = true));

    component.onCancel();

    expect(emitido).toBe(true);
  });

  // El diálogo solo se monta cuando showSavedModal está activo.
  it('no muestra el diálogo de confirmación al entrar', async () => {
    fixture.componentRef.setInput('open', true);
    component.showSavedModal.set(false);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-modal')).toBeNull();
  });

  it('abre el diálogo de confirmación al guardar los datos del residente', async () => {
    fixture.componentRef.setInput('open', true);
    component.showSavedModal.set(false);
    await fixture.whenStable();

    component.onSaveResident({ email: 'residente@dominio.com' });
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-modal')).toBeTruthy();
  });

  it('abre el diálogo de confirmación al guardar la contraseña', async () => {
    fixture.componentRef.setInput('open', true);
    component.showSavedModal.set(false);
    await fixture.whenStable();

    component.onSavePassword({ currentPassword: 'x', newPassword: 'y' });
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-modal')).toBeTruthy();
  });

  it('expone el título y el mensaje que pide el diseño', () => {
    expect(component.savedModalTitle).toBe('¡Datos Actualizados!');
    expect(component.savedModalMessage).toContain('actualizada correctamente');
  });

  it('renderiza título y mensaje dentro del diálogo', async () => {
    fixture.componentRef.setInput('open', true);
    component.showSavedModal.set(true);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const modal = compiled.querySelector('app-modal');
    expect(modal?.textContent).toContain('¡Datos Actualizados!');
    expect(modal?.textContent).toContain('actualizada correctamente');
  });

  it('usa el estado success del diálogo', async () => {
    fixture.componentRef.setInput('open', true);
    component.showSavedModal.set(true);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const icono = compiled.querySelector('app-modal .icon-container');
    expect(icono?.classList).toContain('success');
  });

  it('cierra el diálogo al pulsar Continuar', async () => {
    fixture.componentRef.setInput('open', true);
    component.showSavedModal.set(true);
    await fixture.whenStable();

    component.onCloseSavedModal();
    await fixture.whenStable();

    expect(component.showSavedModal()).toBe(false);
    expect((fixture.nativeElement as HTMLElement).querySelector('app-modal')).toBeNull();
  });
});
