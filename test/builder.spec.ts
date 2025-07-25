import { Rule, JsonRules } from "../src";

describe("JsonRules builder correctly", () => {
  it("Creates a valid ruleset", () => {
    const builder = JsonRules.builder();
    expect(
      JsonRules.validate(
        builder
          .add(
            builder.condition("all", [
              builder.constraint("field", "is equal", "value"),
            ])
          )
          .build()
      ).isValid
    ).toEqual(true);
  });

  it("Creates a complex ruleset properly", () => {
    const builder = JsonRules.builder();

    const rule: Rule = builder
      .add(
        builder.condition(
          "all",
          [
            builder.condition("any", [
              builder.constraint("fieldA", "is equal", "bar"),
              builder.constraint("fieldB", "is greater than or equal", 2),
            ]),
            builder.constraint("fieldC", "not in", [1, 2, 3]),
          ],
          3
        )
      )
      .add(
        builder.condition(
          "none",
          [builder.constraint("fieldC", "not in", [1, 2, 3])],
          5
        )
      )
      .add(
        builder.condition("any", [
          builder.constraint("fieldA", "is equal", "value"),
        ])
      )
      .default(2)
      .build(true);

    expect(rule).toEqual({
      conditions: [
        {
          all: [
            {
              any: [
                { field: "fieldA", operator: "is equal", value: "bar" },
                {
                  field: "fieldB",
                  operator: "is greater than or equal",
                  value: 2,
                },
              ],
            },
            { field: "fieldC", operator: "not in", value: [1, 2, 3] },
          ],
          result: 3,
        },
        {
          none: [{ field: "fieldC", operator: "not in", value: [1, 2, 3] }],
          result: 5,
        },
        {
          any: [{ field: "fieldA", operator: "is equal", value: "value" }],
        },
      ],
      default: 2,
    });
  });

  it("Creates a complex ruleset with sub rules", () => {
    const builder = JsonRules.builder();

    const rule: Rule = builder
      .add(
        builder.condition(
          "all",
          [
            builder.condition("any", [
              builder.constraint("fieldA", "is equal", "bar"),
              builder.constraint("fieldB", "is greater than or equal", 2),
              builder.condition(
                "all",
                [builder.constraint("fieldD", "is equal", "whoop")],
                33
              ),
            ]),
            builder.constraint("fieldC", "not in", [1, 2, 3]),
          ],
          3
        )
      )
      .add(
        builder.condition(
          "none",
          [builder.constraint("fieldE", "is equal", "hoop")],
          5
        )
      )
      .add(
        builder.condition("any", [
          builder.constraint("fieldA", "is equal", "value"),
        ])
      )
      .default(2)
      .build(true);

    expect(rule).toEqual({
      conditions: [
        {
          all: [
            {
              any: [
                { field: "fieldA", operator: "is equal", value: "bar" },
                {
                  field: "fieldB",
                  operator: "is greater than or equal",
                  value: 2,
                },
                {
                  all: [
                    { field: "fieldD", operator: "is equal", value: "whoop" },
                  ],
                  result: 33,
                },
              ],
            },
            { field: "fieldC", operator: "not in", value: [1, 2, 3] },
          ],
          result: 3,
        },
        {
          none: [{ field: "fieldE", operator: "is equal", value: "hoop" }],
          result: 5,
        },
        {
          any: [{ field: "fieldA", operator: "is equal", value: "value" }],
        },
      ],
      default: 2,
    });
  });

  it("Throws an error when validating an invalid ruleset", () => {
    const builder = JsonRules.builder();
    expect(() =>
      builder
        .add(
          builder.condition(
            "all",
            [
              builder.condition("any", [], "Invalid!!"),
              builder.constraint("fieldC", "not in", [1, 2, 3]),
            ],
            3
          )
        )
        .build(true)
    ).toThrowError();
  });
});
