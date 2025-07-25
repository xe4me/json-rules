import { UnitType } from '../../types/rule';

/**
 * Comprehensive unit definitions for all measurement types
 */
const UNIT_DEFINITIONS: Record<UnitType, string[]> = {
  // Length units
  length: [
    // Metric
    'mm', 'millimeter', 'millimeters', 'millimetre', 'millimetres',
    'cm', 'centimeter', 'centimeters', 'centimetre', 'centimetres',
    'm', 'meter', 'meters', 'metre', 'metres',
    'km', 'kilometer', 'kilometers', 'kilometre', 'kilometres',
    // Imperial
    'in', 'inch', 'inches', '"',
    'ft', 'foot', 'feet', "'",
    'yd', 'yard', 'yards',
    'mi', 'mile', 'miles',
    // Nautical
    'nm', 'nmi', 'nautical mile', 'nautical miles',
    // Other
    'μm', 'micrometer', 'micrometers', 'micrometre', 'micrometres',
    'thou', 'mil', 'mils'
  ],

  // Mass/Weight units
  mass: [
    // Metric
    'mg', 'milligram', 'milligrams',
    'g', 'gram', 'grams',
    'kg', 'kilogram', 'kilograms',
    't', 'ton', 'tons', 'tonne', 'tonnes', 'metric ton', 'metric tons',
    // Imperial
    'oz', 'ounce', 'ounces',
    'lb', 'lbs', 'pound', 'pounds',
    'st', 'stone', 'stones',
    'cwt', 'hundredweight',
    // Other
    'gr', 'grain', 'grains',
    'dr', 'dram', 'drams'
  ],

  // Volume units
  volume: [
    // Metric
    'ml', 'milliliter', 'milliliters', 'millilitre', 'millilitres',
    'cl', 'centiliter', 'centiliters', 'centilitre', 'centilitres',
    'dl', 'deciliter', 'deciliters', 'decilitre', 'decilitres',
    'l', 'liter', 'liters', 'litre', 'litres',
    // Imperial
    'fl oz', 'fluid ounce', 'fluid ounces',
    'pt', 'pint', 'pints',
    'qt', 'quart', 'quarts',
    'gal', 'gallon', 'gallons',
    // Cooking
    'tsp', 'teaspoon', 'teaspoons',
    'tbsp', 'tablespoon', 'tablespoons',
    'cup', 'cups',
    // Other
    'bbl', 'barrel', 'barrels'
  ],

  // Temperature units
  temperature: [
    '°C', 'celsius', 'centigrade',
    '°F', 'fahrenheit',
    'K', 'kelvin',
    '°R', 'rankine'
  ],

  // Time units
  time: [
    'ns', 'nanosecond', 'nanoseconds',
    'μs', 'microsecond', 'microseconds',
    'ms', 'millisecond', 'milliseconds',
    's', 'sec', 'second', 'seconds',
    'min', 'minute', 'minutes',
    'h', 'hr', 'hour', 'hours',
    'd', 'day', 'days',
    'wk', 'week', 'weeks',
    'mo', 'month', 'months',
    'yr', 'year', 'years',
    'decade', 'decades',
    'century', 'centuries',
    'millennium', 'millennia'
  ],

  // Area units
  area: [
    // Metric
    'mm²', 'mm^2', 'square millimeter', 'square millimeters',
    'cm²', 'cm^2', 'square centimeter', 'square centimeters',
    'm²', 'm^2', 'square meter', 'square meters',
    'km²', 'km^2', 'square kilometer', 'square kilometers',
    'ha', 'hectare', 'hectares',
    // Imperial
    'in²', 'in^2', 'square inch', 'square inches',
    'ft²', 'ft^2', 'square foot', 'square feet',
    'yd²', 'yd^2', 'square yard', 'square yards',
    'ac', 'acre', 'acres',
    'mi²', 'mi^2', 'square mile', 'square miles'
  ],

  // Energy units
  energy: [
    // Metric
    'J', 'joule', 'joules',
    'kJ', 'kilojoule', 'kilojoules',
    'MJ', 'megajoule', 'megajoules',
    'GJ', 'gigajoule', 'gigajoules',
    // Electrical
    'Wh', 'watt hour', 'watt hours',
    'kWh', 'kilowatt hour', 'kilowatt hours',
    'MWh', 'megawatt hour', 'megawatt hours',
    // Thermal
    'cal', 'calorie', 'calories',
    'kcal', 'kilocalorie', 'kilocalories',
    'Cal', 'Calorie', 'Calories',
    'BTU', 'btu', 'british thermal unit'
  ],

  // Pressure units
  pressure: [
    // Metric
    'Pa', 'pascal', 'pascals',
    'kPa', 'kilopascal', 'kilopascals',
    'MPa', 'megapascal', 'megapascals',
    'bar', 'bars',
    'mbar', 'millibar', 'millibars',
    // Imperial
    'psi', 'pounds per square inch',
    'psf', 'pounds per square foot',
    // Atmospheric
    'atm', 'atmosphere', 'atmospheres',
    'mmHg', 'millimeter of mercury',
    'inHg', 'inch of mercury',
    'Torr', 'torr'
  ],

  // Speed units
  speed: [
    // Metric
    'm/s', 'meter per second', 'meters per second',
    'km/h', 'km/hr', 'kilometer per hour', 'kilometers per hour',
    'm/min', 'meter per minute', 'meters per minute',
    // Imperial
    'ft/s', 'foot per second', 'feet per second',
    'mph', 'mile per hour', 'miles per hour',
    'ft/min', 'foot per minute', 'feet per minute',
    // Nautical
    'kn', 'knot', 'knots',
    // Light
    'c', 'speed of light'
  ],

  // Force units
  force: [
    // Metric
    'N', 'newton', 'newtons',
    'kN', 'kilonewton', 'kilonewtons',
    'MN', 'meganewton', 'meganewtons',
    'dyn', 'dyne', 'dynes',
    // Imperial
    'lbf', 'pound-force', 'pounds-force',
    'kgf', 'kilogram-force', 'kilograms-force',
    'ozf', 'ounce-force', 'ounces-force'
  ],

  // Power units
  power: [
    // Metric
    'W', 'watt', 'watts',
    'kW', 'kilowatt', 'kilowatts',
    'MW', 'megawatt', 'megawatts',
    'GW', 'gigawatt', 'gigawatts',
    // Mechanical
    'hp', 'horsepower',
    'PS', 'pferdestärke',
    'bhp', 'brake horsepower',
    // Other
    'cal/s', 'calorie per second',
    'BTU/h', 'british thermal unit per hour'
  ],

  // Frequency units
  frequency: [
    'Hz', 'hertz',
    'kHz', 'kilohertz',
    'MHz', 'megahertz',
    'GHz', 'gigahertz',
    'THz', 'terahertz',
    'rpm', 'revolutions per minute',
    'rps', 'revolutions per second',
    'bpm', 'beats per minute'
  ]
};

/**
 * Validates if a value contains a valid unit of the specified type
 */
export function validateUnit(value: any, unitType: UnitType): boolean {
  // Must be a string
  if (typeof value !== 'string') {
    return false;
  }

  // Get the allowed units for this type
  const allowedUnits = UNIT_DEFINITIONS[unitType];
  if (!allowedUnits) {
    return false;
  }

  // Clean the input value
  const cleanValue = value.trim().toLowerCase();

  // Check if the value contains any of the allowed units
  // This allows for formats like "5km", "10 meters", "23.5°C", etc.
  return allowedUnits.some(unit => {
    const cleanUnit = unit.toLowerCase();
    
    // Check for exact unit match at the end
    if (cleanValue.endsWith(cleanUnit)) {
      // Ensure there's a number before the unit (or just whitespace)
      const beforeUnit = cleanValue.substring(0, cleanValue.length - cleanUnit.length).trim();
      
      // Must have a number (allow decimals, negatives, scientific notation)
      if (beforeUnit.length === 0) return false;
      
      // Check if it's a valid number
      const numberPart = beforeUnit.replace(/[\s,]/g, ''); // Remove spaces and commas
      return !isNaN(parseFloat(numberPart)) && isFinite(parseFloat(numberPart));
    }
    
    return false;
  });
}

/**
 * Get all supported units for a given unit type
 */
export function getSupportedUnits(unitType: UnitType): string[] {
  return UNIT_DEFINITIONS[unitType] || [];
}

/**
 * Get all supported unit types
 */
export function getSupportedUnitTypes(): UnitType[] {
  return Object.keys(UNIT_DEFINITIONS) as UnitType[];
} 