/**
 * Format numbers into Indian Rupee currency string
 * e.g., 500 -> ₹500, 5000 -> ₹5,000, 100000 -> ₹1,00,000
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  // Ensure rounded integer presentation for clean UI
  const rounded = Math.round(amount);
  
  try {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    });
    return formatter.format(rounded);
  } catch {
    // Fallback if Intl fails
    const parts = rounded.toString().split('.');
    let lastThree = parts[0].substring(parts[0].length - 3);
    const otherNumbers = parts[0].substring(0, parts[0].length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return `₹${res}`;
  }
}

/**
 * Format plain number with Indian commas without currency symbol
 */
export function formatNumberIN(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(Math.round(num));
}
