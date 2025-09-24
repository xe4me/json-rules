import { Rule, JsonRules, RegexPattern } from "../src";

describe("Regex Flags Support", () => {
  describe("Basic regex pattern matching", () => {
    it("should match with regex pattern", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: { regex: "hello.*world" },
            },
          ],
        },
      };

      const criteria = { text: "hello beautiful world" };
      const result = JsonRules.evaluate(rule, criteria);
      expect(result).toBe(true);
    });

    it("should not match with regex pattern", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "not matches",
              value: { regex: "hello.*world" },
            },
          ],
        },
      };

      const criteria = { text: "hello beautiful world" };
      const result = JsonRules.evaluate(rule, criteria);
      expect(result).toBe(false);
    });
  });

  describe("RegexPattern objects with flags", () => {
    it("should match with case-insensitive flag", async () => {
      const regexPattern: RegexPattern = {
        regex: "hello.*world",
        flags: "i",
      };

      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: regexPattern,
            },
          ],
        },
      };

      const criteria = { text: "HELLO BEAUTIFUL WORLD" };
      const result = JsonRules.evaluate(rule, criteria);
      expect(result).toBe(true);
    });

    it("should not match without case-insensitive flag", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: { regex: "hello.*world" }, // no flags
            },
          ],
        },
      };

      const criteria = { text: "HELLO BEAUTIFUL WORLD" };
      const result = JsonRules.evaluate(rule, criteria);
      expect(result).toBe(false);
    });

    it("should work with global flag for multiple matches", async () => {
      const regexPattern: RegexPattern = {
        regex: "\\d+",
        flags: "g",
      };

      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: regexPattern,
            },
          ],
        },
      };

      const criteria = { text: "There are 123 apples and 456 oranges" };
      const result = JsonRules.evaluate(rule, criteria);
      expect(result).toBe(true);
    });

    it("should work with multiline flag", async () => {
      const regexPattern: RegexPattern = {
        regex: "^hello",
        flags: "m",
      };

      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: regexPattern,
            },
          ],
        },
      };

      const criteria = { text: "world\nhello there" };
      const result = JsonRules.evaluate(rule, criteria);
      expect(result).toBe(true);
    });

    it("should work with combined flags", async () => {
      const regexPattern: RegexPattern = {
        regex: "^hello.*world$",
        flags: "ims", // Added 's' flag for dotall mode
      };

      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: regexPattern,
            },
          ],
        },
      };

      const criteria = { text: "HELLO BEAUTIFUL\nWORLD" };
      const result = JsonRules.evaluate(rule, criteria);
      expect(result).toBe(true);
    });
  });

  describe("RegexPattern validation", () => {
    it("should validate basic regex patterns", () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: { regex: "hello.*world" },
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });

    it("should validate RegexPattern objects", () => {
      const regexPattern: RegexPattern = {
        regex: "hello.*world",
        flags: "i",
      };

      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: regexPattern,
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(true);
    });

    it("should reject invalid regex patterns", () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: { regex: "[invalid" },
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(false);
      expect(validation.error?.message).toContain("valid RegexPattern");
    });

    it("should reject invalid RegexPattern objects", () => {
      const regexPattern: RegexPattern = {
        regex: "[invalid",
        flags: "i",
      };

      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: regexPattern,
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(false);
      expect(validation.error?.message).toContain("valid regular expression");
    });

    it("should reject invalid flags", () => {
      const regexPattern: RegexPattern = {
        regex: "hello.*world",
        flags: "xyz", // invalid flags
      };

      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: regexPattern,
            },
          ],
        },
      };

      const validation = JsonRules.validate(rule);
      expect(validation.isValid).toBe(false);
      expect(validation.error?.message).toContain("valid regular expression");
    });
  });
});
