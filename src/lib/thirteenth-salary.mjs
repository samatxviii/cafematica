import { payroll2026 } from '../data/payroll-2026.mjs';

export function monthsFromAdmission(date, year = payroll2026.year) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new RangeError('Informe uma data de admissão válida.');
  const parsed = new Date(date + 'T00:00:00Z');
  if (!Number.isFinite(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date || date < '1900-01-01' || date > year + '-12-31') {
    throw new RangeError('Informe uma data de admissão válida até dezembro de ' + year + '.');
  }
  if (parsed.getUTCFullYear() < year) return 12;
  const month = parsed.getUTCMonth();
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return 11 - month + Number(lastDay - parsed.getUTCDate() + 1 >= 15);
}

export function parseBRL(value) {
  const normalized = value.trim();
  if (!/^(?:\d{1,8}|\d{1,2}(?:\.\d{3}){2}|\d{1,3}\.\d{3})(?:,\d{1,2})?$/.test(normalized)) return NaN;
  const [reais, cents = ''] = normalized.replaceAll('.', '').split(',');
  return Number(reais) * 100 + Number(cents.padEnd(2, '0'));
}

export function progressiveINSS(gross, bands = payroll2026.inss) {
  let previous = 0;
  let accumulated = 0;
  const portions = bands.map(([ceiling, rate]) => {
    const slice = Math.max(0, Math.min(gross, ceiling) - previous);
    previous = ceiling;
    const tax = slice * rate;
    const amount = Math.round((accumulated + tax) / 10000) - Math.round(accumulated / 10000);
    accumulated += tax;
    return { slice, rate, amount };
  });
  return { portions, tax: Math.round(accumulated / 10000) };
}

export function incomeTax(gross, inss, dependents, tables = payroll2026) {
  const legalDeduction = inss + dependents * tables.dependent;
  const deduction = Math.max(legalDeduction, tables.simplified);
  const base = Math.max(0, gross - deduction);
  const [, rate, offset] = tables.irrf.find(([ceiling]) => base <= ceiling);
  const beforeReduction = Math.max(0, Math.round((base * rate - offset * 10000) / 10000));
  const { fullUntil, partialUntil, maximum, intercept, slope } = tables.reduction;
  let discount = 0;
  if (gross <= fullUntil) discount = maximum;
  else if (gross <= partialUntil) discount = Math.max(0, Math.round((intercept * 1000000 - slope * gross) / 1000000));
  const reduction = Math.min(beforeReduction, discount);
  return { base, rate, offset, deduction, simplified: deduction > legalDeduction, beforeReduction, reduction, tax: beforeReduction - reduction };
}

// All money values are integer cents. Rates are expressed in basis points.
export function calculateThirteenth({ salary, months, variable = 0, dependents = 0, advance }, tables = payroll2026) {
  const amount = (value) => Number.isInteger(value) && value >= 0 && value <= 9999999999;
  if (!amount(salary) || salary === 0 || !amount(variable)) throw new RangeError('Informe valores válidos para o salário e a média variável.');
  if (!Number.isInteger(months) || months < 0 || months > 12) throw new RangeError('Informe de 0 a 12 meses com direito ao 13º.');
  if (!Number.isInteger(dependents) || dependents < 0 || dependents > 99) throw new RangeError('Informe de 0 a 99 dependentes.');
  const gross = Math.round((salary + variable) * months / 12);
  if (advance !== undefined && (!amount(advance) || advance > gross)) throw new RangeError('O adiantamento deve estar entre zero e o 13º bruto.');
  const first = advance ?? Math.round(gross / 2);
  const inss = progressiveINSS(gross, tables.inss);
  const irrf = incomeTax(gross, inss.tax, dependents, tables);
  const net = gross - inss.tax - irrf.tax;
  return { gross, first, inss, irrf, net, second: net - first };
}
