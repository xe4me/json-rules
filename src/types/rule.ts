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

export type UnitType =
  | "length"
  | "mass"
  | "volume"
  | "temperature"
  | "time"
  | "area"
  | "energy"
  | "pressure"
  | "speed"
  | "force"
  | "power"
  | "frequency";

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

/**
 * Discriminated union for constraints based on operator type
 */
export type Constraint<TData = any> =
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator:
        | "is even"
        | "is odd"
        | "is positive"
        | "is negative"
        | "is empty"
        | "is not empty"
        | "is EAN";
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "is IMEI";
      value?: IMEIValidationConfig | TemplateValue<IMEIValidationConfig, TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "is domain";
      value?:
        | DomainValidationConfig
        | TemplateValue<DomainValidationConfig, TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "is valid email";
      value?:
        | EmailValidationConfig
        | TemplateValue<EmailValidationConfig, TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "is equal" | "is not equal";
      value: TemplateValue<string | number | boolean | Date | null, TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator:
        | "is greater than"
        | "is less than"
        | "is greater than or equal"
        | "is less than or equal"
        | "is before"
        | "is after"
        | "is on or before"
        | "is on or after";
      value: TemplateValue<string | number | Date, TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "in" | "not in";
      value:
        | (string | number | boolean | Record<string, unknown> | null)[]
        | TemplateValue<
            (string | number | boolean | Record<string, unknown> | null)[],
            TData
          >;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "contains" | "not contains" | "starts with" | "ends with";
      value: TemplateValue<string, TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "contains any" | "not contains any";
      value: string[] | TemplateValue<string[], TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "matches" | "not matches";
      value: TemplateValue<RegexPattern, TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "is between numbers" | "is not between numbers";
      value: [number, number] | TemplateValue<[number, number], TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "is between dates" | "is not between dates";
      value: [Date, Date] | TemplateValue<[Date, Date], TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "array contains" | "array no contains";
      value: TemplateValue<
        string | number | boolean | Record<string, unknown> | null,
        TData
      >;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "is valid phone";
      value:
        | PhoneValidationConfig
        | TemplateValue<PhoneValidationConfig, TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "is URL";
      value: URLValidationConfig | TemplateValue<URLValidationConfig, TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "is UUID";
      value: UUIDValidationConfig | TemplateValue<UUIDValidationConfig, TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "is unit";
      value: UnitType | TemplateValue<UnitType, TData>;
    }
  | {
      field: IsAny<TData> extends true ? string : PropertyPath<TData>;
      operator: "is country";
      value:
        | CountryValidationConfig
        | TemplateValue<CountryValidationConfig, TData>;
    };

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
