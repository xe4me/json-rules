import isMobilePhone from 'validator/lib/isMobilePhone';
import { registerPhoneValidator } from './registry';

/**
 * German phone number validator
 */
function validateGermanPhone(phone: string, strict: boolean = false): boolean {
  const options = {
    strictMode: strict
  };
  
  // Clean phone number by removing spaces and hyphens
  const cleanPhone = phone.replace(/[\s\-]/g, '');
  
  return isMobilePhone(cleanPhone, 'de-DE', options);
}

// Auto-register this locale when imported
registerPhoneValidator('de', validateGermanPhone);

export { validateGermanPhone }; 