import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAccessComponent, QuickAccessTarget } from './quick-access';

describe('QuickAccessComponent', () => {
  let component: QuickAccessComponent;
  let fixture: ComponentFixture<QuickAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickAccessComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QuickAccessComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expone un acceso al mapa de visitantes', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tiles = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.quick-tile'));
    const mapa = tiles.find((tile) => tile.textContent?.includes('Mapa'));

    expect(mapa).toBeDefined();
  });

  it('emite "mapa" al pulsar el acceso del mapa', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tiles = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.quick-tile'));
    const mapa = tiles.find((tile) => tile.textContent?.includes('Mapa'));

    let emitido: QuickAccessTarget | null = null;
    component.navigate.subscribe((target) => (emitido = target));

    mapa?.click();

    expect(emitido).toBe('mapa');
  });
});
