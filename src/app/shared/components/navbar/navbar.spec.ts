import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar';
import { VerificationCodeService } from '@shared/services/verification-code.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  /** Monta la barra con el código encendido o apagado. */
  const render = async (showVerificationCode: boolean): Promise<HTMLElement> => {
    fixture.componentRef.setInput('showVerificationCode', showVerificationCode);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('no muestra el código por defecto', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-verification-code')).toBeNull();
  });

  // Portería usa la misma barra: el código no debe aparecerle.
  it('no muestra el código cuando showVerificationCode es false', async () => {
    const compiled = await render(false);

    expect(compiled.querySelector('app-verification-code')).toBeNull();
  });

  it('muestra el código vigente cuando está habilitado', async () => {
    const code = TestBed.inject(VerificationCodeService).code();
    const compiled = await render(true);

    expect(compiled.querySelector('app-verification-code')).toBeTruthy();
    expect(compiled.querySelector('.code-value')?.textContent).toContain(code);
  });

  it('expone el botón de copiar y ningún control de regeneración', async () => {
    const compiled = await render(true);
    const botones = Array.from(compiled.querySelectorAll('app-verification-code button'));

    expect(botones).toHaveLength(1);
    expect(botones[0].classList.contains('code-copy')).toBe(true);
  });

  it('conserva las acciones propias de la barra', async () => {
    const compiled = await render(true);

    expect(compiled.querySelectorAll('.right-section button')).toHaveLength(2);
    expect(compiled.querySelector('.user-profile')).toBeTruthy();
  });
});
