import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, FormsModule],
      // The template uses routerLink; without this NG0201: No provider found for `ActivatedRoute`.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
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

  it('should render form elements without user type selector or verification code', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('#identifier')).toBeTruthy();
    expect(compiled.querySelector('#password')).toBeTruthy();
    expect(compiled.querySelector('app-button[type="submit"]')).toBeTruthy();
    expect(compiled.querySelector('#userType')).toBeNull();
    expect(compiled.querySelector('app-verification-code')).toBeNull();
  });
});
