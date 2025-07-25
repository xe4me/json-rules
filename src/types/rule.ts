export type WithRequired<Type, Key extends keyof Type> = Type &
  Required<Pick<Type, Key>>;

export type ConditionType = "any" | "all" | "none";
export type Operator =
  | "is equal"
  | "is not equal"
  | "is greater than"
  | "is less than"
  | "is greater than or equal"
  | "is less than or equal"
  | "in"
  | "not in"
  | "contains"
  | "not contains"
  | "contains any"
  | "not contains any"
  | "matches"
  | "not matches"
  | "is between numbers"
  | "is between dates"
  | "is not between numbers"
  | "is not between dates"
  | "is before"
  | "is after"
  | "is on or before"
  | "is on or after"
  | "starts with"
  | "ends with"
  | "array contains"
  | "array no contains"
  | "is even"
  | "is odd"
  | "is positive"
  | "is negative"
  | "is empty"
  | "is not empty"
  | "is valid email"
  | "is valid phone"
  | "is URL"
  | "is UUID"
  | "is EAN"
  | "is IMEI"
  | "is unit"
  | "is country"
  | "is domain";

export interface RegexPattern {
  regex: string;
  flags?: string;
}

export interface PhoneValidationConfig {
  locale: string;
  strict?: boolean;
}

export interface EmailValidationConfig {
  allowDisplayName?: boolean;
  requireDisplayName?: boolean;
  allowUtf8LocalPart?: boolean;
  requireTld?: boolean;
  allowIpDomain?: boolean;
  allowUnderscores?: boolean;
  domainSpecificValidation?: boolean;
  blacklistedChars?: string;
  hostBlacklist?: string[];
  hostWhitelist?: string[];
}

export interface URLValidationConfig {
  protocols?: string[];
  requireProtocol?: boolean;
  requireTld?: boolean;
  allowUnderscores?: boolean;
  allowTrailingDot?: boolean;
  allowNumericTld?: boolean;
  allowWildcard?: boolean;
  ignoreMaxLength?: boolean;
}

export interface UUIDValidationConfig {
  version?: 1 | 2 | 3 | 4 | 5;
}

export interface IMEIValidationConfig {
  allowHyphens?: boolean;
}

export interface CountryValidationConfig {
  format: "iso2" | "iso3" | "name";
}

export interface DomainValidationConfig {
  requireTld?: boolean;
  allowUnderscores?: boolean;
  allowTrailingDot?: boolean;
  allowNumericTld?: boolean;
  allowWildcard?: boolean;
  ignoreMaxLength?: boolean;
}

export type UnitType = "length" | "mass" | "volume" | "temperature" | "time" | "area" | "energy" | "pressure" | "speed" | "force" | "power" | "frequency";

/**
 * Type for valid field references in template format {fieldName}
 * Only allows fields that actually exist in TData
 */
export type ValidFieldReference<TData> = IsAny<TData> extends true
  ? `{${string}}`
  : `{${PropertyPath<TData>}}`;

/**
 * Type for values that can contain field references
 * Provides autocompletion for valid field references while allowing other values
 */
export type TemplateValue<T, TData = any> = T | ValidFieldReference<TData>;

/**
 * Maps operators to their expected value types
 */
export type OperatorValueMap<TData = any> = {
  "is equal": TemplateValue<string | number | boolean | Date | null, TData>;
  "is not equal": TemplateValue<string | number | boolean | Date | null, TData>;
  "is greater than": TemplateValue<string | number | Date, TData>;
  "is less than": TemplateValue<string | number | Date, TData>;
  "is greater than or equal": TemplateValue<string | number | Date, TData>;
  "is less than or equal": TemplateValue<string | number | Date, TData>;
  in:
    | (string | number | boolean | Record<string, unknown> | null)[]
    | TemplateValue<
        (string | number | boolean | Record<string, unknown> | null)[],
        TData
      >;
  "not in":
    | (string | number | boolean | Record<string, unknown> | null)[]
    | TemplateValue<
        (string | number | boolean | Record<string, unknown> | null)[],
        TData
      >;
  contains: TemplateValue<string, TData>;
  "not contains": TemplateValue<string, TData>;
  "contains any": string[] | TemplateValue<string[], TData>;
  "not contains any": string[] | TemplateValue<string[], TData>;
  matches: TemplateValue<RegexPattern, TData>;
  "not matches": TemplateValue<RegexPattern, TData>;
  "is between numbers":
    | [number, number]
    | TemplateValue<[number, number], TData>;
  "is between dates":
    | [Date, Date]
    | TemplateValue<[Date, Date], TData>;
  "is not between numbers":
    | [number, number]
    | TemplateValue<[number, number], TData>;
  "is not between dates":
    | [Date, Date]
    | TemplateValue<[Date, Date], TData>;
  "is before": TemplateValue<string | number | Date, TData>;
  "is after": TemplateValue<string | number | Date, TData>;
  "is on or before": TemplateValue<string | number | Date, TData>;
  "is on or after": TemplateValue<string | number | Date, TData>;
  "starts with": TemplateValue<string, TData>;
  "ends with": TemplateValue<string, TData>;
  "array contains": TemplateValue<
    string | number | boolean | Record<string, unknown> | null,
    TData
  >;
  "array no contains": TemplateValue<
    string | number | boolean | Record<string, unknown> | null,
    TData
  >;
  // Simple math validators (no configuration needed)
  "is even": null;
  "is odd": null;
  "is positive": null;
  "is negative": null;
  "is empty": null;
  "is not empty": null;
  // Advanced validators with configuration
  "is valid email": EmailValidationConfig | null;
  "is valid phone": PhoneValidationConfig | TemplateValue<PhoneValidationConfig, TData>;
  "is URL": URLValidationConfig | TemplateValue<URLValidationConfig, TData>;
  "is UUID": UUIDValidationConfig | TemplateValue<UUIDValidationConfig, TData>;
  "is EAN": null;
  "is IMEI": IMEIValidationConfig | TemplateValue<IMEIValidationConfig, TData>;
  "is unit": UnitType | TemplateValue<UnitType, TData>;
  "is country": CountryValidationConfig | TemplateValue<CountryValidationConfig, TData>;
  "is domain": DomainValidationConfig | TemplateValue<DomainValidationConfig, TData>;
};

/**
 * Utility type to extract all possible property paths from a type, including nested paths with dot notation.
 * Example: { name: string, profile: { age: number } } -> "name" | "profile" | "profile.age"
 */
export type PropertyPath<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? T[K] extends any[]
            ? K // Arrays are treated as terminal nodes
            : K | `${K}.${PropertyPath<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

/**
 * Helper type to detect if a type is exactly 'any'
 */
type IsAny<T> = 0 extends 1 & T ? true : false;

export interface Constraint<
  TData = any,
  TOperator extends Operator = Operator
> {
  field: IsAny<TData> extends true ? string : PropertyPath<TData>;
  operator: TOperator;
  value: TOperator extends keyof OperatorValueMap<TData>
    ? OperatorValueMap<TData>[TOperator]
    : never;
}

export interface Condition<TData = any, TResult = any> {
  any?: (Constraint<TData> | Condition<TData, TResult>)[];
  all?: (Constraint<TData> | Condition<TData, TResult>)[];
  none?: (Constraint<TData> | Condition<TData, TResult>)[];
  result?: TResult;
}

export interface Rule<TData = any, TResult = any> {
  conditions: Condition<TData, TResult> | Condition<TData, TResult>[];
  default?: TResult;
}
