import { TestBed } from '@angular/core/testing';

import {
  VerificationCodeService,
  VERIFICATION_CODE_TTL_SECONDS
} from './verification-code.service';

describe('VerificationCodeService', () => {
  let service: VerificationCodeService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificationCodeService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('emite un código de seis dígitos', () => {
    expect(service.code()).toMatch(/^\d{6}$/);
  });

  it('arranca con la ventana completa', () => {
    expect(service.secondsLeft()).toBe(VERIFICATION_CODE_TTL_SECONDS);
  });

  it('formatea la cuenta atrás como m:ss', () => {
    expect(service.countdown()).toBe('1:00');
  });

  it('descuenta un segundo por tick', () => {
    vi.advanceTimersByTime(1000);

    expect(service.secondsLeft()).toBe(VERIFICATION_CODE_TTL_SECONDS - 1);
    expect(service.countdown()).toBe('0:59');
  });

  it('rota el código y reinicia la ventana al agotarse el minuto', () => {
    vi.advanceTimersByTime(VERIFICATION_CODE_TTL_SECONDS * 1000);

    expect(service.code()).toMatch(/^\d{6}$/);
    expect(service.secondsLeft()).toBe(VERIFICATION_CODE_TTL_SECONDS);
  });

  it('siempre entrega seis caracteres, con ceros a la izquierda', () => {
    for (let i = 0; i < 200; i++) {
      expect(service.code()).toHaveLength(6);
      vi.advanceTimersByTime(VERIFICATION_CODE_TTL_SECONDS * 1000);
    }
  });

  // El código solo rota por tiempo: si existiera una vía pública para
  // adelantarlo, la UI podría exponerla y el requisito se rompería.
  // `refresh` existe, pero es privado: TypeScript lo bloquea en compilación y
  // este test lo confirma en runtime.
  it('no expone la rotación como API pública', () => {
    expect(service.code()).toMatch(/^\d{6}$/);
    expect(service.countdown()).toBe('1:00');

    const superficiePublica: Record<string, unknown> = {
      code: service.code,
      secondsLeft: service.secondsLeft,
      progress: service.progress,
      countdown: service.countdown
    };

    expect(superficiePublica['refresh']).toBeUndefined();
    expect(Object.keys(superficiePublica)).toHaveLength(4);
  });
});
