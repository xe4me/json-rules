import { JsonRules } from "../src";
import { Rule, Condition } from "../src";
import { Validator } from "../src/services";
import { RuleHelper } from "../src/services";
import { validateURL } from "../src/services/validators";
import { validateUUID } from "../src/services/validators";
import { validateIMEI } from "../src/services/validators";
import { validateEmail } from "../src/services/validators";
import { validateDomain } from "../src/services/validators";
import { validateCountry } from "../src/services/validators";

describe("Final 100% Coverage Push", () => {
  let jsonRules: JsonRules;
  let validator: Validator;
  let ruleHelper: RuleHelper;

  beforeEach(() => {
    jsonRules = new JsonRules();
    validator = new Validator();
    ruleHelper = new RuleHelper();
  });

  describe("Target Remaining Uncovered Lines", () => {
    it("should cover evaluator line 151 (isConstraint in loop)", () => {
      // Test the specific case where a constraint is processed in the condition loop
      const rule: Rule = {
        conditions: {
          all: [
            // This constraint should trigger line 151
            { field: "status", operator: "is equal", value: "active" },
            // Mixed with a condition to ensure the loop continues
            {
              any: [{ field: "role", operator: "is equal", value: "admin" }],
            },
          ],
        },
      };

      const criteria = { status: "active", role: "admin" };

      const result = jsonRules.evaluate(rule, criteria, true);
      expect(result).toBe(true);
    });

    it("should cover evaluator lines 220-237 (#isBefore, #isAfter, #isOnOrBefore, #isOnOrAfter)", () => {
      const baseDate = new Date("2023-01-15");
      const beforeDate = new Date("2023-01-10");
      const afterDate = new Date("2023-01-20");

      const beforeRule: Rule = {
        conditions: {
          all: [{ field: "date", operator: "is before", value: afterDate }],
        },
      };

      const afterRule: Rule = {
        conditions: {
          all: [{ field: "date", operator: "is after", value: beforeDate }],
        },
      };

      const onOrBeforeRule: Rule = {
        conditions: {
          all: [
            { field: "date", operator: "is on or before", value: afterDate },
          ],
        },
      };

      const onOrAfterRule: Rule = {
        conditions: {
          all: [
            { field: "date", operator: "is on or after", value: beforeDate },
          ],
        },
      };

      const criteria = { date: baseDate };

      expect(jsonRules.evaluate(beforeRule, criteria, true)).toBe(true);
      expect(jsonRules.evaluate(afterRule, criteria, true)).toBe(true);
      expect(jsonRules.evaluate(onOrBeforeRule, criteria, true)).toBe(true);
      expect(jsonRules.evaluate(onOrAfterRule, criteria, true)).toBe(true);
    });

    it("should cover json-rules line 35 (validation path)", () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "status", operator: "is equal", value: "active" }],
        },
      };

      const criteria = { status: "active" };

      // Use trustRule=false to trigger validation path
      expect(jsonRules.evaluate(rule, criteria, false)).toBe(true);
    });

    it("should cover validator lines 84, 386-391", () => {
      // Line 84 - null rule
      const nullResult = validator.validate(null as any);
      expect(nullResult.isValid).toBe(false);

      // Lines 386-391 - complex template validation
      const templateRule: Rule = {
        conditions: {
          all: [
            {
              field: "user.profile.preferences.theme",
              operator: "is equal",
              value: "{app.settings.defaultTheme}",
            },
            {
              field: "user.permissions.level",
              operator: "is equal",
              value: "{system.security.requiredLevel}",
            },
          ],
        },
      };

      const templateResult = validator.validate(templateRule);
      expect(templateResult.isValid).toBe(true);
    });

    it("should cover rule-helper lines 38, 96, 105, 123", () => {
      // Test extractSubRules with non-object input to trigger line 38
      try {
        ruleHelper.extractSubRules(null as any);
      } catch (e) {
        // Expected to fail
      }

      // Test complex nested structure to trigger lines 96, 105, 123
      const deeplyNestedCondition: Condition = {
        all: [
          {
            any: [
              { field: "status", operator: "is equal", value: "active" },
              {
                none: [
                  { field: "disabled", operator: "is equal", value: true },
                  {
                    all: [
                      { field: "archived", operator: "is equal", value: false },
                    ],
                    result: "archived_check",
                  },
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

      const extracted = ruleHelper.extractSubRules(deeplyNestedCondition);
      expect(extracted.length).toBeGreaterThan(0);

      const cleaned = ruleHelper.removeAllSubRules(deeplyNestedCondition);
      expect(cleaned).toBeTruthy();

      // Test stripNullProps with complex nested structures
      const complexObject = {
        level1: {
          level2: {
            level3: {
              level4: {
                validProp: "value",
                nullProp: null,
                arrayProp: [
                  { item: "valid", nullItem: null },
                  null,
                  { nested: { valid: "data", nullNested: null } },
                ],
              },
              nullLevel4: null,
            },
          },
        },
        topLevel: "keep",
        topLevelNull: null,
      };

      const stripped = ruleHelper.stripNullProps(complexObject);
      expect(stripped.topLevelNull).toBeUndefined();
      expect(stripped.topLevel).toBe("keep");
    });

    it("should cover specific validator configuration lines", () => {
      // Email line 45 - specific config combination
      const emailConfig = {
        allowDisplayName: true,
        requireDisplayName: false,
        allowUtf8LocalPart: true,
        requireTld: false,
        allowIpDomain: true,
        allowUnderscores: true,
        domainSpecificValidation: false,
        blacklistedChars: "",
        hostBlacklist: [],
        hostWhitelist: [],
      };

      expect(validateEmail("test@192.168.1.1", emailConfig)).toBe(true);

      // URL line 17 - specific config
      const urlConfig = {
        protocols: ["http", "https"],
        requireProtocol: false,
        requireTld: false,
        allowUnderscores: true,
        allowTrailingDot: true,
        allowNumericTld: true,
        allowWildcard: true,
        ignoreMaxLength: true,
      };

      expect(validateURL("example.123", urlConfig)).toBe(true);

      // UUID line 17 - specific version config
      expect(
        validateUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8", { version: 1 })
      ).toBe(true);

      // IMEI line 31 - config path
      expect(validateIMEI("490154203237518", { allowHyphens: true })).toBe(
        true
      );

      // Country line 107 - invalid input
      expect(validateCountry(null as any, { format: "iso2" })).toBe(false);

      // Domain line 9 - non-string input
      expect(validateDomain(123)).toBe(false);
    });
  });
});
