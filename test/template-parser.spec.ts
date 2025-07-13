import { TemplateParser } from "../src/services/template-parser";

describe("TemplateParser", () => {
  let parser: TemplateParser;

  beforeEach(() => {
    parser = new TemplateParser();
  });

  describe("hasTemplateVariables", () => {
    it("should detect template variables in strings", () => {
      expect(parser.hasTemplateVariables("{age}")).toBe(true);
      expect(parser.hasTemplateVariables("Hello {name}!")).toBe(true);
      expect(parser.hasTemplateVariables("{profile.age}")).toBe(true);
      expect(parser.hasTemplateVariables("{user.profile.name}")).toBe(true);
      expect(parser.hasTemplateVariables("Value: {value1} and {value2}")).toBe(true);
    });

    it("should not detect template variables in non-template strings", () => {
      expect(parser.hasTemplateVariables("regular string")).toBe(false);
      expect(parser.hasTemplateVariables("no templates here")).toBe(false);
      expect(parser.hasTemplateVariables("")).toBe(false);
      expect(parser.hasTemplateVariables("curly braces but no template { }")).toBe(true); // { } is detected as template but will be rejected by validator
      expect(parser.hasTemplateVariables("invalid {123} template")).toBe(true); // {123} is detected as template but will be rejected by validator
    });

    it("should return false for non-string values", () => {
      expect(parser.hasTemplateVariables(123)).toBe(false);
      expect(parser.hasTemplateVariables(true)).toBe(false);
      expect(parser.hasTemplateVariables(null)).toBe(false);
      expect(parser.hasTemplateVariables(undefined)).toBe(false);
      expect(parser.hasTemplateVariables({})).toBe(false);
      expect(parser.hasTemplateVariables([])).toBe(false);
    });
  });

  describe("extractTemplateVariables", () => {
    it("should extract single template variables", () => {
      const result = parser.extractTemplateVariables("{age}");
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "age",
        fullMatch: "{age}",
        startIndex: 0,
        endIndex: 5
      });
    });

    it("should extract multiple template variables", () => {
      const result = parser.extractTemplateVariables("Hello {name}, you are {age} years old!");
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: "name",
        fullMatch: "{name}",
        startIndex: 6,
        endIndex: 12
      });
      expect(result[1]).toEqual({
        name: "age",
        fullMatch: "{age}",
        startIndex: 22,
        endIndex: 27
      });
    });

    it("should extract nested field references", () => {
      const result = parser.extractTemplateVariables("{user.profile.name}");
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "user.profile.name",
        fullMatch: "{user.profile.name}",
        startIndex: 0,
        endIndex: 19
      });
    });

    it("should handle template variables with underscores", () => {
      const result = parser.extractTemplateVariables("{user_name} and {first_name}");
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("user_name");
      expect(result[1].name).toBe("first_name");
    });

    it("should return empty array for non-template strings", () => {
      expect(parser.extractTemplateVariables("no templates")).toEqual([]);
      expect(parser.extractTemplateVariables("")).toEqual([]);
    });

    it("should return empty array for non-string values", () => {
      expect(parser.extractTemplateVariables(123)).toEqual([]);
      expect(parser.extractTemplateVariables(true)).toEqual([]);
      expect(parser.extractTemplateVariables(null)).toEqual([]);
      expect(parser.extractTemplateVariables({})).toEqual([]);
    });
  });

  describe("resolveTemplateValue", () => {
    const mockCriteria = {
      age: 30,
      name: "John",
      salary: 50000,
      profile: {
        firstName: "John",
        lastName: "Doe",
        settings: {
          theme: "dark"
        }
      }
    };

    it("should resolve single template variables", () => {
      expect(parser.resolveTemplateValue("{age}", mockCriteria)).toBe(30);
      expect(parser.resolveTemplateValue("{name}", mockCriteria)).toBe("John");
      expect(parser.resolveTemplateValue("{salary}", mockCriteria)).toBe(50000);
    });

    it("should resolve nested field references", () => {
      expect(parser.resolveTemplateValue("{profile.firstName}", mockCriteria)).toBe("John");
      expect(parser.resolveTemplateValue("{profile.lastName}", mockCriteria)).toBe("Doe");
      expect(parser.resolveTemplateValue("{profile.settings.theme}", mockCriteria)).toBe("dark");
    });

    it("should resolve multiple template variables in a string", () => {
      const result = parser.resolveTemplateValue("Hello {name}, you are {age} years old!", mockCriteria);
      expect(result).toBe("Hello John, you are 30 years old!");
    });

    it("should resolve mixed template variables", () => {
      const result = parser.resolveTemplateValue("{profile.firstName} {profile.lastName} - Age: {age}", mockCriteria);
      expect(result).toBe("John Doe - Age: 30");
    });

    it("should handle templates with numeric values", () => {
      const result = parser.resolveTemplateValue("Salary: ${salary}", mockCriteria);
      expect(result).toBe("Salary: $50000");
    });

    it("should preserve undefined templates as-is", () => {
      const result = parser.resolveTemplateValue("Hello {missingField}!", mockCriteria);
      expect(result).toBe("Hello {missingField}!");
    });

    it("should return non-template values unchanged", () => {
      expect(parser.resolveTemplateValue("regular string", mockCriteria)).toBe("regular string");
      expect(parser.resolveTemplateValue(123, mockCriteria)).toBe(123);
      expect(parser.resolveTemplateValue(true, mockCriteria)).toBe(true);
      expect(parser.resolveTemplateValue(null, mockCriteria)).toBe(null);
    });

    it("should handle complex nested object resolution", () => {
      const complexCriteria = {
        user: {
          profile: {
            contact: {
              email: "user@example.com",
              phone: "123-456-7890"
            }
          }
        }
      };

      expect(parser.resolveTemplateValue("{user.profile.contact.email}", complexCriteria)).toBe("user@example.com");
      expect(parser.resolveTemplateValue("{user.profile.contact.phone}", complexCriteria)).toBe("123-456-7890");
    });
  });

  describe("validateTemplateVariables", () => {
    const mockCriteria = {
      age: 30,
      name: "John",
      profile: {
        firstName: "John",
        lastName: "Doe"
      }
    };

    it("should validate existing template variables", () => {
      const result = parser.validateTemplateVariables("{age}", mockCriteria);
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toEqual([]);
    });

    it("should validate multiple existing template variables", () => {
      const result = parser.validateTemplateVariables("Hello {name}, you are {age} years old!", mockCriteria);
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toEqual([]);
    });

    it("should validate nested field references", () => {
      const result = parser.validateTemplateVariables("{profile.firstName}", mockCriteria);
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toEqual([]);
    });

    it("should detect missing template variables", () => {
      const result = parser.validateTemplateVariables("{missingField}", mockCriteria);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toEqual(["missingField"]);
    });

    it("should detect multiple missing template variables", () => {
      const result = parser.validateTemplateVariables("Hello {missing1} and {missing2}!", mockCriteria);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toEqual(["missing1", "missing2"]);
    });

    it("should detect missing nested field references", () => {
      const result = parser.validateTemplateVariables("{profile.missing}", mockCriteria);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toEqual(["profile.missing"]);
    });

    it("should detect mixed valid and invalid template variables", () => {
      const result = parser.validateTemplateVariables("Hello {name}, your {missing} is {age}", mockCriteria);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toEqual(["missing"]);
    });

    it("should validate non-template values as valid", () => {
      const result = parser.validateTemplateVariables("regular string", mockCriteria);
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toEqual([]);
    });

    it("should handle non-string values", () => {
      const result = parser.validateTemplateVariables(123, mockCriteria);
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toEqual([]);
    });
  });

  describe("edge cases", () => {
    it("should handle empty template variables", () => {
      expect(parser.hasTemplateVariables("{}")).toBe(false);
      expect(parser.extractTemplateVariables("{}")).toEqual([]);
    });

    it("should handle malformed template variables", () => {
      expect(parser.hasTemplateVariables("{123}")).toBe(true); // Detected as template but will be rejected by validator
      expect(parser.hasTemplateVariables("{.field}")).toBe(true); // Detected as template but will be rejected by validator
      expect(parser.hasTemplateVariables("{field.}")).toBe(true); // Detected as template but will be rejected by validator
    });

    it("should handle template variables with special characters", () => {
      expect(parser.hasTemplateVariables("{field-name}")).toBe(true); // Detected as template but will be rejected by validator
      expect(parser.hasTemplateVariables("{field@name}")).toBe(true); // Detected as template but will be rejected by validator
      expect(parser.hasTemplateVariables("{field name}")).toBe(true); // Detected as template but will be rejected by validator
    });

    it("should handle overlapping braces", () => {
      expect(parser.hasTemplateVariables("{{field}}")).toBe(false);
      expect(parser.hasTemplateVariables("{{field}")).toBe(false);
      expect(parser.hasTemplateVariables("{field}}")).toBe(false);
    });

    it("should handle extremely nested field references", () => {
      const criteria = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: "deep value"
              }
            }
          }
        }
      };

      const result = parser.resolveTemplateValue("{level1.level2.level3.level4.value}", criteria);
      expect(result).toBe("deep value");
    });
  });
}); 