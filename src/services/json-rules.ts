import { Builder } from "../builder";
import { RuleError } from "../errors";
import { Evaluator } from "./evaluator";
import { Validator, ValidationResult } from "./validator";
import { Rule, Constraint } from "../types";

export class JsonRules {
  static #jsonRules = new JsonRules();

  #validator: Validator = new Validator();
  #evaluator: Evaluator = new Evaluator();

  /**
   * Returns a rule builder class instance.
   * Allows for the construction of rules using a fluent interface.
   */
  builder(): Builder {
    return new Builder(this.#validator);
  }

  /**
   * Evaluates a rule against a set of criteria and returns the result.
   * If the criteria is an array (indicating multiple criteria to test),
   * the rule will be evaluated against each item in the array and
   * an array of results will be returned.
   *
   * @param rule The rule to evaluate.
   * @param criteria The criteria to evaluate the rule against.
   * @param trustRule Set true to avoid validating the rule before evaluating it (faster).
   * @throws RuleError if the rule is invalid.
   */
  async evaluate<T>(
    rule: Rule,
    criteria: object | object[],
    trustRule = false
  ): Promise<T | boolean> {
    // Before we evaluate the rule, we should validate it.
    // If `trustRuleset` is set to true, we will skip validation.
    const validationResult = !trustRule && this.validate(rule);
    if (!trustRule && !validationResult.isValid) {
      throw new RuleError(validationResult);
    }

    return this.#evaluator.evaluate<T>(rule, criteria);
  }

  /**
   * Takes in a rule as a parameter and returns a ValidationResult
   * indicating whether the rule is valid or not.
   *
   * Invalid rules will contain an error property which contains a message and the element
   * that caused the validation to fail.
   *
   * @param rule The rule to validate.
   */
  validate(rule: Rule): ValidationResult {
    return this.#validator.validate(rule);
  }

  /**
   * Returns a rule builder class instance.
   * Allows for the construction of rules using a fluent interface.
   */
  static builder(): Builder {
    return this.#jsonRules.builder();
  }

  /**
   * Evaluates a rule against a set of criteria and returns the result.
   * If the criteria is an array (indicating multiple criteria to test),
   * the rule will be evaluated against each item in the array and
   * an array of results will be returned.
   *
   * @param rule The rule to evaluate.
   * @param criteria The criteria to evaluate the rule against.
   * @param trustRule Set true to avoid validating the rule before evaluating it (faster).
   * @throws RuleError if the rule is invalid.
   */
  static async evaluate<T>(
    rule: Rule,
    criteria: object | object[],
    trustRule = false
  ): Promise<T | boolean> {
    return JsonRules.#jsonRules.evaluate<T>(rule, criteria, trustRule);
  }

  /**
   * Takes in a rule as a parameter and returns a ValidationResult
   * indicating whether the rule is valid or not.
   *
   * Invalid rules will contain an error property which contains a message and the element
   * that caused the validation to fail.
   *
   * @param rule The rule to validate.
   */
  static validate(rule: Rule): ValidationResult {
    return JsonRules.#jsonRules.validate(rule);
  }
}
