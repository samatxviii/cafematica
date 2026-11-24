import { calculateThirteenth, monthsFromAdmission, parseBRL } from '../lib/thirteenth-salary.mjs';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const percentage = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 2 });
const brl = (cents) => money.format(cents / 100);

for (const widget of document.querySelectorAll('.salary-calculator')) {
  const form = widget.querySelector('form');
  const fields = Object.fromEntries([...form.querySelectorAll('[data-field]')].map(input => [input.dataset.field, input]));
  const results = form.querySelector('[data-results]');
  const error = form.querySelector('[data-error]');
  const feedback = form.querySelector('[data-feedback]');
  const copy = form.querySelector('[data-action="copy"]');
  const track = (name) => document.dispatchEvent(new CustomEvent('cafematica:calculator', { detail: name }));
  let current;
  let tracked = false;

  function update() {
    const byDate = fields.mode.value === 'date';
    form.querySelector('[data-mode="months"]').hidden = byDate;
    form.querySelector('[data-mode="date"]').hidden = !byDate;
    fields.months.disabled = byDate;
    fields.date.disabled = !byDate;
    const values = Object.fromEntries(Object.entries(fields).map(([key, input]) => [key, input.value.trim()]));
    error.textContent = '';
    feedback.textContent = '';
    current = undefined;
    results.hidden = true;
    copy.disabled = true;

    if (!values.salary || (byDate ? !values.date : !values.months)) return;
    const salary = parseBRL(values.salary);
    const variable = values.variable ? parseBRL(values.variable) : 0;
    const advance = values.advance ? parseBRL(values.advance) : undefined;
    let months;
    try {
      months = byDate ? monthsFromAdmission(values.date) : Number(values.months);
      current = calculateThirteenth({ salary, months, variable, advance, dependents: Number(values.dependents) });
    } catch (exception) {
      error.textContent = exception.message;
      return;
    }

    const { gross, first, inss, irrf, net, second } = current;
    const amounts = { gross, first, inss: inss.tax, irrf: irrf.tax, net, second };
    for (const [key, amount] of Object.entries(amounts)) {
      results.querySelector('[data-value="' + key + '"]').textContent = brl(amount);
    }
    [net, inss.tax, irrf.tax].forEach((amount, i) => {
      const ratio = gross ? amount / gross : 0;
      results.querySelector('[data-meter="' + i + '"]').value = ratio * 100;
      results.querySelector('[data-percent="' + i + '"]').textContent = percentage.format(ratio);
    });

    const steps = [
      'Bruto: (' + brl(salary) + ' + ' + brl(variable) + ') × ' + months + '/12 = ' + brl(gross) + '.',
      advance === undefined ? 'Adiantamento estimado: 50% de ' + brl(gross) + ' = ' + brl(first) + '.' : 'Adiantamento informado: ' + brl(first) + '.',
      ...inss.portions.filter(({ slice }) => slice > 0).map(({ slice, rate, amount }) => 'INSS: ' + brl(slice) + ' × ' + percentage.format(rate / 10000) + ' ≈ ' + brl(amount) + '.'),
      'Base de IRRF: bruto menos ' + brl(irrf.deduction) + ' (' + (irrf.simplified ? 'desconto simplificado' : 'deduções legais') + '), com piso zero = ' + brl(irrf.base) + '.',
      'IRRF: ' + brl(irrf.base) + ' × ' + percentage.format(irrf.rate / 10000) + ' menos ' + brl(irrf.offset) + ' da faixa, com piso zero = ' + brl(irrf.beforeReduction) + '. Após a redução de ' + brl(irrf.reduction) + ': ' + brl(irrf.tax) + '.',
      'Líquido total: ' + brl(gross) + ' − ' + brl(inss.tax) + ' − ' + brl(irrf.tax) + ' = ' + brl(net) + '.',
      'Saldo da segunda parcela: ' + brl(net) + ' − ' + brl(first) + ' = ' + brl(second) + '.' + (second < 0 ? ' O adiantamento supera o líquido estimado. Consulte a folha para verificar o ajuste.' : '')
    ];
    results.querySelector('[data-memory]').replaceChildren(...steps.map(step => {
      const item = document.createElement('li');
      item.textContent = step;
      return item;
    }));
    results.hidden = false;
    copy.disabled = false;
    if (!tracked) {
      track('calculator_use');
      tracked = true;
    }
  }

  async function writeClipboard(value, success) {
    try {
      await navigator.clipboard.writeText(value);
      feedback.textContent = success;
      return true;
    } catch {
      feedback.textContent = 'A cópia automática falhou. Você pode selecionar os valores ou copiar o endereço na barra do navegador.';
      return false;
    }
  }

  form.hidden = false;
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  form.addEventListener('reset', () => queueMicrotask(update));
  copy.addEventListener('click', async () => {
    if (!current) return;
    const { gross, first, inss, irrf, second, net } = current;
    const summary = ['Estimativa do 13º salário — Cafemática', 'Bruto: ' + brl(gross), 'Primeira parcela: ' + brl(first),
      'INSS: ' + brl(inss.tax), 'IRRF: ' + brl(irrf.tax), 'Saldo da segunda parcela: ' + brl(second), 'Líquido: ' + brl(net)];
    if (await writeClipboard(summary.join('\n'), 'Resultados copiados.')) track('calculator_copy');
  });
  form.querySelector('[data-action="whatsapp"]').addEventListener('click', () => track('calculator_share'));
  form.querySelector('[data-action="link"]').addEventListener('click', async () => {
    const url = widget.dataset.url;
    if (navigator.share) {
      try {
        await navigator.share({ url });
        track('calculator_share');
        return;
      } catch (exception) {
        if (exception.name === 'AbortError') return;
      }
    }
    if (await writeClipboard(url, 'Endereço da publicação copiado.')) track('calculator_share');
  });
}
