
/**
 * Formats a phone number for WhatsApp usage
 * Handles Israeli phone numbers by adding +972 prefix
 */
export const formatPhoneForWhatsApp = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove spaces, dashes, and parentheses
  const cleanPhone = phoneNumber.replace(/[\s\-()]/g, '');
  
  // If the number starts with 0, replace with +972
  if (cleanPhone.startsWith('0')) {
    return '972' + cleanPhone.substring(1);
  }
  
  // If the number starts with +, remove the +
  if (cleanPhone.startsWith('+')) {
    return cleanPhone.substring(1);
  }
  
  // If the number doesn't start with 972, assume it's Israeli and add 972
  if (!cleanPhone.startsWith('972')) {
    return '972' + cleanPhone;
  }
  
  return cleanPhone;
};

/**
 * Opens WhatsApp with the formatted phone number
 */
export const openWhatsApp = (phoneNumber: string, message?: string) => {
  const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
  let url = `https://wa.me/${formattedPhone}`;
  
  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }
  
  window.open(url, '_blank');
};
