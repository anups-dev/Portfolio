const form = document.getElementById('tax-form');
const abnYes = document.getElementById('abn-yes');
const abnNo = document.getElementById('abn-no');
const abnSection = document.getElementById('abn-section');
const resultPanel = document.getElementById('result-panel');
const resultAmount = document.getElementById('result-amount');
const resultMessage = document.getElementById('result-message');
const resultDetails = document.getElementById('result-details');

function formatCurrency(value) {
  return value.toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function calculateTax(taxableIncome) {
  let tax = 0;
  if (taxableIncome <= 18200) {
    tax = 0;
  } else if (taxableIncome <= 45000) {
    tax = (taxableIncome - 18200) * 0.19;
  } else if (taxableIncome <= 120000) {
    tax = 5092 + (taxableIncome - 45000) * 0.325;
  } else if (taxableIncome <= 180000) {
    tax = 29467 + (taxableIncome - 120000) * 0.37;
  } else {
    tax = 51667 + (taxableIncome - 180000) * 0.45;
  }
  return Math.max(0, tax);
}

function updateAbnVisibility() {
  abnSection.classList.toggle('hidden', !abnYes.checked);
}

function showResult(data) {
  resultPanel.classList.remove('hidden');
  resultAmount.textContent = formatCurrency(Math.abs(data.balance));

  if (data.balance > 0) {
    resultMessage.textContent = 'You are likely to owe additional tax.';
    resultAmount.previousElementSibling.textContent = 'Tax owing';
    resultAmount.className = 'result-amount';
    resultPanel.querySelector('.status').textContent = 'Pay more';
    resultPanel.querySelector('.status').className = 'status owing';
  } else if (data.balance < 0) {
    resultMessage.textContent = 'You are likely to receive a refund.';
    resultAmount.previousElementSibling.textContent = 'Estimated refund';
    resultAmount.className = 'result-amount';
    resultPanel.querySelector('.status').textContent = 'Refund expected';
    resultPanel.querySelector('.status').className = 'status refund';
  } else {
    resultMessage.textContent = 'Your tax withheld matches your estimated tax liability.';
    resultAmount.previousElementSibling.textContent = 'Balance';
    resultAmount.className = 'result-amount';
    resultPanel.querySelector('.status').textContent = 'Break-even';
    resultPanel.querySelector('.status').className = 'status break-even';
  }

  resultDetails.innerHTML = `
    <p><strong>Taxable income:</strong> ${formatCurrency(data.taxableIncome)}</p>
    <p><strong>Estimated tax liability:</strong> ${formatCurrency(data.taxLiability)}</p>
    <p><strong>Tax withheld:</strong> ${formatCurrency(data.taxWithheld)}</p>
  `;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const annualIncome = parseFloat(document.getElementById('annual-income').value) || 0;
  const taxWithheld = parseFloat(document.getElementById('tax-withheld').value) || 0;
  const abnIncome = abnYes.checked ? parseFloat(document.getElementById('abn-income').value) || 0 : 0;
  const deductibles = parseFloat(document.getElementById('deductibles').value) || 0;

  const taxableIncome = Math.max(0, annualIncome + abnIncome - deductibles);
  const taxLiability = calculateTax(taxableIncome);
  const balance = taxLiability - taxWithheld;
  const effectiveRate = taxableIncome === 0 ? 0 : (taxLiability / taxableIncome) * 100;

  showResult({
    taxableIncome,
    taxLiability,
    taxWithheld,
    balance,
    effectiveRate,
  });
});

abnYes.addEventListener('change', updateAbnVisibility);
abnNo.addEventListener('change', updateAbnVisibility);
updateAbnVisibility();
