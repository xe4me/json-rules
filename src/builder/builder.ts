import { RuleError } from "../errors";
import { Validator } from "../services";
import { Rule, Operator, Condition, Constraint, ConditionType } from "../types";

export class Builder {
  constructor(validator: Validator) {
    this.#validator = validator;
  }

  /** Stores the rule being constructed */
  #rule: Rule = { conditions: [] };

  /** Holds a reference to the Validator class */
  #validator: Validator;

  /**
   * Adds an "all" condition with the given constraints
   * @param nodes The constraints of the condition
   */
  all(...nodes: (Constraint | Condition)[]): Builder {
    this.#addCondition("all", nodes);
    return this;
  }

  /**
   * Adds an "any" condition with the given constraints
   * @param nodes The constraints of the condition
   */
  any(...nodes: (Constraint | Condition)[]): Builder {
    this.#addCondition("any", nodes);
    return this;
  }

  /**
   * Adds a "none" condition with the given constraints
   * @param nodes The constraints of the condition
   */
  none(...nodes: (Constraint | Condition)[]): Builder {
    this.#addCondition("none", nodes);
    return this;
  }

  /**
   * Creates a constraint with the given field, operator and optional value
   * @param field The field to check
   * @param operator The operator to apply to the field
   * @param value The value to compare the field to (optional for some operators)
   */
  constraint(field: string, operator: Operator, value?: any): Constraint {
    if (value === undefined) {
      return { field, operator } as Constraint;
    }
    return { field, operator, value } as Constraint;
  }

  /**
   * Sets the default value of the rule being constructed
   * @param value The default value of the rule
   */
  default(value: Rule["default"]): Builder {
    this.#rule.default = value;
    return this;
  }

  /**
   * Adds a node (in the root) to the rule being constructed
   * @param node The node to add to the rule
   */
  add(node: Condition): Builder {
    (this.#rule.conditions as Condition[]).push(node);
    return this;
  }

  /**
   * Creates a new condition node
   * @param type The type of condition
   * @param nodes Any child nodes of the condition
   * @param result The result of the condition node (for granular rules)
   */
  condition(
    type: ConditionType,
    nodes: Condition[ConditionType],
    result?: Condition["result"]
  ): Condition {
    return {
      [type]: nodes,
      ...(result ? { result } : {}),
    };
  }

  /**
   * Builds the rule being and returns it
   * @param validate Whether to validate the rule before returning it
   * @throws Error if validation is enabled and the rule is invalid
   */
  build(validate?: boolean): Rule {
    if (!validate) return this.#rule;

    const validationResult = this.#validator.validate(this.#rule);
    if (validationResult.isValid) return this.#rule;

    throw new RuleError(validationResult);
  }

  #addCondition(type: ConditionType, nodes: (Constraint | Condition)[]): void {
    const condition: Condition = { [type]: nodes };

    if (Array.isArray(this.#rule.conditions)) {
      this.#rule.conditions.push(condition);
    } else {
      this.#rule.conditions = [this.#rule.conditions, condition];
    }
  }
}
