import isMobilePhone from "validator/lib/isMobilePhone";

import { registerPhoneValidator } from "./registry";

/**
 * GB/UK phone number validator
 */
function validateGBPhone(phone: string, strict: boolean = false): boolean {
  const options = {
    strictMode: strict,
  };

  // Clean phone number by removing spaces and hyphens
  const cleanPhone = phone.replace(/[\s\-]/g, "");

  return isMobilePhone(cleanPhone, "en-GB", options);
}

// Auto-register this locale when imported
registerPhoneValidator("gb", validateGBPhone);

export { validateGBPhone };
