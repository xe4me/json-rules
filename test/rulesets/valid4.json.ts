import { Rule } from "../../src";

export const valid4Json: Rule = {
  conditions: [
    {
      any: [
        {
          field: "Leverage",
          operator: "==",
          value: 1000,
        },
        {
          field: "Leverage",
          operator: "==",
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
              operator: "==",
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
                  operator: "==",
                  value: 22,
                },
                {
                  any: [
                    {
                      field: "Category",
                      operator: "==",
                      value: 11,
                    },
                    {
                      field: "Category",
                      operator: "==",
                      value: 12,
                    },
                    {
                      all: [
                        {
                          field: "HasStudentCard",
                          operator: "==",
                          value: true,
                        },
                        {
                          field: "IsUnder18",
                          operator: "==",
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
          operator: "==",
          value: "Islamic",
        },
      ],
      result: 4,
    },
  ],
  default: 2,
};
