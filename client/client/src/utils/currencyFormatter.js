import { APP_CONFIG } from './constants';

// Format: $1,250.00
export const formatCurrency = (amount, currency = APP_CONFIG.CURRENCY) => {
  if (amount === undefined || amount === null) return '-';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// Calculate Total with Tax
export const calculateBillTotal = (subtotal, taxRate = APP_CONFIG.TAX_RATE) => {
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};