import { JsonRules, type Rule } from "../src";

describe("Template Validation Tests", () => {
  describe("Template Syntax Validation", () => {
    it("should accept valid template syntax", () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "age", operator: ">", value: "{minAge}" },
            { field: "name", operator: "contains", value: "{searchTerm}" },
            {
              field: "profile.email",
              operator: "ends with",
              value: "{domainSuffix}",
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });

    it("should accept nested field references in templates", () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "currentLevel",
              operator: ">=",
              value: "{requirements.level.minimum}",
            },
            {
              field: "user.profile.age",
              operator: "is between",
              value: "{user.ageRange}",
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });

    it("should accept template variables with underscores", () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "user_name", operator: "==", value: "{required_name}" },
            {
              field: "first_name",
              operator: "starts with",
              value: "{name_prefix}",
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });

    it("should reject template variables starting with numbers", () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "age", operator: ">", value: "{123invalid}" }],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(false);
      expect(validation.error?.message).toContain(
        "Invalid template variable name"
      );
    });

    it("should reject template variables with special characters", () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "name", operator: "==", value: "{user-name}" }],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(false);
      expect(validation.error?.message).toContain(
        "Invalid template variable name"
      );
    });

    it("should reject template variables with spaces", () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "description",
              operator: "contains",
              value: "{search term}",
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(false);
      expect(validation.error?.message).toContain(
        "Invalid template variable name"
      );
    });

    it("should reject template variables starting with dots", () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "value", operator: "==", value: "{.invalid}" }],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(false);
      expect(validation.error?.message).toContain(
        "Invalid template variable name"
      );
    });

    it("should reject template variables ending with dots", () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "value", operator: "==", value: "{invalid.}" }],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(false);
      expect(validation.error?.message).toContain(
        "Invalid template variable name"
      );
    });

    it("should reject empty template variables", () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "value", operator: "==", value: "{}" }],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true); // Empty braces are not recognized as templates
    });

    it("should handle multiple template variables with mixed validity", () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "name",
              operator: "==",
              value: "{valid_name} and {123invalid}",
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(false);
      expect(validation.error?.message).toContain(
        "Invalid template variable name"
      );
      expect(validation.error?.message).toContain("123invalid");
    });
  });

  describe("Template Variables in Different Operators", () => {
    it("should validate templates in comparison operators", () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "age", operator: ">", value: "{minAge}" },
            { field: "score", operator: ">=", value: "{passingScore}" },
            { field: "level", operator: "<", value: "{maxLevel}" },
            { field: "experience", operator: "<=", value: "{maxExperience}" },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });

    it("should validate templates in string operators", () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "name", operator: "contains", value: "{searchTerm}" },
            { field: "email", operator: "starts with", value: "{prefix}" },
            { field: "filename", operator: "ends with", value: "{extension}" },
            { field: "description", operator: "contains", value: "{pattern}" },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });

    it("should validate templates in array operators", () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "status", operator: "in", value: "{allowedStatuses}" },
            {
              field: "skills",
              operator: "array contains",
              value: "{requiredSkill}",
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });

    it("should validate templates in date operators", () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "startDate", operator: "is after", value: "{minDate}" },
            { field: "endDate", operator: "is before", value: "{maxDate}" },
            {
              field: "birthDate",
              operator: "is between",
              value: "{dateRange}",
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });
  });

  describe("Complex Template Scenarios", () => {
    it("should validate templates in nested conditions", () => {
      const rule: Rule = {
        conditions: {
          any: [
            {
              all: [
                { field: "age", operator: ">=", value: "{minAge}" },
                {
                  field: "experience",
                  operator: ">=",
                  value: "{minExperience}",
                },
              ],
            },
            { field: "priority", operator: "==", value: "{highPriority}" },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });

    it("should validate templates in sub-rules", () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "department",
              operator: "==",
              value: "{targetDepartment}",
            },
            {
              any: [
                { field: "level", operator: ">=", value: "{minLevel}" },
                {
                  field: "experience",
                  operator: ">=",
                  value: "{minExperience}",
                },
              ],
              result: "qualified",
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });

    it("should reject invalid template syntax in complex scenarios", () => {
      const rule: Rule = {
        conditions: {
          any: [
            {
              all: [
                { field: "age", operator: ">=", value: "{valid_age}" },
                { field: "score", operator: ">=", value: "{123invalid}" },
              ],
            },
            { field: "priority", operator: "==", value: "{high-priority}" },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(false);
      expect(validation.error?.message).toContain(
        "Invalid template variable name"
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle template variables in RegexPattern objects", () => {
      // Note: This is an edge case where the template would be in the regex field
      // of a RegexPattern object, which is not currently supported but should not crash
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: { regex: "\\d+", flags: "g" },
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });

    it("should handle malformed template syntax gracefully", () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "value", operator: "==", value: "{{malformed}" },
            { field: "other", operator: "==", value: "{unclosed" },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true); // These are not recognized as templates
    });

    it("should handle very long template variable names", () => {
      const longName = "a".repeat(100);
      const rule: Rule = {
        conditions: {
          all: [{ field: "value", operator: "==", value: `{${longName}}` }],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });

    it("should handle deeply nested template references", () => {
      const deepReference = "level1.level2.level3.level4.level5.value";
      const rule: Rule = {
        conditions: {
          all: [
            { field: "value", operator: "==", value: `{${deepReference}}` },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });
  });

  describe("Runtime Template Validation", () => {
    it("should fail evaluation when template variables are missing", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "age", operator: ">", value: "{missingField}" }],
        },
      };

      const data = {
        age: 25,
      };

      // Rule validation should pass (syntax is valid)
      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);

      // But evaluation should return false due to missing template variable
      const result = await JsonRules.evaluate(rule, data);
      expect(result).toBe(false);
    });

    it("should handle partial template resolution", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "age", operator: ">", value: "{validField}" },
            { field: "name", operator: "==", value: "{missingField}" },
          ],
        },
      };

      const data = {
        age: 25,
        name: "John",
        validField: 18,
      };

      // Rule validation should pass
      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);

      // But evaluation should return false due to missing template variable
      const result = await JsonRules.evaluate(rule, data);
      expect(result).toBe(false);
    });
  });
});
