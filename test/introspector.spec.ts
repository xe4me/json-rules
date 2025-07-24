import { valid3Json } from "./rulesets/valid3.json";
import { valid4Json } from "./rulesets/valid4.json";
import { valid6Json } from "./rulesets/valid6.json";
import { valid7Json } from "./rulesets/valid7.json";
import { valid8Json } from "./rulesets/valid8.json";
import { valid9Json } from "./rulesets/valid9.json";
import { valid11Json } from "./rulesets/valid11.json";
import { invalid1Json } from "./rulesets/invalid1.json";
import { subRulesValid2Json } from "./rulesets/sub-rules-valid2.json";

import { Introspector } from "../src/services";
import { RuleError, JsonRules, Constraint } from "../src";

describe("JsonRules introspector correctly", () => {
  it("Detects invalid rules", async () => {
    const s = ["Leverage"];

    expect(() =>
      JsonRules.introspect(
        invalid1Json,
        { field: "CountryIso", value: "GB" },
        s
      )
    ).toThrow(RuleError);
  });

  it("Introspects valid rules", async () => {
    let sub: string[] = ["Leverage"];
    let con: any = { field: "CountryIso", value: "GB" };
    expect(JsonRules.introspect(valid3Json, con, sub)).toEqual([
      {
        result: 3,
        subjects: [
          {
            subject: "Leverage",
            values: [
              { operator: "is greater than or equal", value: 1000 },
              { operator: "is less than", value: 200 },
            ],
          },
        ],
      },
    ]);

    sub = ["Monetization"];
    con = { field: "Leverage", value: 199 };
    expect(JsonRules.introspect(valid3Json, con, sub)).toEqual([
      {
        result: 3,
        subjects: [
          {
            subject: "Monetization",
            values: [{ operator: "==", value: "Real" }],
          },
        ],
      },
    ]);

    sub = ["Monetization"];
    con = { field: "Leverage", value: 200 };
    expect(JsonRules.introspect(valid3Json, con, sub)).toEqual([]);

    sub = ["Leverage"];
    con = { field: "Category", value: 22 };
    expect(JsonRules.introspect(valid4Json, con, sub)).toEqual([
      {
        result: 3,
        subjects: [
          {
            subject: "Leverage",
            values: [
              { operator: "==", value: 1000 },
              { operator: "==", value: 500 },
              { operator: "is less than", value: 200 },
            ],
          },
        ],
      },
    ]);

    sub = ["Category"];
    con = { field: "Leverage", value: 199 };
    expect(JsonRules.introspect(valid4Json, con, sub)).toEqual([
      {
        result: 3,
        subjects: [
          {
            subject: "Category",
            values: [
              { operator: "is greater than or equal", value: 1000 },
              { operator: "==", value: 22 },
              { operator: "==", value: 11 },
              { operator: "==", value: 12 },
            ],
          },
        ],
      },
      {
        result: 4,
        subjects: [
          {
            subject: "Category",
            values: [{ operator: "==", value: "Islamic" }],
          },
        ],
      },
    ]);

    sub = ["IsUnder18"];
    con = { field: "Category", value: "Islamic" };
    expect(JsonRules.introspect(valid6Json, con, sub)).toEqual([]);

    sub = ["IsUnder18"];
    con = { field: "Category", value: 122 };
    expect(JsonRules.introspect(valid6Json, con, sub)).toEqual([]);

    sub = ["Monetization"];
    con = { field: "Category", value: 11 };
    expect(JsonRules.introspect(valid6Json, con, sub)).toEqual([]);

    sub = ["Leverage"];
    con = { field: "CountryIso", value: "DK" };
    expect(JsonRules.introspect(valid7Json, con, sub)).toEqual([
      {
        result: 3,
        subjects: [
          {
            subject: "Leverage",
            values: [
              { operator: "is less than", value: 1000 },
              { operator: "is greater than or equal", value: 200 },
            ],
          },
        ],
      },
    ]);

    sub = ["Leverage"];
    con = { field: "CountryIso", value: "FI" };
    expect(JsonRules.introspect(valid7Json, con, sub)).toEqual([]);

    sub = ["OtherType"];
    con = { field: "Leverage", value: 999 };
    expect(JsonRules.introspect(valid8Json, con, sub)).toEqual([
      {
        result: 3,
        subjects: [
          {
            subject: "OtherType",
            values: [{ operator: "in", value: ["Live", "Fun"] }],
          },
        ],
      },
    ]);

    sub = ["totalCheckoutPrice"];
    con = { field: "country", value: "SE" };
    expect(JsonRules.introspect(valid9Json, con, sub)).toEqual([]);

    sub = ["Leverage", "Monetization"];
    con = { field: "Category", value: 22 };
    expect(JsonRules.introspect(subRulesValid2Json, con, sub)).toEqual([
      {
        result: 3,
        subjects: [
          {
            subject: "Leverage",
            values: [
              { operator: "==", value: 1000 },
              { operator: "==", value: 500 },
              { operator: "==", value: "Demo" },
            ],
          },
        ],
      },
      {
        result: 15,
        subjects: [
          {
            subject: "Leverage",
            values: [
              { operator: "==", value: 1000 },
              { operator: "==", value: 500 },
              { operator: "==", value: "Demo" },
            ],
          },
        ],
      },
      {
        result: 12,
        subjects: [
          {
            subject: "Leverage",
            values: [
              { operator: "is greater than", value: 400 },
              { operator: "==", value: "Demo" },
            ],
          },
          {
            subject: "Monetization",
            values: [{ operator: "==", value: "Real" }],
          },
        ],
      },
      {
        result: 13,
        subjects: [
          {
            subject: "Leverage",
            values: [
              { operator: "==", value: 1000 },
              { operator: "==", value: 500 },
              { operator: "==", value: "Demo" },
            ],
          },
        ],
      },
    ]);
  });

  it("Sanitizes results correctly", async () => {
    let results: Constraint[] = [
      { field: "Lev", value: 200, operator: "is less than" },
      { field: "Lev", value: 200, operator: "==" },
    ];

    expect(IntrospectorSpec.sanitizeFn(results)).toEqual([
      { field: "Lev", value: 200, operator: "is less than or equal" },
    ]);

    results = [
      { field: "Lev", value: 200, operator: "is greater than" },
      { field: "Lev", value: 200, operator: "==" },
    ];

    expect(IntrospectorSpec.sanitizeFn(results)).toEqual([
      { field: "Lev", value: 200, operator: "is greater than or equal" },
    ]);

    results = [
      { field: "Lev", value: 200, operator: "is greater than" },
      { field: "Lev", value: 300, operator: "is greater than" },
    ];

    expect(IntrospectorSpec.sanitizeFn(results)).toEqual([
      { field: "Lev", value: 200, operator: "is greater than" },
    ]);

    results = [
      { field: "Lev", value: 200, operator: "is less than" },
      { field: "Lev", value: 300, operator: "is less than" },
    ];

    expect(IntrospectorSpec.sanitizeFn(results)).toEqual([
      { field: "Lev", value: 300, operator: "is less than" },
    ]);

    results = [
      { field: "Lev", value: [200], operator: "in" },
      { field: "Lev", value: [200, 300], operator: "in" },
    ];

    expect(IntrospectorSpec.sanitizeFn(results)).toEqual([
      { field: "Lev", value: [200, 300], operator: "in" },
    ]);

    results = [
      { field: "Lev", value: [400], operator: "in" },
      { field: "Lev", value: [200, 300], operator: "in" },
    ];

    expect(IntrospectorSpec.sanitizeFn(results)).toEqual([
      { field: "Lev", value: [200, 300, 400], operator: "in" },
    ]);

    results = [
      { field: "Lev", value: [200], operator: "not in" },
      { field: "Lev", value: [200, 300], operator: "not in" },
    ];

    expect(IntrospectorSpec.sanitizeFn(results)).toEqual([
      { field: "Lev", value: [200, 300], operator: "not in" },
    ]);

    results = [
      { field: "Lev", value: [400], operator: "not in" },
      { field: "Lev", value: [200, 300], operator: "not in" },
    ];

    expect(IntrospectorSpec.sanitizeFn(results)).toEqual([
      { field: "Lev", value: [200, 300, 400], operator: "not in" },
    ]);
  });

  it("Tests new introspection candidates against existing ones", async () => {
    const input = { field: "Category", value: 30 };

    let candidates: Constraint[] = [
      { field: "Lev", value: 200, operator: "is less than" },
      { field: "Lev", value: 20, operator: "is greater than" },
    ];

    let item: Constraint = { field: "Lev", value: 200, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 201, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 20, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 19, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 199, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 21, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 30, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 20, operator: "is greater than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 300, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 3, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 20, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 21, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 3, operator: "is less than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 210, operator: "is greater than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 200, operator: "is greater than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 199, operator: "is greater than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 210, operator: "is greater than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    //////////////////////////////////////////////////////////////////////

    candidates = [
      { field: "Lev", value: 200, operator: "is less than or equal" },
      { field: "Lev", value: 20, operator: "is greater than or equal" },
    ];

    item = { field: "Lev", value: 200, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 201, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 20, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 19, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 199, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 21, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 30, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 300, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 3, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 20, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 20, operator: "is greater than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 21, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 3, operator: "is less than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 210, operator: "is greater than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 200, operator: "is greater than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 199, operator: "is greater than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 210, operator: "is greater than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    //////////////////////////////////////////////////////////////////////

    candidates = [{ field: "Lev", value: 200, operator: "==" }];

    item = { field: "Lev", value: 210, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 200, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 200, operator: "is less than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 201, operator: "is less than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 190, operator: "is greater than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 200, operator: "is greater than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 200, operator: "is greater than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 99, operator: "is greater than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: [200, 300], operator: "in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: [300], operator: "in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: [200, 300], operator: "not in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: [300], operator: "not in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    //

    candidates = [{ field: "Lev", value: [10, 20, 30], operator: "in" }];

    item = { field: "Lev", value: 210, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 20, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 20, operator: "!=" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: [55, 65, 75], operator: "in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: [10, 65, 75], operator: "in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: [55, 65, 75], operator: "not in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: [10, 65, 75], operator: "not in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: [10, 20, 75], operator: "not in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: [10, 20, 30], operator: "not in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    //

    item = { field: "Lev", value: 30, operator: "is greater than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 30, operator: "is greater than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 30, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 40, operator: "is less than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 40, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    //

    item = { field: "Lev", value: 10, operator: "is less than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 10, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 10, operator: "is greater than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 5, operator: "is greater than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 5, operator: "is greater than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    //

    candidates = [{ field: "Lev", value: [10, 20, 30], operator: "not in" }];

    item = { field: "Lev", value: 210, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 20, operator: "==" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    item = { field: "Lev", value: 20, operator: "!=" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: [55, 65, 75], operator: "not in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: [10], operator: "not in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: [10, 65, 75], operator: "in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: [10, 20, 75], operator: "in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: [10, 20, 30], operator: "in" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(false);

    //

    item = { field: "Lev", value: 30, operator: "is greater than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 30, operator: "is greater than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 30, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 40, operator: "is less than" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);

    item = { field: "Lev", value: 40, operator: "is less than or equal" };
    expect(IntrospectorSpec.testFn(candidates, input, item)).toEqual(true);
  });

  it("Tests a rule with only sub-rules", async () => {
    const con = { field: "monetization", value: "demo" };

    expect(JsonRules.introspect(valid11Json, con, ["platform"])).toEqual([]);
    expect(JsonRules.introspect(valid11Json, con, ["currency"])).toEqual([
      {
        result: {
          groupId: 10997667,
          spreadPlan: "UBRK-GEN",
          commissionPlan: "UBRK-GEN-USD",
        },
        subjects: [
          { subject: "currency", values: [{ value: "USD", operator: "==" }] },
        ],
      },
      {
        result: {
          groupId: 10997668,
          spreadPlan: "UBRK-GEN",
          commissionPlan: "UBRK-GEN-USD",
        },
        subjects: [
          { subject: "currency", values: [{ value: "USD", operator: "==" }] },
        ],
      },
      {
        result: {
          groupId: 10997668,
          spreadPlan: "UBRK-GEN",
          commissionPlan: "UBRK-GEN-EUR",
        },
        subjects: [
          { subject: "currency", values: [{ value: "EUR", operator: "==" }] },
        ],
      },
      {
        result: {
          groupId: 10997668,
          spreadPlan: "UBRK-GEN",
          commissionPlan: "UBRK-GEN-BTC",
        },
        subjects: [
          { subject: "currency", values: [{ value: "BTC", operator: "==" }] },
        ],
      },
      {
        result: {
          groupId: 10997669,
          spreadPlan: "UBRK-GEN",
          commissionPlan: "UBRK-GEN-USD",
        },
        subjects: [
          { subject: "currency", values: [{ value: "USD", operator: "==" }] },
        ],
      },
    ]);
  });
});

class IntrospectorSpec extends Introspector {
  constructor() {
    super();
  }

  static testFn(
    candidates: Constraint[],
    input: Omit<Constraint, "operator">,
    item: Constraint
  ): any {
    return new IntrospectorSpec().test(candidates, [input], item, 0);
  }

  static sanitizeFn(constraints: Constraint[]): any {
    return new IntrospectorSpec().sanitize(constraints, 0);
  }
}
