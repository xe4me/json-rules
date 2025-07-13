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
  | "isBetween"
  | "isNotBetween"
  | "isBefore"
  | "isAfter"
  | "isOnOrBefore"
  | "isOnOrAfter"
  | "startsWith"
  | "endsWith"
  | "arrayContains"
  | "arrayNotContains";

export interface RegexPattern {
  regex: string;
  flags?: string;
}

/**
 * Maps operators to their expected value types
 */
export type OperatorValueMap = {
  "==": string | number | boolean | Date | null;
  "!=": string | number | boolean | Date | null;
  ">": string | number | Date;
  "<": string | number | Date;
  ">=": string | number | Date;
  "<=": string | number | Date;
  "in": (string | number | boolean | Record<string, unknown> | null)[];
  "not in": (string | number | boolean | Record<string, unknown> | null)[];
  "contains": string;
  "not contains": string;
  "contains any": string | string[];
  "not contains any": string | string[];
  "matches": string | RegexPattern;
  "not matches": string | RegexPattern;
  "isBetween": [number, number] | [Date, Date];
  "isNotBetween": [number, number] | [Date, Date];
  "isBefore": string | number | Date;
  "isAfter": string | number | Date;
  "isOnOrBefore": string | number | Date;
  "isOnOrAfter": string | number | Date;
  "startsWith": string;
  "endsWith": string;
  "arrayContains": string | number | boolean | Record<string, unknown> | null;
  "arrayNotContains": string | number | boolean | Record<string, unknown> | null;
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

export interface Constraint<TData = any, TOperator extends Operator = Operator> {
  field: IsAny<TData> extends true ? string : PropertyPath<TData>;
  operator: TOperator;
  value: TOperator extends keyof OperatorValueMap ? OperatorValueMap[TOperator] : never;
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
