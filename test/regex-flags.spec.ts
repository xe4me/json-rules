import { Rule, RulePilot, RegexPattern } from "../src";

describe("Regex Flags Support", () => {
  describe("String regex patterns (backward compatibility)", () => {
    it("should match with string regex pattern", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: "hello.*world",
            },
          ],
        },
      };

      const criteria = { text: "hello beautiful world" };
      const result = await RulePilot.evaluate(rule, criteria);
      expect(result).toBe(true);
    });

    it("should not match with string regex pattern", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "not matches",
              value: "hello.*world",
            },
          ],
        },
      };

      const criteria = { text: "hello beautiful world" };
      const result = await RulePilot.evaluate(rule, criteria);
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
      const result = await RulePilot.evaluate(rule, criteria);
      expect(result).toBe(true);
    });

    it("should not match without case-insensitive flag", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: "hello.*world", // no flags
            },
          ],
        },
      };

      const criteria = { text: "HELLO BEAUTIFUL WORLD" };
      const result = await RulePilot.evaluate(rule, criteria);
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
      const result = await RulePilot.evaluate(rule, criteria);
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
      const result = await RulePilot.evaluate(rule, criteria);
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
      const result = await RulePilot.evaluate(rule, criteria);
      expect(result).toBe(true);
    });
  });

  describe("RegexPattern validation", () => {
    it("should validate string regex patterns", () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: "hello.*world",
            },
          ],
        },
      };

      const validation = RulePilot.validate(rule);
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

      const validation = RulePilot.validate(rule);
      expect(validation.isValid).toBe(true);
    });

    it("should reject invalid string regex patterns", () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: "[invalid",
            },
          ],
        },
      };

      const validation = RulePilot.validate(rule);
      expect(validation.isValid).toBe(false);
      expect(validation.error?.message).toContain("valid regular expression");
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

      const validation = RulePilot.validate(rule);
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

      const validation = RulePilot.validate(rule);
      expect(validation.isValid).toBe(false);
      expect(validation.error?.message).toContain("valid regular expression");
    });
  });
});
