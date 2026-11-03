import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { VisitorMapModalComponent } from './visitor-map-modal';
import { VisitorParkingMapComponent } from '../../../../shared/components/visitor-parking-map/visitor-parking-map';

describe('VisitorMapModalComponent', () => {
  let component: VisitorMapModalComponent;
  let fixture: ComponentFixture<VisitorMapModalComponent>;

  /** Aplica el estado de apertura y espera el render. */
  const render = async (open: boolean): Promise<HTMLElement> => {
    fixture.componentRef.setInput('open', open);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorMapModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VisitorMapModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('no renderiza nada mientras open es false', async () => {
    const compiled = await render(false);

    expect(compiled.querySelector('.map-modal')).toBeNull();
    expect(compiled.querySelector('app-visitor-parking-map')).toBeNull();
  });

  it('muestra el mapa en modo residente (solo lectura)', async () => {
    const compiled = await render(true);

    expect(compiled.querySelector('.map-modal')).toBeTruthy();

    const map = fixture.debugElement.query(By.directive(VisitorParkingMapComponent));
    expect(map.componentInstance.mode).toBe('residente');
  });

  it('las celdas del mapa no son interactivas', async () => {
    const compiled = await render(true);
    const cells = compiled.querySelectorAll<HTMLElement>('.visitor-cell');

    expect(cells.length).toBeGreaterThan(0);
    cells.forEach((cell) => expect(cell.classList.contains('clickable')).toBe(false));
  });

  it('un click en una celda no abre el registro de ingreso', async () => {
    const compiled = await render(true);
    const cell = compiled.querySelector<HTMLElement>('.visitor-cell');

    cell?.click();
    await fixture.whenStable();

    // El modal interno de registro del guardia nunca debe montarse aquí.
    expect(compiled.querySelector('.modal-backdrop')).toBeNull();
  });

  it('se declara como diálogo accesible', async () => {
    const compiled = await render(true);
    const panel = compiled.querySelector('.map-modal');

    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-modal')).toBe('true');
    expect(panel?.getAttribute('aria-labelledby')).toBe('map-modal-title');
  });

  it('emite cerrado al pulsar el botón de cerrar', async () => {
    let emitido = false;
    component.cerrado.subscribe(() => (emitido = true));
    const compiled = await render(true);

    compiled.querySelector<HTMLElement>('.modal-close')?.click();

    expect(emitido).toBe(true);
  });
  it('emite cerrado al hacer click en el fondo', async () => {
    let emitido = false;
    component.cerrado.subscribe(() => (emitido = true));
    const compiled = await render(true);

    compiled.querySelector<HTMLElement>('.map-backdrop')?.click();

    expect(emitido).toBe(true);
  });
});
