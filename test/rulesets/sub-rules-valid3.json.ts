import { Rule } from "../../src";

export const subRulesValid3Json: Rule = {
  conditions: [
    {
      all: [
        {
          any: [
            {
              field: "fieldA",
              operator: "is equal",
              value: "bar",
            },
            {
              field: "fieldB",
              operator: "is greater than or equal",
              value: 2,
            },
            {
              all: [
                {
                  field: "fieldD",
                  operator: "is equal",
                  value: "whoop",
                },
              ],
              result: 33,
            },
          ],
        },
        {
          field: "fieldC",
          operator: "not in",
          value: [1, 2, 3],
        },
      ],
      result: 3,
    },
    {
      none: [{ field: "fieldE", operator: "is equal", value: "hoop" }],
      result: 5,
    },
    {
      any: [
        {
          field: "fieldA",
          operator: "is equal",
          value: "value",
        },
      ],
    },
  ],
  default: 2,
};
