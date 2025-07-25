import isMobilePhone, { MobilePhoneLocale } from "validator/lib/isMobilePhone";

import { PhoneValidationConfig } from "../../types";

/**
 * Validates phone numbers using validator.js
 * Users must import required locales themselves:
 * import "validator/lib/locales/en-US";
 */
export function validatePhone(
  value: string,
  config: PhoneValidationConfig
): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const options = {
    strictMode: config.strict || false,
  };

  // Clean phone number by removing spaces, hyphens, and parentheses
  const cleanPhone = value.replace(/[\s\-\(\)]/g, "");

  return isMobilePhone(cleanPhone, config.locale as MobilePhoneLocale, options);
}
