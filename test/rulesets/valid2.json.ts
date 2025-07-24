import { Rule } from "../../src";

export const valid2Json: Rule = {
  conditions: {
    any: [
      {
        all: [
          {
            field: "Leverage",
            operator: "is less than or equal",
            value: 100,
          },
          {
            field: "WinRate",
            operator: "is greater than",
            value: 60,
          },
          {
            field: "AverageTradeDuration",
            operator: "is less than",
            value: 60,
          },
          {
            field: "Duration",
            operator: "is greater than",
            value: 259200,
          },
          {
            field: "TotalDaysTraded",
            operator: "is greater than or equal",
            value: 3,
          },
        ],
      },
      {
        none: [
          {
            field: "AverageTradeDuration",
            operator: "is not equal",
            value: 10,
          },
          {
            field: "Foo",
            operator: "not in",
            value: [10, 11, 12],
          },
        ],
      },
    ],
  },
} as Rule;
