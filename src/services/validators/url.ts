import isURL from "validator/lib/isURL";

import { URLValidationConfig } from "../../types/rule";

/**
 * Validates URLs with configurable options
 */
export function validateURL(
  value: any,
  config: URLValidationConfig | null = null
): boolean {
  // Must be a string
  if (typeof value !== "string") {
    return false;
  }

  // Use default config if none provided
  const validationConfig = config || {};

  // Convert our config to validator.js options
  const options: any = {
    protocols: validationConfig.protocols || ["http", "https", "ftp"],
    require_protocol: validationConfig.requireProtocol !== false, // Default true
    require_tld: validationConfig.requireTld !== false, // Default true, but allow false for localhost
    allow_underscores: validationConfig.allowUnderscores || false,
    allow_trailing_dot: validationConfig.allowTrailingDot || false,
    allow_numeric_tld: validationConfig.allowNumericTld || false,
    allow_wildcard: validationConfig.allowWildcard || false,
    ignore_max_length: validationConfig.ignoreMaxLength || false,
  };

  return isURL(value, options);
}
