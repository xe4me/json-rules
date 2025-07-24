import { Rule } from "../../src";

export const valid1Json: Rule = {
  conditions: {
    any: [
      {
        all: [
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
        all: [
          {
            field: "ProfitPercentage",
            operator: "is greater than or equal",
            value: 10,
          },
        ],
      },
    ],
  },
};
