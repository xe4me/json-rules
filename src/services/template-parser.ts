import { ObjectDiscovery } from "./object-discovery";

export interface TemplateVariable {
  name: string;
  fullMatch: string;
  startIndex: number;
  endIndex: number;
}

export class TemplateParser {
  #objectDiscovery: ObjectDiscovery = new ObjectDiscovery();

  private readonly TEMPLATE_REGEX = /(?<!\{)\{([^{}]+)\}(?!\})/g;

  /**
   * Checks if a value contains template syntax
   * @param value The value to check
   * @returns True if value contains template variables
   */
  hasTemplateVariables(value: any): boolean {
    if (typeof value !== "string") return false;
    // Reset regex lastIndex to avoid interference
    this.TEMPLATE_REGEX.lastIndex = 0;
    return this.TEMPLATE_REGEX.test(value);
  }

  /**
   * Extracts all template variables from a value
   * @param value The value to parse
   * @returns Array of template variables found
   */
  extractTemplateVariables(value: any): TemplateVariable[] {
    if (typeof value !== "string") return [];

    const variables: TemplateVariable[] = [];
    let match;

    // Reset regex lastIndex
    this.TEMPLATE_REGEX.lastIndex = 0;

    while ((match = this.TEMPLATE_REGEX.exec(value)) !== null) {
      variables.push({
        name: match[1],
        fullMatch: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    return variables;
  }

  /**
   * Resolves template variables in a value using provided criteria
   * @param value The value containing templates
   * @param criteria The criteria object to resolve field references from
   * @returns The resolved value with templates replaced
   */
  resolveTemplateValue(value: any, criteria: object): any {
    if (!this.hasTemplateVariables(value)) {
      return value;
    }

    const variables = this.extractTemplateVariables(value);

    // If the entire value is a single template variable, return the field value directly
    if (variables.length === 1 && variables[0].fullMatch === value) {
      const fieldValue = this.#resolveFieldValue(variables[0].name, criteria);
      return fieldValue !== undefined ? fieldValue : value;
    }

    // For multiple templates or templates within strings, convert to string
    let resolvedValue = value;

    // Replace templates from end to start to maintain correct indices
    for (let i = variables.length - 1; i >= 0; i--) {
      const variable = variables[i];
      const fieldValue = this.#resolveFieldValue(variable.name, criteria);

      // If field value is undefined, keep the template as-is (will be handled by validation)
      if (fieldValue === undefined) {
        continue;
      }

      resolvedValue =
        resolvedValue.substring(0, variable.startIndex) +
        fieldValue +
        resolvedValue.substring(variable.endIndex);
    }

    return resolvedValue;
  }

  /**
   * Validates that all template variables in a value exist in the criteria
   * @param value The value containing templates
   * @param criteria The criteria object to validate against
   * @returns Object with validation result and missing fields
   */
  validateTemplateVariables(
    value: any,
    criteria: object
  ): { isValid: boolean; missingFields: string[] } {
    const variables = this.extractTemplateVariables(value);
    const missingFields: string[] = [];

    for (const variable of variables) {
      const fieldValue = this.#resolveFieldValue(variable.name, criteria);
      if (fieldValue === undefined) {
        missingFields.push(variable.name);
      }
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Resolves a field value from criteria, supporting nested properties
   * @param fieldName The field name (can be nested like "profile.age")
   * @param criteria The criteria object
   * @returns The resolved field value or undefined if not found
   */
  #resolveFieldValue(fieldName: string, criteria: object): any {
    if (fieldName.includes(".")) {
      return this.#objectDiscovery.resolveNestedProperty(fieldName, criteria);
    }
    return criteria[fieldName];
  }
}
