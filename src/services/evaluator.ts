import { TemplateParser } from "./template-parser";
import { ObjectDiscovery } from "./object-discovery";
import {
  Rule,
  Condition,
  Constraint,
  WithRequired,
  RegexPattern,
  ConditionType,
} from "../types";

export class Evaluator {
  #objectDiscovery: ObjectDiscovery = new ObjectDiscovery();
  #templateParser: TemplateParser = new TemplateParser();

  /** Stores any results from nested conditions */
  #nestedResults: any[];

  /**
   * Evaluates a rule against a set of criteria and returns the result.
   * If the criteria is an array (indicating multiple criteria to test),
   * the rule will be evaluated against each item in the array and
   * an array of results will be returned.
   *
   * @param rule The rule to evaluate.
   * @param criteria The criteria to evaluate the rule against.
   */
  evaluate<T>(rule: Rule, criteria: object | object[]): T | boolean {
    if (criteria instanceof Array) {
      const result: T | boolean[] = [];
      for (const c of criteria) {
        // Clear any previous sub-results.
        this.#nestedResults = [];
        result.push(this.#evaluateRule(rule.conditions, c, rule?.default));
      }

      return this.#nestedResults.length
        ? this.#nestedResults[0]
        : (result as T | boolean);
    }

    // Clear any previous sub-results.
    this.#nestedResults = [];

    const e = this.#evaluateRule<T>(rule.conditions, criteria, rule?.default);
    return this.#nestedResults.length ? this.#nestedResults[0] : e;
  }

  /**
   * Evaluates a rule against a set of criteria and returns the result.
   * @param conditions The conditions to evaluate.
   * @param criteria The criteria to evaluate the conditions against.
   * @param defaultResult The default result to return if no conditions pass.
   * @param isSubRule Indicates whether the rule is a sub-rule.
   */
  #evaluateRule<T>(
    conditions: Condition | Condition[],
    criteria: object,
    defaultResult?: any,
    isSubRule = false
  ): T | boolean {
    // Cater for the case where the conditions property is not an array.
    conditions = conditions instanceof Array ? conditions : [conditions];

    // We should evaluate all conditions and return the result
    // of the first condition that passes.
    for (const condition of conditions) {
      const result = this.#evaluateCondition(condition, criteria);
      if (result) return isSubRule ? true : condition?.result ?? true;
    }

    // If no conditions pass, we should return the default result of
    // the rule or false if no default result is provided.
    return defaultResult ?? false;
  }

  /**
   * Evaluates a condition against a set of criteria and returns the result.
   * Uses recursion to evaluate nested conditions.
   * @param condition The condition to evaluate.
   * @param criteria The criteria to evaluate the condition against.
   */
  #evaluateCondition(condition: Condition, criteria: object): boolean {
    // The condition must have an 'any' or 'all' property.
    const type = this.#objectDiscovery.conditionType(condition);
    if (!type) return false;

    // If the condition has nested results
    this.#processNestedResults(condition, criteria, type);

    // Set the starting result
    let result: boolean | undefined = undefined;

    // Check each node in the condition.
    for (const node of condition[type]) {
      // Ignore sub-rules when evaluating the condition.
      if (this.#objectDiscovery.isConditionWithResult(node)) continue;

      let fn: () => boolean;
      if (this.#objectDiscovery.isCondition(node))
        fn = () => this.#evaluateCondition(node, criteria);
      if (this.#objectDiscovery.isConstraint(node))
        fn = () => this.#checkConstraint(node, criteria);

      // Process the node
      result = this.#accumulate(type, fn, result);
    }

    return result;
  }

  /**
   * Processes a sub-rule within a condition. It evaluates the condition's constraints to
   * determine if the sub-rule should be evaluated. If the constraints pass, the sub-rule
   * is evaluated and the result (if any) is stored in the sub-rule results array.
   * @param condition The parent condition to process.
   * @param criteria The criteria to evaluate the condition against.
   * @param type The parent condition type.
   */
  #processNestedResults(
    condition: Condition,
    criteria: object,
    type: ConditionType
  ) {
    // Find all the nested conditions which have results
    const candidates = condition[type].filter((node) =>
      this.#objectDiscovery.isConditionWithResult(node)
    ) as WithRequired<Condition, "result">[];

    // For each candidate, check if all the sibling
    // conditions and constraints pass
    candidates.forEach((candidate) => {
      let siblingsPass: boolean | undefined = undefined;
      for (const node of condition[type]) {
        if (this.#objectDiscovery.isConditionWithResult(node)) continue;

        if (this.#objectDiscovery.isCondition(node)) {
          siblingsPass = this.#accumulate(
            type,
            () => this.#evaluateCondition(node, criteria),
            siblingsPass
          );
        }

        if (this.#objectDiscovery.isConstraint(node)) {
          siblingsPass = this.#accumulate(
            type,
            () => this.#checkConstraint(node, criteria),
            siblingsPass
          );
        }
      }

      if (!siblingsPass) return;

      // Evaluate the sub-rule
      const passed = this.#evaluateRule(candidate, criteria, false, true);

      if (passed) this.#nestedResults.push(candidate.result);
    });
  }

  /**
   * Accumulates the result of a function based on the condition type.
   * @param type The condition type.
   * @param fn The function to evaluate.
   * @param result The value to start accumulating from.
   */
  #accumulate(
    type: ConditionType,
    fn: () => boolean,
    result?: boolean
  ): boolean {
    result = undefined === result ? ["all", "none"].includes(type) : result;

    switch (type) {
      case "any":
        result = result || fn();
        break;
      case "all":
        result = result && fn();
        break;
      case "none":
        result = result && !fn();
    }

    return result;
  }

  /**
   * Creates a RegExp from a constraint value, supporting both string patterns and RegexPattern objects.
   * @param value The constraint value which can be a string or RegexPattern object.
   */
  #createRegExp(value: RegexPattern): RegExp {
    if (value && typeof value === "object" && "regex" in value) {
      return new RegExp(value.regex, value.flags || "");
    }
    throw new Error(
      "Invalid regex pattern format - must be a RegexPattern object"
    );
  }

  /**
   * Checks if a value is between two numbers or dates (inclusive)
   * @param value The value to check
   * @param range Array with min and max values
   */
  #isBetween(value: any, range: any): boolean {
    if (!Array.isArray(range) || range.length !== 2) return false;
    const [min, max] = range;

    // Check for number range
    if (
      typeof value === "number" &&
      typeof min === "number" &&
      typeof max === "number"
    ) {
      return value >= min && value <= max;
    }

    // Check for date range
    if (value instanceof Date && min instanceof Date && max instanceof Date) {
      return value >= min && value <= max;
    }

    return false;
  }

  /**
   * Checks if a date is before another date
   * @param a First date
   * @param b Second date
   */
  #isBefore(a: any, b: any): boolean {
    return a instanceof Date && b instanceof Date && a < b;
  }

  /**
   * Checks if a date is after another date
   * @param a First date
   * @param b Second date
   */
  #isAfter(a: any, b: any): boolean {
    return a instanceof Date && b instanceof Date && a > b;
  }

  /**
   * Checks if a date is on or before another date
   * @param a First date
   * @param b Second date
   */
  #isOnOrBefore(a: any, b: any): boolean {
    return a instanceof Date && b instanceof Date && a <= b;
  }

  /**
   * Checks if a date is on or after another date
   * @param a First date
   * @param b Second date
   */
  #isOnOrAfter(a: any, b: any): boolean {
    return a instanceof Date && b instanceof Date && a >= b;
  }

  /**
   * Checks if a string starts with another string
   * @param a String to check
   * @param b Prefix to check for
   */
  #startsWith(a: any, b: any): boolean {
    return typeof a === "string" && typeof b === "string" && a.startsWith(b);
  }

  /**
   * Checks if a string ends with another string
   * @param a String to check
   * @param b Suffix to check for
   */
  #endsWith(a: any, b: any): boolean {
    return typeof a === "string" && typeof b === "string" && a.endsWith(b);
  }

  /**
   * Checks if an array contains a specific value
   * @param array Array to check
   * @param value Value to check for
   */
  #arrayContains(array: any, value: any): boolean {
    return Array.isArray(array) && array.includes(value);
  }

  /**
   * Checks a constraint against a set of criteria and returns true whenever the constraint passes.
   * @param constraint The constraint to evaluate.
   * @param criteria The criteria to evaluate the constraint with.
   */
  #checkConstraint(constraint: Constraint, criteria: object): boolean {
    // If the value contains '.' we should assume it is a nested property
    const criterion = constraint.field.includes(".")
      ? this.#objectDiscovery.resolveNestedProperty(constraint.field, criteria)
      : criteria[constraint.field];

    // If the criteria object does not have the field we are looking for,
    // we should return false UNLESS it's an "empty" check operator
    if (undefined === criterion && !["is empty", "is not empty"].includes(constraint.operator)) {
      return false;
    }

    // Resolve template variables in the constraint value
    const resolvedValue = this.#templateParser.resolveTemplateValue(
      constraint.value,
      criteria
    );

    switch (constraint.operator) {
      case "is equal":
        return criterion == resolvedValue;
      case "is not equal":
        return criterion != resolvedValue;
      case "is greater than":
        return criterion > resolvedValue;
      case "is greater than or equal":
        return criterion >= resolvedValue;
      case "is less than":
        return criterion < resolvedValue;
      case "is less than or equal":
        return criterion <= resolvedValue;
      case "in":
        return (
          Array.isArray(resolvedValue) &&
          resolvedValue.includes(criterion as never)
        );
      case "not in":
        return (
          !Array.isArray(resolvedValue) ||
          !resolvedValue.includes(criterion as never)
        );
      case "contains":
        return (
          typeof criterion === "string" &&
          typeof resolvedValue === "string" &&
          criterion.includes(resolvedValue)
        );
      case "not contains":
        return (
          typeof criterion === "string" &&
          typeof resolvedValue === "string" &&
          !criterion.includes(resolvedValue)
        );
      case "contains any":
        return (
          typeof criterion === "string" &&
          Array.isArray(resolvedValue) &&
          resolvedValue.some(
            (x) => typeof x === "string" && criterion.includes(x)
          )
        );
      case "not contains any":
        return (
          typeof criterion === "string" &&
          Array.isArray(resolvedValue) &&
          !resolvedValue.some(
            (x) => typeof x === "string" && criterion.includes(x)
          )
        );
      case "matches":
        return this.#createRegExp(resolvedValue as RegexPattern).test(
          `${criterion}`
        );
      case "not matches":
        return !this.#createRegExp(resolvedValue as RegexPattern).test(
          `${criterion}`
        );
      case "is between numbers":
        return this.#isBetweenNumbers(criterion, resolvedValue);
      case "is between dates":
        return this.#isBetweenDates(criterion, resolvedValue);
      case "is not between numbers":
        return !this.#isBetweenNumbers(criterion, resolvedValue);
      case "is not between dates":
        return !this.#isBetweenDates(criterion, resolvedValue);
      case "is before":
        return this.#isBefore(criterion, resolvedValue);
      case "is after":
        return this.#isAfter(criterion, resolvedValue);
      case "is on or before":
        return this.#isOnOrBefore(criterion, resolvedValue);
      case "is on or after":
        return this.#isOnOrAfter(criterion, resolvedValue);
      case "starts with":
        return this.#startsWith(criterion, resolvedValue);
      case "ends with":
        return this.#endsWith(criterion, resolvedValue);
      case "array contains":
        return this.#arrayContains(criterion, resolvedValue);
      case "array no contains":
        return !this.#arrayContains(criterion, resolvedValue);
      // Math validators
      case "is even":
        return typeof criterion === "number" && Number.isFinite(criterion) && criterion % 2 === 0;
      case "is odd":
        return typeof criterion === "number" && Number.isFinite(criterion) && criterion % 2 !== 0;
      case "is positive":
        return typeof criterion === "number" && Number.isFinite(criterion) && criterion > 0;
      case "is negative":
        return typeof criterion === "number" && Number.isFinite(criterion) && criterion < 0;
      // Empty validators
      case "is empty":
        return this.#isEmpty(criterion);
      case "is not empty":
        return !this.#isEmpty(criterion);
      default:
        throw new Error(`Unknown operator: ${constraint.operator}`);
    }
  }

  // Add these helper methods for DRYness
  #isBetweenNumbers(value: any, range: any): boolean {
    if (!Array.isArray(range) || range.length !== 2) return false;
    const [min, max] = range;
    return (
      typeof value === "number" &&
      typeof min === "number" &&
      typeof max === "number" &&
      value >= min && value <= max
    );
  }

  #isBetweenDates(value: any, range: any): boolean {
    if (!Array.isArray(range) || range.length !== 2) return false;
    const [min, max] = range;
    return (
      value instanceof Date &&
      min instanceof Date &&
      max instanceof Date &&
      value >= min && value <= max
    );
  }

  #isEmpty(value: any): boolean {
    // null or undefined
    if (value === null || value === undefined) {
      return true;
    }
    
    // Empty string (but not zero)
    if (typeof value === "string" && value === "") {
      return true;
    }
    
    // Empty array
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    
    // All other values (including 0, false, empty objects) are not empty
    return false;
  }
}
