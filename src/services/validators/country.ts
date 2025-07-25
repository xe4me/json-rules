import isISO31661Alpha2 from "validator/lib/isISO31661Alpha2";
import isISO31661Alpha3 from "validator/lib/isISO31661Alpha3";

import { CountryValidationConfig } from "../../types/rule";

/**
 * Common country names mapping for validation
 * This is a subset of common countries - in production, you might want a more comprehensive list
 */
const COUNTRY_NAMES = [
  // Major countries
  "united states",
  "usa",
  "america",
  "united kingdom",
  "uk",
  "britain",
  "great britain",
  "england",
  "scotland",
  "wales",
  "northern ireland",
  "canada",
  "australia",
  "new zealand",
  "germany",
  "deutschland",
  "france",
  "spain",
  "españa",
  "italy",
  "italia",
  "netherlands",
  "holland",
  "belgium",
  "switzerland",
  "austria",
  "österreich",
  "sweden",
  "sverige",
  "norway",
  "norge",
  "denmark",
  "danmark",
  "finland",
  "suomi",
  "poland",
  "polska",
  "czech republic",
  "czechia",
  "slovakia",
  "hungary",
  "magyarország",
  "romania",
  "bulgaria",
  "greece",
  "hellas",
  "turkey",
  "türkiye",
  "russia",
  "russian federation",
  "ukraine",
  "belarus",
  "lithuania",
  "latvia",
  "estonia",
  "japan",
  "nippon",
  "nihon",
  "china",
  "people's republic of china",
  "prc",
  "south korea",
  "republic of korea",
  "north korea",
  "democratic people's republic of korea",
  "india",
  "pakistan",
  "bangladesh",
  "sri lanka",
  "indonesia",
  "malaysia",
  "thailand",
  "vietnam",
  "philippines",
  "singapore",
  "taiwan",
  "republic of china",
  "hong kong",
  "macau",
  "brazil",
  "brasil",
  "argentina",
  "chile",
  "colombia",
  "peru",
  "venezuela",
  "ecuador",
  "bolivia",
  "uruguay",
  "paraguay",
  "mexico",
  "méxico",
  "south africa",
  "egypt",
  "nigeria",
  "kenya",
  "ethiopia",
  "morocco",
  "algeria",
  "tunisia",
  "israel",
  "saudi arabia",
  "united arab emirates",
  "uae",
  "iran",
  "iraq",
  "jordan",
  "lebanon",
  "syria",
  "kuwait",
  "qatar",
  "bahrain",
  "oman",
  "yemen",
];

/**
 * Validates country identifiers in various formats
 */
export function validateCountry(
  value: any,
  config: CountryValidationConfig
): boolean {
  // Must be a string
  if (typeof value !== "string") {
    return false;
  }

  // Config is required for country validation
  if (!config || !config.format) {
    return false;
  }

  const cleanValue = value.trim();

  switch (config.format) {
    case "iso2":
      // Validate ISO 3166-1 alpha-2 codes (e.g., "US", "GB", "DE")
      return isISO31661Alpha2(cleanValue);

    case "iso3":
      // Validate ISO 3166-1 alpha-3 codes (e.g., "USA", "GBR", "DEU")
      return isISO31661Alpha3(cleanValue);

    case "name":
      // Validate against common country names (case-insensitive)
      const cleanName = cleanValue.toLowerCase();
      return COUNTRY_NAMES.includes(cleanName);

    default:
      return false;
  }
}

/**
 * Get all supported country names
 */
export function getSupportedCountryNames(): string[] {
  return [...COUNTRY_NAMES];
}
