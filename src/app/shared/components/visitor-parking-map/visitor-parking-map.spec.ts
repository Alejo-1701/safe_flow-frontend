import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorParkingMapComponent } from './visitor-parking-map';

describe('VisitorParkingMapComponent', () => {
  let component: VisitorParkingMapComponent;
  let fixture: ComponentFixture<VisitorParkingMapComponent>;

  /** Ids de celda que renderiza cada grilla, en orden de aparición. */
  const idsPorGrilla = (): string[][] => {
    const compiled = fixture.nativeElement as HTMLElement;
    return Array.from(compiled.querySelectorAll<HTMLElement>('.visitor-grid')).map((grid) =>
      Array.from(grid.querySelectorAll<HTMLElement>('.slot-id')).map((id) => id.textContent?.trim() ?? '')
    );
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorParkingMapComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VisitorParkingMapComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // El filtro por zona no puede depender de `[hidden]` sobre una celda con
  // `display: flex`: cualquier `display` distinto de `none` anula el atributo.
  it('la grilla de carros solo contiene espacios de carro', () => {
    expect(idsPorGrilla()[0]).toEqual(['V-C01', 'V-C02', 'V-C03', 'V-C04', 'V-C05']);
  });

  it('la grilla de motos solo contiene espacios de moto', () => {
    expect(idsPorGrilla()[1]).toEqual(['V-M01', 'V-M02', 'V-M03', 'V-M04', 'V-M05', 'V-M06']);
  });

  it('no renderiza celdas fuera de su zona', () => {
    const [carros, motos] = idsPorGrilla();
    const total = carros.length + motos.length;

    // 5 carros + 6 motos: ni una celda duplicada entre grillas.
    expect(total).toBe(11);
    expect(new Set([...carros, ...motos]).size).toBe(total);
  });
});
