import { Rule } from "../../src";

export const valid9Json: Rule = {
  conditions: [
    {
      any: [
        {
          all: [
            {
              field: "country",
              operator: "in",
              value: ["GB", "FI"],
            },
            {
              field: "hasCoupon",
              operator: "is equal",
              value: true,
            },
            {
              field: "totalCheckoutPrice",
              operator: "is greater than or equal",
              value: 120.0,
            },
          ],
        },
        {
          field: "country",
          operator: "is equal",
          value: "SE",
        },
      ],
      result: 5,
    },
    {
      all: [
        {
          field: "age",
          operator: "is greater than or equal",
          value: 18,
        },
        {
          field: "hasStudentCard",
          operator: "is equal",
          value: true,
        },
      ],
      result: 10,
    },
  ],
};
