import { Rule } from "../../src";

export const subRulesValid1Json: Rule = {
  conditions: [
    {
      any: [
        {
          field: "Leverage",
          operator: "is equal",
          value: 1000,
        },
        {
          field: "Leverage",
          operator: "is equal",
          value: 500,
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
              operator: "is greater than",
              value: 500,
            },
            {
              field: "Monetization",
              operator: "is equal",
              value: "Real",
            },
            {
              any: [
                {
                  field: "Category",
                  operator: "is greater than or equal",
                  value: 1000,
                },
                {
                  field: "Category",
                  operator: "is equal",
                  value: 22,
                },
                {
                  any: [
                    {
                      field: "Category",
                      operator: "is equal",
                      value: 900,
                    },
                    {
                      field: "Category",
                      operator: "is equal",
                      value: 910,
                    },
                  ],
                },
              ],
              result: 13,
            },
          ],
          result: 12,
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
