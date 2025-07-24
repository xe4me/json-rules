import { Rule } from "../../src";

export const subRulesValid2Json: Rule = {
  conditions: [
    {
      none: [
        {
          field: "Category",
          operator: "is equal",
          value: 900,
        },
        {
          field: "Leverage",
          operator: "is not equal",
          value: 500,
        },
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
              any: [
                {
                  field: "Leverage",
                  operator: "is equal",
                  value: 2000,
                },
                {
                  field: "Leverage",
                  operator: "is equal",
                  value: 1500,
                },
              ],
              result: 100,
            },
          ],
        },
      ],
      result: 50,
    },
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
              field: "Leverage",
              operator: "is equal",
              value: "Demo",
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
              result: 15,
            },
          ],
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
              value: 400,
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
