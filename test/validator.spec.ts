import { valid1Json } from "./rulesets/valid1.json";
import { valid3Json } from "./rulesets/valid3.json";
import { valid10Json } from "./rulesets/valid10.json";
import { invalid1Json } from "./rulesets/invalid1.json";
import { invalid3Json } from "./rulesets/invalid3.json";
import { subRulesValid1Json } from "./rulesets/sub-rules-valid1.json";

import { JsonRules, Condition, Constraint } from "../src";

describe("JsonRules validator correctly", () => {
  it("Identifies a bad operator", () => {
    expect(
      JsonRules.validate({
        conditions: [
          {
            all: [
              { field: "name", operator: "*", value: "test" as any } as any,
            ],
          },
        ],
      }).isValid
    ).toEqual(false);
  });

  it("Identifies an invalid field", () => {
    expect(
      JsonRules.validate({
        conditions: [
          {
            all: [
              {
                field: true as unknown as string,
                operator: "is equal",
                value: "test" as any,
              },
            ],
          },
        ],
      }).isValid
    ).toEqual(false);
  });

  it("Identifies an invalid condition", () => {
    expect(
      JsonRules.validate({
        conditions: [
          {
            all: [
              {
                field: "foo",
                operator: "is equal",
                value: "bar",
              },
            ],
            any: [],
          },
        ],
      }).isValid
    ).toEqual(false);
  });

  it("Identifies an invalid node", () => {
    expect(
      JsonRules.validate({
        conditions: [
          {
            all: [
              {
                operator: "is equal",
                value: "bar",
              } as Constraint,
            ],
          },
        ],
      }).isValid
    ).toEqual(false);
  });

  it("Identifies an badly constructed condition", () => {
    expect(
      JsonRules.validate({
        conditions: [
          {
            foo: [
              {
                field: "foo",
                operator: "is equal",
                value: "bar",
              },
            ],
          } as Condition,
        ],
      }).isValid
    ).toEqual(false);
  });

  it("Identifies an invalid rule", () => {
    const validation = JsonRules.validate(invalid1Json);

    expect(validation.isValid).toEqual(false);
    expect(validation.error?.message).toEqual(
      "Each node should be a condition or a constraint."
    );
  });

  it("Identifies an empty rule", () => {
    const validation = JsonRules.validate({ conditions: [] });

    expect(validation.isValid).toEqual(false);
    expect(validation.error?.message).toEqual(
      "The conditions property must contain at least one condition."
    );
  });

  it("Identifies invalid values for In/NotIn/ContainsAny operators", () => {
    expect(
      JsonRules.validate({
        conditions: [
          { all: [{ field: "name", operator: "in", value: "test" as any }] },
        ],
      }).isValid
    ).toEqual(false);

    expect(
      JsonRules.validate({
        conditions: [
          {
            all: [{ field: "name", operator: "not in", value: "test" as any }],
          },
        ],
      }).isValid
    ).toEqual(false);

    expect(
      JsonRules.validate({
        conditions: [
          {
            all: [
              { field: "name", operator: "contains any", value: "test" as any },
            ],
          },
        ],
      }).isValid
    ).toEqual(false);
  });

  it("Validates a correct rule", () => {
    expect(
      JsonRules.validate({
        conditions: [
          {
            all: [
              { field: "name", operator: "is equal", value: "test" as any },
            ],
          },
        ],
      }).isValid
    ).toEqual(true);
  });

  it("Validates a simple correct rule", () => {
    expect(JsonRules.validate(valid1Json).isValid).toEqual(true);
  });

  it("Validates a nested correct rule", () => {
    expect(JsonRules.validate(valid3Json).isValid).toEqual(true);
  });

  it("Validates a rule with sub rules correctly", async () => {
    expect(JsonRules.validate(subRulesValid1Json).isValid).toEqual(true);
  });
  it("Validates a rule with null values correctly - valid", async () => {
    expect(JsonRules.validate(valid10Json).isValid).toEqual(true);
  });
  it("Validates a rule with null values correctly - invalid", async () => {
    expect(JsonRules.validate(invalid3Json).isValid).toEqual(false);
  });
});
