import { describe, expect, it } from 'vitest';
import { calculateThirteenth, incomeTax, monthsFromAdmission, parseBRL, progressiveINSS } from '../src/lib/thirteenth-salary.mjs';
import { splitArticleBody } from '../src/lib/article-widgets.mjs';
import { renderMarkdown } from '../src/lib/render.mjs';

describe('13º salário de 2026', () => {
  // Calculados à mão com as faixas oficiais e o arredondamento apenas após somar o INSS.
  it.each([
    [162100, 12, 162100, 81050, 12158, 0, 68892, 149942],
    [200000, 12, 200000, 100000, 15569, 0, 84431, 184431],
    [200000, 6, 100000, 50000, 7500, 0, 42500, 92500],
    [300000, 3, 75000, 37500, 5625, 0, 31875, 69375],
    [500000, 9, 375000, 187500, 33860, 0, 153640, 341140],
    [500000, 12, 500000, 250000, 50151, 0, 199849, 449849],
    [1000000, 12, 1000000, 500000, 98809, 156955, 244236, 744236]
  ])('valida exemplo editorial de %i centavos e %i avos', (salary, months, gross, first, inss, irrf, second, net) => {
    const result = calculateThirteenth({ salary, months });
    expect([result.gross, result.first, result.inss.tax, result.irrf.tax, result.second, result.net])
      .toEqual([gross, first, inss, irrf, second, net]);
  });

  it.each([
    [162100, 12158, 0], [290284, 23694, 1], [435427, 41111, 2], [847555, 98809, 3]
  ])('verifica centavos adjacentes à faixa de INSS %i', (ceiling, expectedTax, index) => {
    expect(progressiveINSS(ceiling - 1).tax).toBeLessThanOrEqual(expectedTax);
    expect(progressiveINSS(ceiling).tax).toBe(expectedTax);
    const above = progressiveINSS(ceiling + 1);
    expect(above.portions[index + 1]?.slice).toBe(index === 3 ? undefined : 1);
    if (index === 3) expect(above.tax).toBe(expectedTax);
  });

  it.each([
    [242880, 0, 750], [282665, 750, 1500], [375105, 1500, 2250], [466468, 2250, 2750]
  ])('verifica a virada de faixa da base do IRRF em %i', (base, currentRate, nextRate) => {
    expect(incomeTax(base - 1 + 60720, 0, 0).rate).toBe(currentRate);
    expect(incomeTax(base + 60720, 0, 0).rate).toBe(currentRate);
    expect(incomeTax(base + 1 + 60720, 0, 0).rate).toBe(nextRate);
  });

  it('aplica a redução sobre o rendimento antes das deduções, com os limites legais', () => {
    expect(incomeTax(500000, 0, 0)).toMatchObject({ base: 439280, beforeReduction: 31289, reduction: 31289, tax: 0 });
    expect(incomeTax(500001, 0, 0).reduction).toBe(31289);
    expect(incomeTax(600000, 0, 0)).toMatchObject({ beforeReduction: 57429, reduction: 17975, tax: 39454 });
    expect(incomeTax(734999, 0, 0).reduction).toBe(1);
    expect(incomeTax(735000, 0, 0).reduction).toBe(0);
    expect(incomeTax(735001, 0, 0).reduction).toBe(0);
  });

  it('escolhe a dedução maior e considera média e adiantamento informados', () => {
    const result = calculateThirteenth({ salary: 550000, variable: 50000, months: 12, dependents: 2, advance: 200000 });
    expect(result.gross).toBe(600000);
    expect(result.inss.tax).toBe(64151);
    expect(result.irrf).toMatchObject({ deduction: 102069, simplified: false, tax: 28083 });
    expect(result.second).toBe(307766);
    expect(calculateThirteenth({ salary: 200000, months: 12, advance: 0 }).first).toBe(0);
    expect(calculateThirteenth({ salary: 200000, months: 12, advance: 200000 }).second).toBe(-15569);
  });

  it.each([
    ['2025-12-31', 12], ['2026-02-14', 11], ['2026-02-15', 10],
    ['2026-06-16', 7], ['2026-06-17', 6], ['2026-12-17', 1], ['2026-12-18', 0]
  ])('conta avos desde %s', (date, months) => expect(monthsFromAdmission(date)).toBe(months));

  it('valida datas, dinheiro e campos fora do intervalo', () => {
    expect(parseBRL(' 2.000,50 ')).toBe(200050);
    expect(parseBRL('12.345.678,9')).toBe(1234567890);
    expect(parseBRL('2,000.50')).toBeNaN();
    expect(() => monthsFromAdmission('2026-02-29')).toThrow(RangeError);
    expect(() => monthsFromAdmission('2027-01-01')).toThrow(RangeError);
    expect(() => calculateThirteenth({ salary: 0, months: 12 })).toThrow(RangeError);
    expect(() => calculateThirteenth({ salary: 200000, months: 13 })).toThrow(RangeError);
    expect(() => calculateThirteenth({ salary: 200000, months: 12, dependents: 1.5 })).toThrow(RangeError);
    expect(() => calculateThirteenth({ salary: 200000, months: 12, advance: 200001 })).toThrow(RangeError);
    expect(calculateThirteenth({ salary: 200001, months: 0 }).net).toBe(0);
    expect(calculateThirteenth({ salary: 200001, months: 12 }).first).toBe(100001);
  });

  it('insere somente o widget cadastrado, entre blocos editoriais sanitizados', () => {
    const source = 'Introdução\n\n> [[calculadora-decimo-terceiro]]\n\n[[calculadora-decimo-terceiro]]\n\n[[outro]]\n\n## Texto\n\n<script>alert(1)</script>';
    const parts = splitArticleBody(source, renderMarkdown(source));
    expect(parts).toHaveLength(3);
    expect(parts[0].html).toContain('Introdução');
    expect(parts[0].html).toContain('<blockquote>');
    expect(parts[1]).toEqual({ widget: 'calculadora-decimo-terceiro' });
    expect(parts[2].html).toContain('<h2>Texto</h2>');
    expect(parts[2].html).toContain('[[outro]]');
    expect(parts[2].html).not.toContain('<script>');
  });
});
