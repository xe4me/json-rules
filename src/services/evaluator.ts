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
  #createRegExp(value: string | RegexPattern): RegExp {
    if (typeof value === "string") {
      return new RegExp(value);
    }
    if (value && typeof value === "object" && "regex" in value) {
      return new RegExp(value.regex, value.flags || "");
    }
    throw new Error("Invalid regex pattern format");
  }

  /**
   * Checks if a value is between two numbers (inclusive)
   * @param value The value to check
   * @param range Array with min and max values
   */
  #isBetween(value: any, range: any): boolean {
    if (!Array.isArray(range) || range.length !== 2) return false;
    const [min, max] = range;
    return typeof value === "number" && 
           typeof min === "number" && 
           typeof max === "number" &&
           value >= min && value <= max;
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

    // If the criteria object does not have the field
    // we are looking for, we should return false.
    if (undefined === criterion) {
      return false;
    }

    switch (constraint.operator) {
      case "==":
        return criterion == constraint.value;
      case "!=":
        return criterion != constraint.value;
      case ">":
        return criterion > constraint.value;
      case ">=":
        return criterion >= constraint.value;
      case "<":
        return criterion < constraint.value;
      case "<=":
        return criterion <= constraint.value;
      case "in":
        return (
          Array.isArray(constraint.value) &&
          constraint.value.includes(criterion as never)
        );
      case "not in":
        return (
          !Array.isArray(constraint.value) ||
          !constraint.value.includes(criterion as never)
        );
      case "contains":
        return (
          typeof criterion === "string" &&
          typeof constraint.value === "string" &&
          criterion.includes(constraint.value)
        );
      case "not contains":
        return (
          typeof criterion !== "string" ||
          typeof constraint.value !== "string" ||
          !criterion.includes(constraint.value)
        );
      case "contains any":
        return (
          typeof criterion === "string" &&
          Array.isArray(constraint.value) &&
          constraint.value.some((x) => 
            typeof x === "string" && criterion.includes(x)
          )
        );
      case "not contains any":
        return (
          typeof criterion !== "string" ||
          !Array.isArray(constraint.value) ||
          !constraint.value.some((x) => 
            typeof x === "string" && criterion.includes(x)
          )
        );
      case "matches":
        return this.#createRegExp(
          constraint.value as string | RegexPattern
        ).test(`${criterion}`);
      case "not matches":
        return !this.#createRegExp(
          constraint.value as string | RegexPattern
        ).test(`${criterion}`);
      case "isBetween":
        return this.#isBetween(criterion, constraint.value);
      case "isNotBetween":
        return !this.#isBetween(criterion, constraint.value);
      case "isBefore":
        return this.#isBefore(criterion, constraint.value);
      case "isAfter":
        return this.#isAfter(criterion, constraint.value);
      case "isOnOrBefore":
        return this.#isOnOrBefore(criterion, constraint.value);
      case "isOnOrAfter":
        return this.#isOnOrAfter(criterion, constraint.value);
      case "startsWith":
        return this.#startsWith(criterion, constraint.value);
      case "endsWith":
        return this.#endsWith(criterion, constraint.value);
      case "arrayContains":
        return this.#arrayContains(criterion, constraint.value);
      case "arrayNotContains":
        return !this.#arrayContains(criterion, constraint.value);
      default:
        return false;
    }
  }
}
