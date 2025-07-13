export type WithRequired<Type, Key extends keyof Type> = Type &
  Required<Pick<Type, Key>>;

export type ConditionType = "any" | "all" | "none";
export type Operator =
  | "=="
  | "!="
  | ">"
  | "<"
  | ">="
  | "<="
  | "in"
  | "not in"
  | "contains"
  | "not contains"
  | "contains any"
  | "not contains any"
  | "matches"
  | "not matches"
  | "'is between'"
  | "is between"
  | "is not between"
  | "is before"
  | "is after"
  | "is on or before"
  | "is on or after"
  | "starts with"
  | "ends with"
  | "array contains"
  | "array no contains";

export interface RegexPattern {
  regex: string;
  flags?: string;
}

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
  "==": TemplateValue<string | number | boolean | Date | null, TData>;
  "!=": TemplateValue<string | number | boolean | Date | null, TData>;
  ">": TemplateValue<string | number | Date, TData>;
  "<": TemplateValue<string | number | Date, TData>;
  ">=": TemplateValue<string | number | Date, TData>;
  "<=": TemplateValue<string | number | Date, TData>;
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
  "is between":
    | [number, number]
    | [Date, Date]
    | TemplateValue<[number, number] | [Date, Date], TData>;
  "is not between":
    | [number, number]
    | [Date, Date]
    | TemplateValue<[number, number] | [Date, Date], TData>;
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
