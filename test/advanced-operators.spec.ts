import { JsonRules } from "../src";
import { Rule } from "../src/types";

describe("Advanced Operators", () => {
  describe("Math Validators", () => {
    describe("is even", () => {
      it("should return true for even numbers", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is even", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: 0 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: 2 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: -4 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: 100 })).toBe(true);
      });

      it("should return false for odd numbers", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is even", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: 1 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: 3 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: -5 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: 99 })).toBe(false);
      });

      it("should return false for non-numbers", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is even", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: "2" })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: null })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: undefined })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: true })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: [] })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: {} })).toBe(false);
      });

      it("should return false for special numeric values", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is even", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: NaN })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: Infinity })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: -Infinity })).toBe(false);
      });

      it("should handle decimal numbers correctly", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is even", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: 2.0 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: 2.5 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: 3.0 })).toBe(false);
      });
    });

    describe("is odd", () => {
      it("should return true for odd numbers", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is odd", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: 1 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: 3 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: -5 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: 99 })).toBe(true);
      });

      it("should return false for even numbers", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is odd", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: 0 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: 2 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: -4 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: 100 })).toBe(false);
      });

      it("should return false for non-numbers", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is odd", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: "3" })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: null })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: undefined })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: false })).toBe(false);
      });

      it("should return false for special numeric values", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is odd", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: NaN })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: Infinity })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: -Infinity })).toBe(false);
      });
    });

    describe("is positive", () => {
      it("should return true for positive numbers", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is positive", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: 1 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: 0.1 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: 100 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: 999.99 })).toBe(true);
      });

      it("should return false for zero", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is positive", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: 0 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: -0 })).toBe(false);
      });

      it("should return false for negative numbers", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is positive", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: -1 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: -0.1 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: -100 })).toBe(false);
      });

      it("should return false for non-numbers", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is positive", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: "1" })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: null })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: undefined })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: true })).toBe(false);
      });

      it("should return false for special numeric values", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is positive", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: NaN })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: Infinity })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: -Infinity })).toBe(false);
      });
    });

    describe("is negative", () => {
      it("should return true for negative numbers", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is negative", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: -1 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: -0.1 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: -100 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: -999.99 })).toBe(true);
      });

      it("should return false for zero", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is negative", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: 0 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: -0 })).toBe(false);
      });

      it("should return false for positive numbers", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is negative", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: 1 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: 0.1 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: 100 })).toBe(false);
      });

      it("should return false for non-numbers", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is negative", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: "-1" })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: null })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: undefined })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: false })).toBe(false);
      });

      it("should return false for special numeric values", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is negative", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: NaN })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: Infinity })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: -Infinity })).toBe(false);
      });
    });
  });

  describe("Empty Validators", () => {
    describe("is empty", () => {
      it("should return true for null and undefined", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: null })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: undefined })).toBe(true);
      });

      it("should return true for empty string", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: "" })).toBe(true);
      });

      it("should return true for empty array", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: [] })).toBe(true);
      });

      it("should return false for zero", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: 0 })).toBe(false);
      });

      it("should return false for false", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: false })).toBe(false);
      });

      it("should return false for non-empty values", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: "hello" })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: " " })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: [1] })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: { key: "value" } })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: {} })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: 1 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: true })).toBe(false);
      });

      it("should handle missing field as undefined", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "missingField", operator: "is empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, {})).toBe(true);
      });
    });

    describe("is not empty", () => {
      it("should return false for null and undefined", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is not empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: null })).toBe(false);
        expect(await JsonRules.evaluate(rule, { value: undefined })).toBe(false);
      });

      it("should return false for empty string", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is not empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: "" })).toBe(false);
      });

      it("should return false for empty array", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is not empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: [] })).toBe(false);
      });

      it("should return true for zero", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is not empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: 0 })).toBe(true);
      });

      it("should return true for false", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is not empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: false })).toBe(true);
      });

      it("should return true for non-empty values", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "value", operator: "is not empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, { value: "hello" })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: " " })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: [1] })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: { key: "value" } })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: {} })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: 1 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { value: true })).toBe(true);
      });

      it("should handle missing field as undefined", async () => {
        const rule: Rule = {
          conditions: { all: [{ field: "missingField", operator: "is not empty", value: null }] },
        };

        expect(await JsonRules.evaluate(rule, {})).toBe(false);
      });
    });
  });

  describe("Complex Rules with New Operators", () => {
    it("should handle complex rules with multiple new operators", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "count", operator: "is even", value: null },
            { field: "score", operator: "is positive", value: null },
            { field: "name", operator: "is not empty", value: null },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, {
        count: 4,
        score: 85.5,
        name: "John"
      })).toBe(true);

      expect(await JsonRules.evaluate(rule, {
        count: 3, // odd - should fail
        score: 85.5,
        name: "John"
      })).toBe(false);

      expect(await JsonRules.evaluate(rule, {
        count: 4,
        score: -10, // negative - should fail
        name: "John"
      })).toBe(false);

      expect(await JsonRules.evaluate(rule, {
        count: 4,
        score: 85.5,
        name: "" // empty - should fail
      })).toBe(false);
    });

    it("should handle granular rules with new operators", async () => {
      const rule: Rule = {
        conditions: [
          {
            all: [
              { field: "value", operator: "is even", value: null },
              { field: "value", operator: "is positive", value: null },
            ],
            result: "even-positive",
          },
          {
            all: [
              { field: "value", operator: "is odd", value: null },
              { field: "value", operator: "is negative", value: null },
            ],
            result: "odd-negative",
          },
        ],
        default: "other",
      };

      expect(await JsonRules.evaluate(rule, { value: 4 })).toBe("even-positive");
      expect(await JsonRules.evaluate(rule, { value: -3 })).toBe("odd-negative");
      expect(await JsonRules.evaluate(rule, { value: 3 })).toBe("other");
      expect(await JsonRules.evaluate(rule, { value: -4 })).toBe("other");
      expect(await JsonRules.evaluate(rule, { value: 0 })).toBe("other");
    });
  });
});
