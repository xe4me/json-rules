import isEAN from 'validator/lib/isEAN';
import isIMEI from 'validator/lib/isIMEI';
import { IMEIValidationConfig } from '../../types/rule';

/**
 * Validates EAN (European Article Number) barcodes
 */
export function validateEAN(value: any): boolean {
  // Must be a string
  if (typeof value !== 'string') {
    return false;
  }

  return isEAN(value);
}

/**
 * Validates IMEI (International Mobile Equipment Identity) numbers
 */
export function validateIMEI(
  value: any,
  config: IMEIValidationConfig | null = null
): boolean {
  // Must be a string
  if (typeof value !== 'string') {
    return false;
  }

  // Use default config if none provided
  const validationConfig = config || {};

  // If allowHyphens is true, try both with and without hyphens
  if (validationConfig.allowHyphens) {
    // Try with hyphens option
    const withHyphens = isIMEI(value, { allow_hyphens: true });
    if (withHyphens) return true;
    
    // Try without hyphens (plain format)
    return isIMEI(value);
  }

  // Default: only plain format (no hyphens)
  return isIMEI(value);
} 