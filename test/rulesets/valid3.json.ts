import { Rule } from "../../src";

export const valid3Json: Rule = {
  conditions: [
    {
      any: [
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
              operator: "is equal",
              value: "Real",
            },
          ],
        },
        {
          field: "Leverage",
          operator: "is greater than or equal",
          value: 1000,
        },
      ],
      result: 3,
    },
    {
      all: [
        {
          field: "Category",
          operator: "is equal",
          value: "Islamic",
        },
      ],
      result: 4,
    },
  ],
  default: 2,
};
