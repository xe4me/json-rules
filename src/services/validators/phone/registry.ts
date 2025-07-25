import { PhoneValidationConfig } from "../../../types/rule";

/**
 * Type definition for phone validator functions
 */
export type PhoneValidator = (phone: string, strict?: boolean) => boolean;

/**
 * Registry to store locale-specific phone validators
 */
const phoneValidators = new Map<string, PhoneValidator>();

/**
 * Register a phone validator for a specific locale
 */
export function registerPhoneValidator(
  locale: string,
  validator: PhoneValidator
): void {
  phoneValidators.set(locale.toLowerCase(), validator);
}

/**
 * Get a phone validator for a specific locale
 * Throws an error if the locale is not registered
 */
export function getPhoneValidator(locale: string): PhoneValidator {
  const validator = phoneValidators.get(locale.toLowerCase());
  if (!validator) {
    throw new Error(
      `Phone locale '${locale}' not registered. Import '@ivandt/json-rules/validators/phone/${locale}' to register this locale.`
    );
  }
  return validator;
}

/**
 * Check if a locale is registered
 */
export function isLocaleRegistered(locale: string): boolean {
  return phoneValidators.has(locale.toLowerCase());
}

/**
 * Get all registered locales
 */
export function getRegisteredLocales(): string[] {
  return Array.from(phoneValidators.keys());
}

/**
 * Main phone validation function
 */
export function validatePhone(
  value: any,
  config: PhoneValidationConfig
): boolean {
  // Must be a string
  if (typeof value !== "string") {
    return false;
  }

  // Config is required for phone validation
  if (!config || !config.locale) {
    return false;
  }

  // Get the validator for the specified locale
  const validator = getPhoneValidator(config.locale);

  // Use the locale-specific validator
  return validator(value, config.strict);
}
