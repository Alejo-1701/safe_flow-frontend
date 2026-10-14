import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaSolicitudComponent } from './nueva-solicitud';

describe('NuevaSolicitudComponent', () => {
  let component: NuevaSolicitudComponent;
  let fixture: ComponentFixture<NuevaSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaSolicitudComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaSolicitudComponent);
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
    expect(compiled.querySelector('.solicitud-modal')).toBeNull();
  });

  it('renderiza el modal con su encabezado y banner cuando open es true', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.solicitud-modal')).toBeTruthy();
    expect(compiled.textContent).toContain('Nueva Solicitud de Residente');
    expect(compiled.textContent).toContain('Política de Asignación FIFO');
  });

  it('expone los cuatro campos del formulario', () => {
    expect(component.campos.map(c => c.key)).toEqual([
      'placa',
      'marcaModelo',
      'tipoVehiculo',
      'fechaInicio'
    ]);
  });

  it('exige los cuatro campos', () => {
    expect(component.campos.every(c => c.required === true)).toBe(true);
  });

  it('trae opciones el selector de tipo de vehículo', () => {
    const tipo = component.campos.find(c => c.key === 'tipoVehiculo');

    expect(tipo?.options?.length).toBeGreaterThan(0);
  });

  // El componente es presentacional: recibe `open` y emite intenciones.
  // No decide nada por su cuenta.
  it('emite cerrado al cancelar', () => {
    let emitido = false;
    component.cerrado.subscribe(() => (emitido = true));

    component.onCancel();

    expect(emitido).toBe(true);
  });

  it('reemite el payload al enviar la solicitud', () => {
    let payload: Record<string, unknown> | null = null;
    component.enviada.subscribe(p => (payload = p));

    const datos = { placa: 'ABC-123' };
    component.onSubmit(datos);

    expect(payload).toEqual(datos);
  });
});