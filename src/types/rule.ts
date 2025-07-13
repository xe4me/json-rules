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
  | "not matches";

export interface RegexPattern {
  regex: string;
  flags?: string;
}

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

export interface Constraint<TData = any> {
  field: IsAny<TData> extends true ? string : PropertyPath<TData>;
  operator: Operator;
  value:
    | string
    | number
    | boolean
    | Record<string, unknown>
    | (string | number | boolean | Record<string, unknown>)[]
    | RegexPattern
    | null;
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
