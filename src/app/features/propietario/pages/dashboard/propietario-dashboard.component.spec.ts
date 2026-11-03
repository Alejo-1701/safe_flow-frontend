import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropietarioDashboardComponent } from './propietario-dashboard.component';

describe('PropietarioDashboardComponent', () => {
  let component: PropietarioDashboardComponent;
  let fixture: ComponentFixture<PropietarioDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropietarioDashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PropietarioDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
