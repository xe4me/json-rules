import isEmail from 'validator/lib/isEmail';
import { EmailValidationConfig } from '../../types/rule';

/**
 * Validates email addresses with configurable options
 */
export function validateEmail(
  value: any,
  config: EmailValidationConfig | null = null
): boolean {
  // Must be a string
  if (typeof value !== 'string') {
    return false;
  }

  // Use default config if none provided
  const validationConfig = config || {};

  // Convert our config to validator.js options
  const options: any = {
    allow_display_name: validationConfig.allowDisplayName || false,
    require_display_name: validationConfig.requireDisplayName || false,
    allow_utf8_local_part: validationConfig.allowUtf8LocalPart || true,
    require_tld: validationConfig.requireTld !== false, // Default true
    allow_ip_domain: validationConfig.allowIpDomain || false,
    allow_underscores: validationConfig.allowUnderscores || false,
    domain_specific_validation: validationConfig.domainSpecificValidation || false,
  };

  // Add blacklisted characters if specified
  if (validationConfig.blacklistedChars) {
    options.blacklisted_chars = validationConfig.blacklistedChars;
  }

  // Validate email format first
  const isValidFormat = isEmail(value, options);
  
  if (!isValidFormat) {
    return false;
  }

  // Extract domain for whitelist/blacklist checking
  const emailParts = value.split('@');
  if (emailParts.length !== 2) {
    return false;
  }
  
  const domain = emailParts[1].toLowerCase();

  // Check domain blacklist
  if (validationConfig.hostBlacklist && validationConfig.hostBlacklist.length > 0) {
    const blacklist = validationConfig.hostBlacklist.map(host => host.toLowerCase());
    if (blacklist.includes(domain)) {
      return false;
    }
  }

  // Check domain whitelist (if provided, only allow whitelisted domains)
  if (validationConfig.hostWhitelist && validationConfig.hostWhitelist.length > 0) {
    const whitelist = validationConfig.hostWhitelist.map(host => host.toLowerCase());
    if (!whitelist.includes(domain)) {
      return false;
    }
  }

  return true;
} 