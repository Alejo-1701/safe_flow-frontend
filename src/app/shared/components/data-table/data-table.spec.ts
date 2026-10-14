import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table';

describe('DataTableComponent', () => {
  let component: DataTableComponent<Record<string, any>>;
  let fixture: ComponentFixture<DataTableComponent<Record<string, any>>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});