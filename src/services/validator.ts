import { ObjectDiscovery } from "./object-discovery";
import { Rule, Operator, Condition, Constraint } from "../types";

export interface ValidationResult {
  isValid: boolean;
  error?: {
    message: string;
    element: object;
  };
}

export class Validator {
  #objectDiscovery: ObjectDiscovery = new ObjectDiscovery();

  /**
   * Takes in a rule as a parameter and returns a boolean indicating whether the rule is valid or not.
   * @param rule The rule to validate.
   */
  validate(rule: Rule): ValidationResult {
    // Assume the rule is valid.
    const result: ValidationResult = { isValid: true };

    // Check the rule is a valid JSON
    if (!this.#objectDiscovery.isObject(rule)) {
      return {
        isValid: false,
        error: {
          message: "The rule must be a valid JSON object.",
          element: rule,
        },
      };
    }

    // Cater for the case where the conditions property is not an array.
    const conditions =
      rule.conditions instanceof Array ? rule.conditions : [rule.conditions];

    // Validate the 'conditions' property.
    if (
      conditions.length === 0 ||
      (this.#objectDiscovery.isObject(conditions[0]) &&
        !Object.keys(conditions[0]).length)
    ) {
      return {
        isValid: false,
        error: {
          message:
            "The conditions property must contain at least one condition.",
          element: rule,
        },
      };
    }

    // Validate each condition in the rule.
    for (const condition of conditions) {
      const subResult = this.#validateCondition(condition);
      result.isValid = result.isValid && subResult.isValid;
      result.error = result?.error ?? subResult?.error;
    }

    return result;
  }

  /**
   * Evaluates a condition to ensure it is syntactically correct.
   * @param condition The condition to validate.
   * @param depth The current recursion depth
   */
  #validateCondition(
    condition: Condition,
    depth: number = 0
  ): ValidationResult {
    // Check to see if the condition is valid.
    const result = this.#isValidCondition(condition);
    if (!result.isValid) return result;

    // Set the type of condition.
    const type = this.#objectDiscovery.conditionType(condition);

    // Check if the condition is iterable
    if (!Array.isArray(condition[type])) {
      return {
        isValid: false,
        error: {
          message: `The condition '${type}' should be iterable.`,
          element: condition,
        },
      };
    }

    // Check if the condition is iterable
    if (!condition[type].length) {
      return {
        isValid: false,
        error: {
          message: `The condition '${type}' should not be empty.`,
          element: condition,
        },
      };
    }

    // Validate each item in the condition.
    for (const node of condition[type]) {
      // The object should be a condition or constraint.
      const isCondition = this.#objectDiscovery.isCondition(node);
      if (isCondition) {
        const subResult = this.#validateCondition(node as Condition, depth + 1);
        result.isValid = result.isValid && subResult.isValid;
        result.error = result?.error ?? subResult?.error;
      }

      const isConstraint = this.#objectDiscovery.isConstraint(node);
      if (isConstraint) {
        const subResult = this.#validateConstraint(node as Constraint);
        result.isValid = result.isValid && subResult.isValid;
        result.error = result?.error ?? subResult?.error;
      }

      if (!isConstraint && !isCondition) {
        return {
          isValid: false,
          error: {
            message: "Each node should be a condition or a constraint.",
            element: node,
          },
        };
      }

      // If any part fails validation there is no point to continue.
      if (!result.isValid) break;
    }

    return result;
  }

  /**
   * Validates a regex pattern value, supporting both string patterns and RegexPattern objects.
   * @param value The value to validate as a regex pattern.
   */
  #validateRegexPattern(value: any): { isValid: boolean; error?: string } {
    if (typeof value === "string") {
      try {
        new RegExp(value);
        return { isValid: true };
      } catch (e) {
        return { isValid: false, error: "Invalid regular expression pattern" };
      }
    }

    if (value && typeof value === "object" && "regex" in value) {
      if (typeof value.regex !== "string") {
        return { isValid: false, error: "RegexPattern.regex must be a string" };
      }

      if (value.flags !== undefined && typeof value.flags !== "string") {
        return { isValid: false, error: "RegexPattern.flags must be a string" };
      }

      try {
        new RegExp(value.regex, value.flags || "");
        return { isValid: true };
      } catch (e) {
        return {
          isValid: false,
          error: "Invalid regular expression pattern or flags",
        };
      }
    }

    return {
      isValid: false,
      error: "Value must be a string or RegexPattern object",
    };
  }

  /**
   * Checks a constraint to ensure it is syntactically correct.
   * @param constraint The constraint to validate.
   */
  #validateConstraint(constraint: Constraint): ValidationResult {
    if ("string" !== typeof constraint.field) {
      return {
        isValid: false,
        error: {
          message: 'Constraint "field" must be of type string.',
          element: constraint,
        },
      };
    }

    const operators: Operator[] = [
      "==",
      "!=",
      ">",
      "<",
      ">=",
      "<=",
      "in",
      "not in",
      "contains",
      "not contains",
      "contains any",
      "not contains any",
      "matches",
      "not matches",
      "is between",
      "is not between",
      "is before",
      "is after",
      "is on or before",
      "is on or after",
      "starts with",
      "ends with",
      "array contains",
      "array no contains",
    ];
    if (!operators.includes(constraint.operator as Operator)) {
      return {
        isValid: false,
        error: {
          message: 'Constraint "operator" has invalid type.',
          element: constraint,
        },
      };
    }

    if (
      constraint.value === null &&
      !(
        [
          "==",
          "!=",
          "contains",
          "not contains",
          "array contains",
          "array no contains",
        ] as Operator[]
      ).includes(constraint.operator)
    ) {
      return {
        isValid: false,
        error: {
          message:
            '"operator" must be in ["==", "!=", "contains", "not contains", "array contains", "array no contains"] if "value" is null.',
          element: constraint,
        },
      };
    }

    // We must check that the value is an array if the operator is 'in' or 'not in'.
    if (
      ["in", "not in", "contains any", "not contains any"].includes(
        constraint.operator
      ) &&
      !Array.isArray(constraint.value)
    ) {
      return {
        isValid: false,
        error: {
          message:
            'Constraint "value" must be an array if the "operator" is in ["in", "not in", "contains any", "not contains any"]',
          element: constraint,
        },
      };
    }

    if (["matches", "not matches"].includes(constraint.operator)) {
      const regexValidation = this.#validateRegexPattern(constraint.value);
      if (!regexValidation.isValid) {
        return {
          isValid: false,
          error: {
            message: `Constraint "value" must be a valid regular expression or RegexPattern object if the "operator" is in ["matches", "not matches"]. ${regexValidation.error}`,
            element: constraint,
          },
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Checks an object to see if it is a valid condition.
   * @param obj The object to check.
   */
  #isValidCondition(obj: any): ValidationResult {
    // Otherwise, the object should be a condition.
    if (!this.#objectDiscovery.isCondition(obj)) {
      return {
        isValid: false,
        error: {
          message: "Invalid condition structure.",
          element: obj,
        },
      };
    }

    const isAny = "any" in obj;
    const isAll = "all" in obj;
    const isNone = "none" in obj;

    // A valid condition must have an 'any', 'all', or 'none' property,
    // but cannot have more than one.
    if ((isAny && isAll) || (isAny && isNone) || (isAll && isNone)) {
      return {
        isValid: false,
        error: {
          message:
            'A condition cannot have more than one "any", "all", or "none" property.',
          element: obj,
        },
      };
    }

    return { isValid: true };
  }
}
