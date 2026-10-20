import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleExitBannerComponent } from './vehicle-exit-banner';

describe('VehicleExitBannerComponent', () => {
  let component: VehicleExitBannerComponent;
  let fixture: ComponentFixture<VehicleExitBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleExitBannerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleExitBannerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('muestra el aviso y la acción con los textos exactos', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(
      'Notifique a la portería antes de retirarse con el automóvil.'
    );
    expect(compiled.textContent).toContain('Dar Salida de mi Vehículo');
  });

  it('usa el icono informativo del sistema de iconos', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icono = compiled.querySelector('.notice-icon');

    expect(icono?.textContent?.trim()).toBe('info');
    expect(icono?.classList).toContain('material-symbols-outlined');
    expect(icono?.getAttribute('aria-hidden')).toBe('true');
  });

  it('se anuncia como nota informativa', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.vehicle-exit-banner')?.getAttribute('role')).toBe('note');
  });

  it('emite exitRequested al pulsar el botón', () => {
    let emitido = false;
    component.exitRequested.subscribe(() => (emitido = true));

    const boton = fixture.nativeElement.querySelector('app-button .btn') as HTMLButtonElement;
    boton.click();

    expect(emitido).toBe(true);
  });
});
