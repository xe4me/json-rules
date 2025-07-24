import { Rule } from "../../src";

export const valid4Json: Rule = {
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
              operator: "contains",
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
                      value: 11,
                    },
                    {
                      field: "Category",
                      operator: "is equal",
                      value: 12,
                    },
                    {
                      all: [
                        {
                          field: "HasStudentCard",
                          operator: "is equal",
                          value: true,
                        },
                        {
                          field: "IsUnder18",
                          operator: "is equal",
                          value: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
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
