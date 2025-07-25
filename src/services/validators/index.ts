// Basic validators
export { validateEmail } from "./email";
export { validateURL } from "./url";
export { validateUUID } from "./uuid";
export { validateEAN, validateIMEI } from "./codes";
export { validateDomain } from "./domain";
export {
  validateUnit,
  getSupportedUnits,
  getSupportedUnitTypes,
} from "./units";
export { validateCountry, getSupportedCountryNames } from "./country";

// Phone validation (modular)
export { validatePhone } from "./phone";

// Re-export types
export type { PhoneValidator } from "./phone";
