
export const validateCardNumber = (number: string): boolean => {
  const digits = number.replace(/\s/g, '');
  if (digits.length !== 16) return false;
  return /^\d{16}$/.test(digits);
};

export const validateExpiryDate = (date: string): boolean => {
  if (date.length !== 5) return false;
  
  const parts = date.split('/');
  if (parts.length !== 2) return false;
  
  const month = parseInt(parts[0], 10);
  const year = parseInt('20' + parts[1], 10);
  
  if (isNaN(month) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  
  return true;
};

export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  const limitedDigits = digits.slice(0, 16);
  const formatted = limitedDigits.replace(/(\d{4})(?=\d)/g, '$1 ');
  return formatted;
};

export const formatExpiryDate = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  const limitedDigits = digits.slice(0, 4);
  if (limitedDigits.length > 2) {
    return `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2)}`;
  }
  return limitedDigits;
};
