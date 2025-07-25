import { JsonRules } from "../src";
import { RuleTypeError } from "../src";
import { Rule, Condition } from "../src";
import { Logger } from "../src/services";
import { RuleHelper } from "../src/services";
import { ObjectDiscovery } from "../src/services";
import { getSupportedCountryNames } from "../src/services/validators";
import {
  getSupportedUnits,
  getSupportedUnitTypes,
} from "../src/services/validators";

describe("Coverage Gaps - Comprehensive Testing", () => {
  describe("RuleTypeError", () => {
    it("should create error with custom message", () => {
      const error = new RuleTypeError("Custom error message");
      expect(error.message).toBe("Custom error message");
      expect(error.type).toBe("RuleError");
    });

    it("should create error with default message when no message provided", () => {
      const error = new RuleTypeError(null as any);
      expect(error.message).toBe(
        "The type of rule is not valid for this operation"
      );
      expect(error.type).toBe("RuleError");
    });

    it("should be instance of Error", () => {
      const error = new RuleTypeError("Test");
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("Logger", () => {
    let originalEnv: string | undefined;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      originalEnv = process.env.DEBUG;
      consoleSpy = jest.spyOn(console, "debug").mockImplementation();
    });

    afterEach(() => {
      process.env.DEBUG = originalEnv;
      consoleSpy.mockRestore();
    });

    it("should log debug messages when DEBUG=true", () => {
      process.env.DEBUG = "true";
      Logger.debug("test message", 123, { key: "value" });
      expect(consoleSpy).toHaveBeenCalledWith("test message", 123, {
        key: "value",
      });
    });

    it("should not log debug messages when DEBUG is not true", () => {
      process.env.DEBUG = "false";
      Logger.debug("test message");
      expect(consoleSpy).not.toHaveBeenCalled();

      delete process.env.DEBUG;
      Logger.debug("test message");
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it("should format text with red color", () => {
      const result = Logger.color("test", "r");
      expect(result).toBe("\x1b[31mtest\x1b[0m");
    });

    it("should format text with green color", () => {
      const result = Logger.color("test", "g");
      expect(result).toBe("\x1b[32mtest\x1b[0m");
    });

    it("should format text with yellow color", () => {
      const result = Logger.color("test", "y");
      expect(result).toBe("\x1b[33mtest\x1b[0m");
    });

    it("should format text with blue color", () => {
      const result = Logger.color("test", "b");
      expect(result).toBe("\x1b[34mtest\x1b[0m");
    });

    it("should format text with magenta color", () => {
      const result = Logger.color("test", "m");
      expect(result).toBe("\x1b[35mtest\x1b[0m");
    });

    it("should return text as string for unknown color", () => {
      const result = Logger.color("test", "x" as any);
      expect(result).toBe("test");
    });

    it("should format text as bold", () => {
      const result = Logger.bold("test");
      expect(result).toBe("\x1b[1mtest\x1b[0m");
    });

    it("should convert non-string values to string", () => {
      const result = Logger.color(123, "r");
      expect(result).toBe("\x1b[31m123\x1b[0m");

      const boldResult = Logger.bold({ key: "value" });
      expect(boldResult).toBe("\x1b[1m[object Object]\x1b[0m");
    });
  });

  describe("RuleHelper", () => {
    let ruleHelper: RuleHelper;

    beforeEach(() => {
      ruleHelper = new RuleHelper();
    });

    it("should extract sub-rules from nested conditions", () => {
      const condition: Condition = {
        all: [
          { field: "age", operator: "is greater than", value: 18 },
          {
            any: [{ field: "status", operator: "is equal", value: "active" }],
            result: "eligible",
          },
        ],
      };

      const results = ruleHelper.extractSubRules(condition);
      expect(results).toHaveLength(1);
      expect(results[0].subRule.result).toBe("eligible");
    });

    it("should remove all sub-rules from a condition", () => {
      const condition: Condition = {
        all: [
          { field: "age", operator: "is greater than", value: 18 },
          {
            any: [{ field: "status", operator: "is equal", value: "active" }],
            result: "eligible",
          },
        ],
      };

      const cleaned = ruleHelper.removeAllSubRules(condition);
      expect(cleaned).toBeTruthy();
      if (cleaned?.all) {
        expect(cleaned.all).toHaveLength(1);
        expect((cleaned.all[0] as any).result).toBeUndefined();
      }
    });

    it("should strip null properties from objects", () => {
      const obj = {
        validField: "value",
        nullField: null,
        undefinedField: undefined,
        emptyString: "",
        zeroValue: 0,
        falseValue: false,
      };

      const cleaned = ruleHelper.stripNullProps(obj);
      expect(cleaned.validField).toBe("value");
      expect(cleaned.zeroValue).toBe(0);
      expect(cleaned.falseValue).toBe(false);
      expect(cleaned.nullField).toBeUndefined();
      expect(cleaned.undefinedField).toBeUndefined();
      expect(cleaned.emptyString).toBeUndefined();
    });

    it("should handle conditions with no sub-rules", () => {
      const condition: Condition = {
        all: [
          { field: "age", operator: "is greater than", value: 18 },
          { field: "status", operator: "is equal", value: "active" },
        ],
      };

      const results = ruleHelper.extractSubRules(condition);
      expect(results).toHaveLength(0);
    });

    it("should handle deeply nested conditions", () => {
      const condition: Condition = {
        all: [
          {
            any: [
              {
                none: [{ field: "blocked", operator: "is equal", value: true }],
                result: "not_blocked",
              },
            ],
          },
        ],
      };

      const results = ruleHelper.extractSubRules(condition);
      expect(results).toHaveLength(1);
      expect(results[0].subRule.result).toBe("not_blocked");
    });

    it("should handle array properties correctly", () => {
      // This test validates the stripNullProps array handling
      const arrayWithNulls = [1, null, 2, undefined, 3, ""];
      const cleaned = ruleHelper.stripNullProps(arrayWithNulls);
      expect(cleaned).toEqual([1, 2, 3]);
    });
  });

  describe("ObjectDiscovery", () => {
    let objectDiscovery: ObjectDiscovery;

    beforeEach(() => {
      objectDiscovery = new ObjectDiscovery();
    });

    it("should identify condition types", () => {
      expect(objectDiscovery.conditionType({ all: [] })).toBe("all");
      expect(objectDiscovery.conditionType({ any: [] })).toBe("any");
      expect(objectDiscovery.conditionType({ none: [] })).toBe("none");
      expect(objectDiscovery.conditionType({} as any)).toBe(null);
      expect(objectDiscovery.conditionType("not object" as any)).toBe(null);
    });

    it("should check if rule is granular", () => {
      const granularRule: Rule = {
        conditions: {
          all: [{ field: "age", operator: "is greater than", value: 18 }],
        },
      };

      const nonGranularRule: Rule = {
        conditions: {
          all: [{ field: "age", operator: "is greater than", value: 18 }],
          result: "adult",
        },
      };

      expect(objectDiscovery.isGranular(granularRule)).toBe(true);
      expect(objectDiscovery.isGranular(nonGranularRule)).toBe(false);
    });

    it("should check if condition has result", () => {
      const withResult: Condition = {
        all: [{ field: "age", operator: "is greater than", value: 18 }],
        result: "adult",
      };

      const withoutResult: Condition = {
        all: [{ field: "age", operator: "is greater than", value: 18 }],
      };

      expect(objectDiscovery.isConditionWithResult(withResult)).toBe(true);
      expect(objectDiscovery.isConditionWithResult(withoutResult)).toBe(false);
    });

    it("should check if value is constraint", () => {
      const constraint = {
        field: "age",
        operator: "is greater than",
        value: 18,
      };
      const condition = { all: [constraint] };

      expect(objectDiscovery.isConstraint(constraint)).toBe(true);
      expect(objectDiscovery.isConstraint(condition)).toBe(false);
      expect(objectDiscovery.isConstraint("not object")).toBe(false);
    });

    it("should check if value is condition", () => {
      const constraint = {
        field: "age",
        operator: "is greater than",
        value: 18,
      };
      const condition = { all: [constraint] };

      expect(objectDiscovery.isCondition(condition)).toBe(true);
      expect(objectDiscovery.isCondition(constraint)).toBe(false);
      expect(objectDiscovery.isCondition("not object")).toBe(false);
    });

    it("should check if value is object", () => {
      expect(objectDiscovery.isObject({})).toBe(true);
      expect(objectDiscovery.isObject([])).toBe(false); // Arrays are not considered objects in this implementation
      expect(objectDiscovery.isObject("string")).toBe(false);
      expect(objectDiscovery.isObject(null)).toBe(false);
      expect(objectDiscovery.isObject(undefined)).toBe(false);
    });

    it("should handle rule with array conditions", () => {
      const rule: Rule = {
        conditions: [
          { all: [{ field: "age", operator: "is greater than", value: 18 }] },
          { any: [{ field: "status", operator: "is equal", value: "active" }] },
        ],
      };

      expect(objectDiscovery.isGranular(rule)).toBe(true);
    });
  });

  describe("Validator Utility Functions", () => {
    it("should get supported unit types", () => {
      const unitTypes = getSupportedUnitTypes();
      expect(unitTypes).toContain("length");
      expect(unitTypes).toContain("mass");
      expect(unitTypes).toContain("volume");
      expect(unitTypes).toContain("temperature");
      expect(unitTypes).toContain("time");
      expect(unitTypes).toContain("area");
      expect(unitTypes).toContain("energy");
      expect(unitTypes).toContain("pressure");
      expect(unitTypes).toContain("speed");
      expect(unitTypes).toContain("force");
      expect(unitTypes).toContain("power");
      expect(unitTypes).toContain("frequency");
    });

    it("should get supported units for specific types", () => {
      const lengthUnits = getSupportedUnits("length");
      expect(lengthUnits).toContain("m");
      expect(lengthUnits).toContain("km");
      expect(lengthUnits).toContain("ft");
      expect(lengthUnits).toContain("inch");

      const massUnits = getSupportedUnits("mass");
      expect(massUnits).toContain("kg");
      expect(massUnits).toContain("g");
      expect(massUnits).toContain("lb");
      expect(massUnits).toContain("oz");

      const emptyUnits = getSupportedUnits("invalid" as any);
      expect(emptyUnits).toEqual([]);
    });

    it("should get supported country names", () => {
      const countries = getSupportedCountryNames();
      expect(countries).toContain("united states");
      expect(countries).toContain("germany");
      expect(countries).toContain("japan");
      expect(countries).toContain("canada");
    });
  });

  describe("Advanced Error Handling", () => {
    it("should handle malformed phone config", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "phone",
              operator: "is valid phone",
              value: { locale: "nonexistent" },
            },
          ],
        },
      };

      await expect(
        JsonRules.evaluate(rule, { phone: "+1234567890" })
      ).rejects.toThrow("Invalid locale 'nonexistent'");
    });

    it("should handle malformed country config", async () => {
      const rule: Rule = {
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

      expect(await JsonRules.evaluate(rule, { country: "US" })).toBe(false);
    });

    it("should handle malformed unit validation", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "distance",
              operator: "is unit",
              value: "invalid_type" as any,
            },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { distance: "5km" })).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle invalid UUID config types", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "id",
              operator: "is UUID",
              value: { version: null as any },
            },
          ],
        },
      };

      expect(
        await JsonRules.evaluate(rule, {
          id: "550e8400-e29b-41d4-a716-446655440000",
        })
      ).toBe(true);
    });

    it("should handle IMEI validation edge cases", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "imei",
              operator: "is IMEI",
              value: { allowHyphens: false },
            },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { imei: "352099001761481" })).toBe(
        true
      );
      expect(
        await JsonRules.evaluate(rule, { imei: "35-209900-176148-1" })
      ).toBe(false);
    });

    it("should handle domain validation with null config", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "domain", operator: "is domain" }],
        },
      };

      expect(await JsonRules.evaluate(rule, { domain: "example.com" })).toBe(
        true
      );
    });

    it("should handle email validation with null config", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "email", operator: "is valid email" }],
        },
      };

      expect(
        await JsonRules.evaluate(rule, { email: "test@example.com" })
      ).toBe(true);
    });

    it("should handle URL validation with empty config", async () => {
      const rule: Rule = {
        conditions: { all: [{ field: "url", operator: "is URL", value: {} }] },
      };

      expect(
        await JsonRules.evaluate(rule, { url: "https://example.com" })
      ).toBe(true);
    });

    it("should handle unit validation with zero and invalid numbers", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "distance", operator: "is unit", value: "length" }],
        },
      };

      expect(await JsonRules.evaluate(rule, { distance: "0km" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { distance: "-5.5meters" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { distance: "km" })).toBe(false); // No number
      expect(await JsonRules.evaluate(rule, { distance: "5" })).toBe(false); // No unit
    });
  });
});
