import isUUID from 'validator/lib/isUUID';
import { UUIDValidationConfig } from '../../types/rule';

/**
 * Validates UUIDs with configurable version options
 */
export function validateUUID(
  value: any,
  config: UUIDValidationConfig | null = null
): boolean {
  // Must be a string
  if (typeof value !== 'string') {
    return false;
  }

  // Use default config if none provided
  const validationConfig = config || {};

  // If no version specified, accept any valid UUID
  if (!validationConfig.version) {
    return isUUID(value);
  }

  // Validate specific UUID version
  return isUUID(value, validationConfig.version);
} 