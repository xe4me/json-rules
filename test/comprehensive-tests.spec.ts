import { JsonRules } from "../src";
import { Rule, Condition } from "../src/types";
import { Validator } from "../src/services/validator";
import { ObjectDiscovery } from "../src/services/object-discovery";

describe("Final Coverage Push - 100%", () => {
  describe("Evaluator Edge Cases", () => {
    it("should handle invalid regex pattern format", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: { regex: "(invalid", flags: "g" },
            },
          ],
        },
      };

      await expect(
        JsonRules.evaluate(rule, { text: "test" })
      ).rejects.toThrow();
    });

    it("should handle regex with invalid flags", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: { regex: "test", flags: "xyz" },
            },
          ],
        },
      };

      await expect(
        JsonRules.evaluate(rule, { text: "test" })
      ).rejects.toThrow();
    });

    it("should test between operator edge cases", async () => {
      // Invalid range format
      const rule1: Rule = {
        conditions: {
          all: [
            {
              field: "value",
              operator: "is between numbers",
              value: [1] as any,
            },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule1, { value: 5 })).toBe(false);

      // Mixed types in range
      const rule2: Rule = {
        conditions: {
          all: [
            {
              field: "value",
              operator: "is between numbers",
              value: ["1", 10] as any,
            },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule2, { value: 5 })).toBe(false);

      // Invalid date range
      const rule3: Rule = {
        conditions: {
          all: [
            {
              field: "date",
              operator: "is between dates",
              value: [new Date(), "invalid"] as any,
            },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule3, { date: new Date() })).toBe(false);
    });

    it("should test date comparison edge cases", async () => {
      const rule1: Rule = {
        conditions: {
          all: [{ field: "date", operator: "is before", value: "not-a-date" }],
        },
      };
      expect(await JsonRules.evaluate(rule1, { date: new Date() })).toBe(false);

      const rule2: Rule = {
        conditions: {
          all: [{ field: "date", operator: "is after", value: "not-a-date" }],
        },
      };
      expect(await JsonRules.evaluate(rule2, { date: new Date() })).toBe(false);

      const rule3: Rule = {
        conditions: {
          all: [{ field: "value", operator: "is before", value: new Date() }],
        },
      };
      expect(await JsonRules.evaluate(rule3, { value: "not-a-date" })).toBe(
        false
      );
    });

    it("should handle conditions with results (sub-rules)", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "age", operator: "is greater than", value: 18 },
            {
              any: [{ field: "status", operator: "is equal", value: "active" }],
              result: "eligible",
            },
          ],
        },
      };

      // Sub-rules return their result value when conditions match
      const result = await JsonRules.evaluate(rule, {
        age: 25,
        status: "active",
      });
      expect(result).toBe("eligible");
    });
  });

  describe("Template Resolution", () => {
    it("should handle complex template resolution paths", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "user.profile.name",
              operator: "is equal",
              value: "{company.employee.name}",
            },
          ],
        },
      };

      const criteria = {
        user: { profile: { name: "John" } },
        company: { employee: { name: "John" } },
      };

      expect(await JsonRules.evaluate(rule, criteria)).toBe(true);
    });
  });

  describe("Object Discovery Edge Cases", () => {
    let objectDiscovery: ObjectDiscovery;

    beforeEach(() => {
      objectDiscovery = new ObjectDiscovery();
    });

    it("should handle edge cases in granular rule checking", () => {
      // Test with condition that has sub-rules
      const ruleWithSubRules: Rule = {
        conditions: [
          {
            all: [{ field: "age", operator: "is greater than", value: 18 }],
            result: "adult",
          },
        ],
      };

      expect(objectDiscovery.isGranular(ruleWithSubRules)).toBe(false);

      // Test with deeply nested conditions
      const deepRule: Rule = {
        conditions: {
          all: [
            {
              any: [
                {
                  none: [
                    { field: "blocked", operator: "is equal", value: true },
                  ],
                },
              ],
            },
          ],
        },
      };

      expect(objectDiscovery.isGranular(deepRule)).toBe(true);
    });

    it("should test helper function coverage", () => {
      // Test the recursive sub-rule detection with properly nested sub-rules
      const conditionWithNestedSubRules: Condition = {
        all: [
          { field: "status", operator: "is equal", value: "active" },
          {
            any: [{ field: "enabled", operator: "is equal", value: true }],
            result: "valid",
          },
        ],
      };

      expect(
        objectDiscovery.isGranular({ conditions: conditionWithNestedSubRules })
      ).toBe(false);
    });
  });

  describe("Validator Edge Cases", () => {
    let validator: Validator;

    beforeEach(() => {
      validator = new Validator();
    });

    it("should handle malformed rule structures", () => {
      // Null rule
      const result1 = validator.validate(null as any);
      expect(result1.isValid).toBe(false);

      // Missing conditions
      const result2 = validator.validate({} as any);
      expect(result2.isValid).toBe(false);

      // Invalid condition type
      const result3 = validator.validate({
        conditions: { invalid: [] } as any,
      });
      expect(result3.isValid).toBe(false);
    });

    it("should handle constraint validation edge cases", () => {
      // Missing field
      const result1 = validator.validate({
        conditions: { all: [{ operator: "is equal", value: "test" } as any] },
      });
      expect(result1.isValid).toBe(false);

      // Missing operator
      const result2 = validator.validate({
        conditions: { all: [{ field: "name", value: "test" } as any] },
      });
      expect(result2.isValid).toBe(false);

      // Invalid operator
      const result3 = validator.validate({
        conditions: {
          all: [{ field: "name", operator: "invalid", value: "test" } as any],
        },
      });
      expect(result3.isValid).toBe(false);
    });

    it("should handle regex validation edge cases", () => {
      // Missing regex property
      const result1 = validator.validate({
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: { flags: "g" } as any,
            },
          ],
        },
      });
      expect(result1.isValid).toBe(false);

      // Non-string regex
      const result2 = validator.validate({
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: { regex: 123 } as any,
            },
          ],
        },
      });
      expect(result2.isValid).toBe(false);

      // Non-string flags
      const result3 = validator.validate({
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: { regex: "test", flags: 123 } as any,
            },
          ],
        },
      });
      expect(result3.isValid).toBe(false);
    });

    it("should handle template variable validation edge cases", () => {
      // Template validation passes when field format is correct (validation is done at runtime)
      const result1 = validator.validate({
        conditions: {
          all: [
            {
              field: "name",
              operator: "is equal",
              value: "{nonexistent.field}",
            },
          ],
        },
      });
      expect(result1.isValid).toBe(true); // Syntax is valid, runtime will fail

      // Complex nested template validation
      const result2 = validator.validate({
        conditions: {
          all: [
            {
              field: "user.name",
              operator: "in",
              value: ["{users.names}", "default"],
            },
          ],
        },
      });
      expect(result2.isValid).toBe(true); // Syntax is valid
    });

    it("should handle array operator validation", () => {
      // Non-array value for array operators
      const result1 = validator.validate({
        conditions: {
          all: [{ field: "tags", operator: "in", value: "not-array" as any }],
        },
      });
      expect(result1.isValid).toBe(false);

      const result2 = validator.validate({
        conditions: {
          all: [
            {
              field: "tags",
              operator: "contains any",
              value: "not-array" as any,
            },
          ],
        },
      });
      expect(result2.isValid).toBe(false);
    });
  });

  describe("Advanced Validator Error Conditions", () => {
    it("should handle invalid phone configurations", async () => {
      // Non-string locale
      const rule1: Rule = {
        conditions: {
          all: [
            {
              field: "phone",
              operator: "is valid phone",
              value: { locale: 123 } as any,
            },
          ],
        },
      };
      await expect(
        JsonRules.evaluate(rule1, { phone: "+1234567890" })
      ).rejects.toThrow();

      // Missing locale - this will work by returning false rather than throwing
      const rule2: Rule = {
        conditions: {
          all: [
            { field: "phone", operator: "is valid phone", value: {} as any },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule2, { phone: "+1234567890" })).toBe(
        false
      );
    });

    it("should handle non-string values for string validators", async () => {
      const nonStringRules = [
        { field: "email", operator: "is valid email" },
        { field: "url", operator: "is URL", value: {} },
        { field: "uuid", operator: "is UUID", value: {} },
        { field: "ean", operator: "is EAN" },
        { field: "imei", operator: "is IMEI" },
        { field: "domain", operator: "is domain" },
        { field: "country", operator: "is country", value: { format: "iso2" } },
      ] as const;

      for (const config of nonStringRules) {
        const rule: Rule = { conditions: { all: [config] } };
        expect(await JsonRules.evaluate(rule, { [config.field]: 123 })).toBe(
          false
        );
      }
    });

    it("should test uncovered country validator branches", async () => {
      // Invalid country format
      const rule1: Rule = {
        conditions: {
          all: [
            {
              field: "country",
              operator: "is country",
              value: { format: "invalid" } as any,
            },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule1, { country: "US" })).toBe(false);

      // Test non-string country code
      const rule2: Rule = {
        conditions: {
          all: [
            {
              field: "country",
              operator: "is country",
              value: { format: "iso2" },
            },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule2, { country: 123 })).toBe(false);
    });

    it("should test uncovered IMEI validator branches", async () => {
      // Non-string IMEI
      const rule1: Rule = {
        conditions: {
          all: [{ field: "imei", operator: "is IMEI" }],
        },
      };
      expect(await JsonRules.evaluate(rule1, { imei: 123 })).toBe(false);
    });

    it("should test uncovered email validator branches", async () => {
      // Invalid email config branches
      const rule1: Rule = {
        conditions: {
          all: [
            {
              field: "email",
              operator: "is valid email",
              value: {
                hostBlacklist: ["spam.com"],
                allowIpDomain: false,
              },
            },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule1, { email: "test@spam.com" })).toBe(
        false
      );
      expect(
        await JsonRules.evaluate(rule1, { email: "test@[127.0.0.1]" })
      ).toBe(false);
    });

    it("should test uncovered domain validator branches", async () => {
      // Non-string domain
      const rule1: Rule = {
        conditions: {
          all: [{ field: "domain", operator: "is domain" }],
        },
      };
      expect(await JsonRules.evaluate(rule1, { domain: 123 })).toBe(false);
    });

    it("should test uncovered UUID validator branches", async () => {
      // Non-string UUID and invalid version
      const rule1: Rule = {
        conditions: {
          all: [{ field: "id", operator: "is UUID", value: { version: 4 } }],
        },
      };
      expect(await JsonRules.evaluate(rule1, { id: 123 })).toBe(false);

      // Invalid version - returns false
      const rule2: Rule = {
        conditions: {
          all: [
            { field: "id", operator: "is UUID", value: { version: 10 } as any },
          ],
        },
      };
      expect(
        await JsonRules.evaluate(rule2, {
          id: "550e8400-e29b-41d4-a716-446655440000",
        })
      ).toBe(false); // Invalid version fails
    });

    it("should test uncovered unit validator branches", async () => {
      // Non-string unit value
      const rule1: Rule = {
        conditions: {
          all: [{ field: "distance", operator: "is unit", value: "length" }],
        },
      };
      expect(await JsonRules.evaluate(rule1, { distance: 123 })).toBe(false);
    });
  });

  describe("Phone Registry Edge Cases", () => {
    it("should test phone validator error conditions", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "phone",
              operator: "is valid phone",
              value: { locale: "invalidlocale", strict: true },
            },
          ],
        },
      };

      await expect(
        JsonRules.evaluate(rule, { phone: "+1234567890" })
      ).rejects.toThrow("Invalid locale 'invalidlocale'");
    });
  });
});
