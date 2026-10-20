import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegistroVehiculoComponent } from './modal-registro-vehiculo';

describe('ModalRegistroVehiculoComponent', () => {
  let component: ModalRegistroVehiculoComponent;
  let fixture: ComponentFixture<ModalRegistroVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRegistroVehiculoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRegistroVehiculoComponent);
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
    expect(compiled.querySelector('.registro-modal')).toBeNull();
  });

  // Con open=true se monta el contenido íntegro de la antigua vista.
  it('renderiza el encabezado y la tarjeta del formulario', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.registro-modal')).toBeTruthy();
    expect(compiled.textContent).toContain('Registrar Nuevo Vehículo');
    expect(compiled.textContent).toContain('Información del Vehículo');
    expect(compiled.textContent).toContain('REGISTRAR VEHÍCULO');
  });

  it('se declara como diálogo accesible', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();

    const panel = (fixture.nativeElement as HTMLElement).querySelector('.registro-modal');
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-modal')).toBe('true');
  });

  it('expone los cinco campos en el orden del diseño', () => {
    expect(component.vehicleFields.map((campo) => campo.key)).toEqual([
      'plate',
      'type',
      'brand',
      'model',
      'color'
    ]);
  });

  it('trae "Carro" como tipo de vehículo por defecto', () => {
    const tipo = component.vehicleFields.find((campo) => campo.key === 'type');
    expect(tipo?.value).toBe('Carro');
  });

  it('emite cerrado al pulsar Cancelar', () => {
    let emitido = false;
    component.cerrado.subscribe(() => (emitido = true));

    component.onCancel();

    expect(emitido).toBe(true);
  });

  it('actualiza la vista previa al escribir un color válido', () => {
    component.onFormInput({ target: { id: 'color', value: 'red' } } as unknown as Event);

    expect(component.colorPreview()).toBe('red');
  });

  it('ignora valores que no son colores CSS seguros', () => {
    component.onFormInput({ target: { id: 'color', value: 'url(x)' } } as unknown as Event);

    expect(component.colorPreview()).toBe('');
  });

  it('ignora los campos que no son el color', () => {
    component.colorPreview.set('red');

    component.onFormInput({ target: { id: 'brand', value: 'Tesla' } } as unknown as Event);

    expect(component.colorPreview()).toBe('red');
  });
});
