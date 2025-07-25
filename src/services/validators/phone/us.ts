import isMobilePhone from "validator/lib/isMobilePhone";

import { registerPhoneValidator } from "./registry";

/**
 * US phone number validator
 */
function validateUSPhone(phone: string, strict: boolean = false): boolean {
  // validator.js isMobilePhone options for en-US
  const options = {
    strictMode: strict,
  };

  // Clean phone number by removing spaces, parentheses, and hyphens
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  return isMobilePhone(cleanPhone, "en-US", options);
}

// Auto-register this locale when imported
registerPhoneValidator("us", validateUSPhone);

export { validateUSPhone };
