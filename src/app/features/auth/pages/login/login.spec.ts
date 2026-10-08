import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { FormsModule } from '@angular/forms';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, FormsModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial empty credentials and rememberMe set to false', () => {
    expect(component.credentials.identifier).toBe('');
    expect(component.credentials.password).toBe('');
    expect(component.credentials.rememberMe).toBe(false);
  });

  it('should toggle password visibility state', () => {
    expect(component.showPassword).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(false);
  });

  it('should render form elements (identifier, password inputs and submit button)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const identifierInput = compiled.querySelector('#identifier');
    const passwordInput = compiled.querySelector('#password');
    const submitButton = compiled.querySelector('.btn-submit');

    expect(identifierInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });
});
