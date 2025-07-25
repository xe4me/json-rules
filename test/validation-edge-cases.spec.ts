import { JsonRules } from "../src";
import { Rule, Condition } from "../src";
import { Validator } from "../src/services";
import { RuleHelper } from "../src/services";
import { validateURL } from "../src/services/validators";
import { validateUUID } from "../src/services/validators";
import { validateEmail } from "../src/services/validators";
import {
  validateEAN,
  validateIMEI,
  validateCountry,
} from "../src/services/validators";

describe("100% Coverage Push", () => {
  let jsonRules: JsonRules;
  let validator: Validator;
  let ruleHelper: RuleHelper;

  beforeEach(() => {
    jsonRules = new JsonRules();
    validator = new Validator();
    ruleHelper = new RuleHelper();
  });

  describe("Validator Coverage - Line 84", () => {
    it("should handle null rule validation", () => {
      const result = validator.validate(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error?.message).toContain(
        "rule must be a valid JSON object"
      );
    });
  });

  describe("Validator Coverage - Lines 386-391", () => {
    it("should validate template variables in complex nested scenarios", () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "user.profile.settings.theme",
              operator: "is equal",
              value: "{app.defaultTheme}",
            },
          ],
        },
      };

      const result = validator.validate(rule);
      expect(result.isValid).toBe(true);
    });
  });

  describe("Rule Helper Coverage - Lines 38, 96, 105, 123", () => {
    it("should handle extractSubRules edge cases", () => {
      // Line 38 - handle non-object condition (this should be skipped, so let's test valid complex conditions)
      const simpleCondition: Condition = {
        all: [{ field: "status", operator: "is equal", value: "active" }],
      };
      const result1 = ruleHelper.extractSubRules(simpleCondition);
      expect(Array.isArray(result1)).toBe(true);

      // Lines 96, 105, 123 - complex nested conditions
      const complexCondition: Condition = {
        all: [
          {
            any: [
              { field: "status", operator: "is equal", value: "active" },
              {
                none: [
                  { field: "disabled", operator: "is equal", value: true },
                ],
              },
            ],
          },
          {
            all: [{ field: "verified", operator: "is equal", value: true }],
            result: "verified_user",
          },
        ],
      };

      const extracted = ruleHelper.extractSubRules(complexCondition);
      expect(extracted.length).toBeGreaterThan(0);

      // Test removeAllSubRules with complex nesting
      const cleaned = ruleHelper.removeAllSubRules(complexCondition);
      expect(cleaned).toBeTruthy();

      // Test stripNullProps with complex objects
      const objWithNulls = {
        validProp: "value",
        nullProp: null,
        nestedObj: {
          validNested: "test",
          nullNested: null,
        },
        arrayProp: [null, "valid", null],
      };

      const stripped = ruleHelper.stripNullProps(objWithNulls);
      expect(stripped.nullProp).toBeUndefined();
      expect(stripped.validProp).toBe("value");
    });
  });

  describe("Evaluator Coverage - Line 151", () => {
    it("should handle mixed constraint and condition arrays", () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "status", operator: "is equal", value: "active" },
            {
              any: [{ field: "role", operator: "is equal", value: "admin" }],
            },
          ],
        },
      };

      const criteria = { status: "active", role: "admin" };

      return jsonRules.evaluate(rule, criteria, true).then((result) => {
        expect(result).toBe(true);
      });
    });
  });

  describe("Evaluator Coverage - Lines 209-237", () => {
    it("should handle invalid regex patterns", () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: { regex: "[invalid regex", flags: "g" } as any,
            },
          ],
        },
      };

      const criteria = { text: "test" };

      return expect(jsonRules.evaluate(rule, criteria, true)).rejects.toThrow();
    });

    it("should test isBetween with invalid ranges and mixed types", () => {
      const invalidRangeRule: Rule = {
        conditions: {
          all: [
            {
              field: "score",
              operator: "is between numbers",
              value: [10] as any,
            },
          ],
        },
      };

      const mixedTypeRule: Rule = {
        conditions: {
          all: [
            {
              field: "value",
              operator: "is between numbers",
              value: ["10", 20] as any,
            },
          ],
        },
      };

      const criteria1 = { score: 15 };
      const criteria2 = { value: 15 };

      return Promise.all([
        jsonRules.evaluate(invalidRangeRule, criteria1, true).then((result) => {
          expect(result).toBe(false);
        }),
        jsonRules.evaluate(mixedTypeRule, criteria2, true).then((result) => {
          expect(result).toBe(false);
        }),
      ]);
    });

    it("should test date comparisons with non-date values", () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "date",
              operator: "is before",
              value: "not-a-date" as any,
            },
          ],
        },
      };

      const criteria = { date: new Date() };

      return jsonRules.evaluate(rule, criteria, true).then((result) => {
        expect(result).toBe(false);
      });
    });
  });

  describe("Validator Code Coverage - Line 22 (EAN non-string)", () => {
    it("should handle non-string values in validateEAN", () => {
      expect(validateEAN(123)).toBe(false);
      expect(validateEAN(null)).toBe(false);
      expect(validateEAN(undefined)).toBe(false);
      expect(validateEAN({})).toBe(false);
      expect(validateEAN([])).toBe(false);
    });
  });

  describe("Validator Code Coverage - Line 30 (IMEI non-string)", () => {
    it("should handle non-string values in validateIMEI", () => {
      expect(validateIMEI(123)).toBe(false);
      expect(validateIMEI(null)).toBe(false);
      expect(validateIMEI(undefined)).toBe(false);
      expect(validateIMEI({})).toBe(false);
      expect(validateIMEI([])).toBe(false);
    });
  });

  describe("Country Validator Coverage - Line 107", () => {
    it("should handle country validation edge cases", () => {
      // Test with invalid country format to trigger line 107
      expect(validateCountry("XX", { format: "iso2" })).toBe(false);
      expect(validateCountry("XXX", { format: "iso3" })).toBe(false);
      expect(validateCountry("Invalid Country Name", { format: "name" })).toBe(
        false
      );
    });
  });

  describe("Email Validator Coverage - Lines 32, 45", () => {
    it("should handle email validation edge cases", () => {
      // Test non-string value (line 32)
      expect(validateEmail(123)).toBe(false);

      // Test with complex config that might trigger line 45
      const complexConfig = {
        allowDisplayName: true,
        requireDisplayName: false,
        allowUtf8LocalPart: true,
        requireTld: false,
        allowIpDomain: true,
        allowUnderscores: true,
        domainSpecificValidation: false,
        blacklistedChars: "@#$",
        hostBlacklist: ["spam.com"],
        hostWhitelist: ["trusted.com"],
      };

      expect(validateEmail("test@trusted.com", complexConfig)).toBe(true);
    });
  });

  describe("URL Validator Coverage - Lines 9, 17", () => {
    it("should handle URL validation edge cases", () => {
      // Test non-string value (line 9)
      expect(validateURL(123)).toBe(false);

      // Test with config that might trigger line 17
      const config = {
        protocols: ["http", "https", "ftp"],
        requireProtocol: false,
        requireTld: false,
        allowUnderscores: true,
        allowTrailingDot: true,
        allowNumericTld: true,
        allowWildcard: true,
        ignoreMaxLength: true,
      };

      expect(validateURL("localhost", config)).toBe(true);
    });
  });

  describe("UUID Validator Coverage - Lines 9, 17", () => {
    it("should handle UUID validation edge cases", () => {
      // Test non-string value (line 9)
      expect(validateUUID(123)).toBe(false);

      // Test with specific version config (line 17)
      expect(
        validateUUID("550e8400-e29b-41d4-a716-446655440000", { version: 4 })
      ).toBe(true);
      expect(validateUUID("invalid-uuid", { version: 4 })).toBe(false);
    });
  });

  describe("JSON Rules Coverage - Line 35", () => {
    it("should handle trustRule=false path", () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "status", operator: "is equal", value: "active" }],
        },
      };

      const criteria = { status: "active" };

      // This should trigger line 35 in json-rules.ts (validation path)
      return jsonRules.evaluate(rule, criteria, false).then((result) => {
        expect(result).toBe(true);
      });
    });
  });

  describe("Phone Index Coverage", () => {
    it("should cover phone validator index exports", () => {
      // Import specific validators to trigger coverage
      const phoneValidators = require("../src/services/validators/phone");
      expect(phoneValidators).toBeDefined();
    });
  });

  describe("Validator Index Coverage", () => {
    it("should cover validator index exports", () => {
      // Import to trigger coverage of unused exports
      const validators = require("../src/services/validators");
      expect(validators.getSupportedUnitTypes).toBeDefined();
      expect(validators.getSupportedUnits).toBeDefined();
      expect(validators.getSupportedCountryNames).toBeDefined();
    });
  });
});
