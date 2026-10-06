import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Residente } from './residente';

describe('Residente', () => {
  let component: Residente;
  let fixture: ComponentFixture<Residente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Residente],
    }).compileComponents();

    fixture = TestBed.createComponent(Residente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
