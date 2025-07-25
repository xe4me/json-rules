import { JsonRules } from "../src/services/json-rules";
import { Evaluator } from "../src/services/evaluator";
import { Validator } from "../src/services/validator";
import { RuleHelper } from "../src/services/rule-helper";
import { Rule, Condition } from "../src/types";

describe("Exact 100% Coverage - Surgical Precision", () => {
  let jsonRules: JsonRules;
  let validator: Validator;
  let ruleHelper: RuleHelper;

  beforeEach(() => {
    jsonRules = new JsonRules();
    validator = new Validator();
    ruleHelper = new RuleHelper();
  });

  describe("Target Exact Line Numbers", () => {
    it("should hit evaluator.ts line 151 specifically", () => {
      // Need to trigger isConstraint path in the condition evaluation loop
      const rule: Rule = {
        conditions: {
          all: [
            // First a constraint to ensure we're in the right loop iteration
            { field: "status", operator: "is equal", value: "active" },
            // Then another constraint that will hit line 156-160 (isConstraint block)
            { field: "verified", operator: "is equal", value: true }
          ]
        }
      };

      const criteria = { status: "active", verified: true };
      
      return jsonRules.evaluate(rule, criteria, true).then(result => {
        expect(result).toBe(true);
      });
    });

    it("should hit evaluator.ts lines 220-237 (date comparison methods)", () => {
      const testDate = new Date('2023-06-15');
      const beforeDate = new Date('2023-06-10');
      const afterDate = new Date('2023-06-20');

      // Test #isBefore method
      const beforeRule: Rule = {
        conditions: {
          all: [{ field: "date", operator: "is before", value: afterDate }]
        }
      };

      // Test #isAfter method  
      const afterRule: Rule = {
        conditions: {
          all: [{ field: "date", operator: "is after", value: beforeDate }]
        }
      };

      // Test #isOnOrBefore method
      const onOrBeforeRule: Rule = {
        conditions: {
          all: [{ field: "date", operator: "is on or before", value: afterDate }]
        }
      };

      // Test #isOnOrAfter method
      const onOrAfterRule: Rule = {
        conditions: {
          all: [{ field: "date", operator: "is on or after", value: beforeDate }]
        }
      };

      const criteria = { date: testDate };

      return Promise.all([
        jsonRules.evaluate(beforeRule, criteria, true),
        jsonRules.evaluate(afterRule, criteria, true),
        jsonRules.evaluate(onOrBeforeRule, criteria, true),
        jsonRules.evaluate(onOrAfterRule, criteria, true)
      ]).then(results => {
        expect(results).toEqual([true, true, true, true]);
      });
    });

    it("should hit json-rules.ts line 35 (validation branch)", () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "test", operator: "is equal", value: "pass" }]
        }
      };

      const criteria = { test: "pass" };

      // Use trustRule=false to force validation path
      return jsonRules.evaluate(rule, criteria, false).then(result => {
        expect(result).toBe(true);
      });
    });

    it("should hit validator.ts line 84 (null rule validation)", () => {
      const result = validator.validate(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error?.message).toContain("rule must be a valid JSON object");
    });

    it("should hit validator.ts lines 386-391 (template validation)", () => {
      const templateRule: Rule = {
        conditions: {
          all: [
            {
              field: "user.settings.theme",
              operator: "is equal",
              value: "{app.defaultTheme}"
            }
          ]
        }
      };

      const result = validator.validate(templateRule);
      expect(result.isValid).toBe(true);
    });

    it("should hit rule-helper.ts line 38 (constraint check)", () => {
      // Create a condition with sub-rules that contain constraints to hit line 38 (constraint ignore logic)
      const conditionWithConstraints: Condition = {
        all: [
          {
            any: [
              { field: "status", operator: "is equal", value: "active" },
              { field: "verified", operator: "is equal", value: true }
            ],
            result: "sub_rule_with_constraints"
          }
        ]
      };

      const result = ruleHelper.extractSubRules(conditionWithConstraints);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should hit rule-helper.ts lines 96, 105, 123 (nested processing)", () => {
      // Create deeply nested conditions to trigger all the nested processing paths
      const complexCondition: Condition = {
        all: [
          {
            any: [
              { field: "status", operator: "is equal", value: "active" },
              {
                none: [
                  { field: "disabled", operator: "is equal", value: true },
                  {
                    all: [
                      { field: "archived", operator: "is equal", value: false }
                    ],
                    result: "archive_check"
                  }
                ],
                result: "disabled_check"
              }
            ]
          },
          {
            all: [
              { field: "verified", operator: "is equal", value: true }
            ],
            result: "verified_user"
          }
        ]
      };

      // This should hit the nested extraction logic
      const extracted = ruleHelper.extractSubRules(complexCondition);
      expect(extracted.length).toBeGreaterThan(0);

      // This should hit the nested removal logic
      const cleaned = ruleHelper.removeAllSubRules(complexCondition);
      expect(cleaned).toBeTruthy();

      // This should hit the nested stripNullProps logic
      const objectWithDeepNulls = {
        level1: {
          level2: {
            level3: {
              level4: {
                validProp: "value",
                nullProp: null,
                deepArray: [
                  { valid: "keep", invalid: null },
                  null,
                  { nested: { keep: "this", remove: null } }
                ]
              },
              nullLevel4: null
            },
            nullLevel3: null
          },
          nullLevel2: null
        },
        validTop: "keep",
        nullTop: null
      };

      const stripped = ruleHelper.stripNullProps(objectWithDeepNulls);
      expect(stripped.nullTop).toBeUndefined();
      expect(stripped.validTop).toBe("keep");
    });

    it("should hit remaining validator lines (codes.ts line 31, email.ts line 45, etc.)", () => {
      // Import validators directly to test specific config paths
      const { validateEAN, validateIMEI } = require("../src/services/validators/codes");
      const { validateEmail } = require("../src/services/validators/email");
      const { validateURL } = require("../src/services/validators/url");
      const { validateUUID } = require("../src/services/validators/uuid");
      const { validateCountry } = require("../src/services/validators/country");

      // Hit codes.ts line 31 (IMEI config branch)
      expect(validateIMEI("490154203237518", { allowHyphens: true })).toBe(true);

      // Hit email.ts line 45 (specific config combination)
      const emailConfig = {
        allowDisplayName: true,
        requireDisplayName: false,
        allowUtf8LocalPart: true,
        requireTld: false,
        allowIpDomain: true,
        allowUnderscores: true,
        domainSpecificValidation: false
      };
      expect(validateEmail("test@127.0.0.1", emailConfig)).toBe(true);

      // Hit url.ts line 17 (specific config)
      const urlConfig = {
        protocols: ["http", "https"],
        requireProtocol: false,
        requireTld: false,
        allowUnderscores: true,
        allowTrailingDot: true,
        allowNumericTld: true,
        allowWildcard: true,
        ignoreMaxLength: true
      };
      expect(validateURL("test.123", urlConfig)).toBe(true);

      // Hit uuid.ts line 17 (version config)
      expect(validateUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8", { version: 1 })).toBe(true);

      // Hit country.ts line 107 (invalid country)
      expect(validateCountry("INVALID", { format: "iso2" })).toBe(false);
    });

    it("should trigger error conditions for coverage", () => {
      // Test invalid regex pattern to hit evaluator error paths
      const invalidRegexRule: Rule = {
        conditions: {
          all: [
            { 
              field: "text", 
              operator: "matches", 
              value: { invalidFormat: "not a regex pattern" } as any
            }
          ]
        }
      };

      const criteria = { text: "test" };

      return expect(jsonRules.evaluate(invalidRegexRule, criteria, true))
        .rejects.toThrow("Invalid regex pattern format");
    });

    it("should test edge cases for complete coverage", () => {
      // Test isBetween with invalid ranges
      const invalidRangeRule: Rule = {
        conditions: {
          all: [
            { field: "score", operator: "is between numbers", value: [10] as any }
          ]
        }
      };

      const criteria = { score: 15 };

      return jsonRules.evaluate(invalidRangeRule, criteria, true).then(result => {
        expect(result).toBe(false);
      });
    });
  });
}); 