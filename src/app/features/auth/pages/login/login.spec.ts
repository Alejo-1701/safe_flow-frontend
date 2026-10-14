import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, FormsModule],
      // El template usa routerLink; sin esto NG0201: No provider found for `ActivatedRoute`.
      providers: [provideRouter([])],
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
    // El submit es <app-button type="submit">, no un <button class="btn-submit"> nativo.
    const submitButton = compiled.querySelector('app-button[type="submit"]');

    expect(identifierInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });
});
