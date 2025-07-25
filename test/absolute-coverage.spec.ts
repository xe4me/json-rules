import { JsonRules } from "../src";
import { Rule, Condition } from "../src";
import { Validator } from "../src/services";
import { RuleHelper } from "../src/services";
import { validateURL } from "../src/services/validators";
import { validateUUID } from "../src/services/validators";
import { validateEmail } from "../src/services/validators";
import { validateCountry } from "../src/services/validators";
import { validateEAN, validateIMEI } from "../src/services/validators";

describe("Absolute 100% Coverage", () => {
  let jsonRules: JsonRules;
  let validator: Validator;
  let ruleHelper: RuleHelper;

  beforeEach(() => {
    jsonRules = new JsonRules();
    validator = new Validator();
    ruleHelper = new RuleHelper();
  });

  describe("Target Evaluator Line 151 (isConstraint path)", () => {
    it("should handle mixed condition arrays with constraints", () => {
      // This should trigger the isConstraint path in evaluator line 151
      const rule: Rule = {
        conditions: {
          all: [
            // This is a constraint (should trigger line 151)
            { field: "status", operator: "is equal", value: "active" },
            // This is a nested condition
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

  describe("Target Evaluator Lines 209-237 (regex and isBetween)", () => {
    it("should trigger #createRegExp error path", () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "text",
              operator: "matches",
              value: { invalidFormat: true } as any, // Wrong format to trigger error
            },
          ],
        },
      };

      const criteria = { text: "test" };

      return expect(jsonRules.evaluate(rule, criteria, true)).rejects.toThrow(
        "Invalid regex pattern format"
      );
    });

    it("should trigger #isBetween edge cases", () => {
      // Test with null range
      const nullRangeRule: Rule = {
        conditions: {
          all: [
            {
              field: "score",
              operator: "is between numbers",
              value: null as any,
            },
          ],
        },
      };

      // Test with wrong array length
      const wrongLengthRule: Rule = {
        conditions: {
          all: [
            {
              field: "score",
              operator: "is between numbers",
              value: [10, 20, 30] as any,
            },
          ],
        },
      };

      const criteria = { score: 15 };

      return Promise.all([
        jsonRules.evaluate(nullRangeRule, criteria, true).then((result) => {
          expect(result).toBe(false);
        }),
        jsonRules.evaluate(wrongLengthRule, criteria, true).then((result) => {
          expect(result).toBe(false);
        }),
      ]);
    });
  });

  describe("Target JSON Rules Line 35 (validation path)", () => {
    it("should trigger validation path in json-rules", () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "status", operator: "is equal", value: "active" }],
        },
      };

      const criteria = { status: "active" };

      // trustRule=false should trigger line 35 (validation)
      return jsonRules.evaluate(rule, criteria, false).then((result) => {
        expect(result).toBe(true);
      });
    });
  });

  describe("Target Validator Lines 84, 386-391", () => {
    it("should handle null rule and template validation edge cases", () => {
      // Line 84 - null rule
      const result1 = validator.validate(null as any);
      expect(result1.isValid).toBe(false);

      // Lines 386-391 - complex template validation
      const complexRule: Rule = {
        conditions: {
          all: [
            {
              field: "user.profile.settings.theme",
              operator: "is equal",
              value: "{app.config.defaultTheme}",
            },
            {
              field: "permissions.admin",
              operator: "is equal",
              value: "{user.roles.primary}",
            },
          ],
        },
      };

      const result2 = validator.validate(complexRule);
      expect(result2.isValid).toBe(true);
    });
  });

  describe("Target Rule Helper Lines 38, 96, 105, 123", () => {
    it("should cover rule helper edge cases", () => {
      // Create conditions that will exercise the different paths
      const complexCondition: Condition = {
        all: [
          {
            any: [
              { field: "status", operator: "is equal", value: "active" },
              {
                none: [
                  { field: "disabled", operator: "is equal", value: true },
                ],
                result: "disabled_check",
              },
            ],
          },
          {
            all: [{ field: "verified", operator: "is equal", value: true }],
            result: "verified_user",
          },
        ],
      };

      // Test extractSubRules
      const extracted = ruleHelper.extractSubRules(complexCondition);
      expect(extracted.length).toBeGreaterThan(0);

      // Test removeAllSubRules
      const cleaned = ruleHelper.removeAllSubRules(complexCondition);
      expect(cleaned).toBeTruthy();

      // Test stripNullProps with deeply nested structures
      const deepObject = {
        level1: {
          level2: {
            level3: {
              validProp: "value",
              nullProp: null,
            },
            nullLevel3: null,
          },
          arrayWithNulls: [{ valid: "data", nullItem: null }, null, "string"],
        },
        topLevelNull: null,
        topLevelValid: "keep",
      };

      const stripped = ruleHelper.stripNullProps(deepObject);
      expect(stripped.topLevelNull).toBeUndefined();
      expect(stripped.topLevelValid).toBe("keep");
    });
  });

  describe("Target Validator Non-String Handling", () => {
    it("should cover non-string input handling for all validators", () => {
      // EAN non-string (line 22 in codes.ts)
      expect(validateEAN(12345)).toBe(false);
      expect(validateEAN({})).toBe(false);
      expect(validateEAN([])).toBe(false);
      expect(validateEAN(true)).toBe(false);

      // IMEI non-string (line 30 in codes.ts) - updated line number
      expect(validateIMEI(12345)).toBe(false);
      expect(validateIMEI({})).toBe(false);
      expect(validateIMEI([])).toBe(false);
      expect(validateIMEI(true)).toBe(false);

      // Country validation edge case (line 107)
      expect(validateCountry(123 as any, { format: "iso2" })).toBe(false);

      // Email non-string (line 32)
      expect(validateEmail(123)).toBe(false);
      expect(validateEmail({})).toBe(false);

      // URL non-string (line 9)
      expect(validateURL(123)).toBe(false);
      expect(validateURL({})).toBe(false);

      // UUID non-string (line 9)
      expect(validateUUID(123)).toBe(false);
      expect(validateUUID({})).toBe(false);
    });
  });

  describe("Target Specific Validator Configuration Lines", () => {
    it("should trigger specific configuration branches", () => {
      // Email line 45 - complex configuration
      const emailConfig = {
        allowDisplayName: false,
        requireDisplayName: true, // This combination might trigger line 45
        allowUtf8LocalPart: false,
        requireTld: true,
        allowIpDomain: false,
        allowUnderscores: false,
        domainSpecificValidation: true,
        blacklistedChars: "#$%",
        hostBlacklist: ["bad.com"],
        hostWhitelist: ["good.com"],
      };

      expect(validateEmail("invalid@bad.com", emailConfig)).toBe(false);

      // URL line 17 - specific config
      const urlConfig = {
        protocols: ["https"],
        requireProtocol: true,
        requireTld: true,
        allowUnderscores: false,
        allowTrailingDot: false,
        allowNumericTld: false,
        allowWildcard: false,
        ignoreMaxLength: false,
      };

      expect(validateURL("invalid://test", urlConfig)).toBe(false);

      // UUID line 17 - specific version
      expect(validateUUID("not-a-uuid", { version: 4 })).toBe(false);

      // IMEI line 31 - updated line number for specific config
      expect(validateIMEI("490154203237518", { allowHyphens: false })).toBe(
        true
      );
    });
  });
});
