import { Rule } from "../../src";

export const valid8Json: Rule = {
  conditions: [
    {
      none: [
        {
          field: "Leverage",
          operator: "is greater than or equal",
          value: 1000,
        },
        {
          any: [
            {
              field: "Type",
              operator: "!=",
              value: "Demo",
            },
            {
              field: "OtherType",
              operator: "not in",
              value: ["Live", "Fun"],
            },
            {
              all: [
                {
                  field: "CountryIso",
                  operator: "in",
                  value: ["GB", "FI"],
                },
                {
                  field: "Leverage",
                  operator: "is less than",
                  value: 200,
                },
                {
                  field: "Monetization",
                  operator: "==",
                  value: "Real",
                },
              ],
            },
          ],
        },
      ],
      result: 3,
    },
    {
      none: [
        {
          field: "Category",
          operator: "==",
          value: "Islamic",
        },
      ],
      result: 4,
    },
  ],
};
