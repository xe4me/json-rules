import isFQDN from "validator/lib/isFQDN";

import { DomainValidationConfig } from "../../types/rule";

/**
 * Validates domain names with configurable options
 */
export function validateDomain(
  value: any,
  config: DomainValidationConfig | null = null
): boolean {
  // Must be a string
  if (typeof value !== "string") {
    return false;
  }

  // Use default config if none provided
  const validationConfig = config || {};

  // Convert our config to validator.js options
  const options: any = {
    require_tld: validationConfig.requireTld !== false, // Default true
    allow_underscores: validationConfig.allowUnderscores || false,
    allow_trailing_dot: validationConfig.allowTrailingDot || false,
    allow_numeric_tld: validationConfig.allowNumericTld || false,
    allow_wildcard: validationConfig.allowWildcard || false,
    ignore_max_length: validationConfig.ignoreMaxLength || false,
  };

  return isFQDN(value, options);
}
