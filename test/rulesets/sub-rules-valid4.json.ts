import { Rule } from "../../src";

export const subRulesValidJson4: Rule = {
  conditions: [
    {
      all: [
        {
          field: "category",
          operator: "is not equal",
          value: "islamic",
        },
        {
          all: [
            {
              field: "currency",
              operator: "is equal",
              value: "USD",
            },
          ],
          result: {
            groupId: 15,
          },
        },
        {
          all: [
            {
              field: "currency",
              operator: "is equal",
              value: "CAD",
            },
          ],
          result: {
            groupId: 15,
          },
        },
        {
          all: [
            {
              field: "currency",
              operator: "is equal",
              value: "EUR",
            },
          ],
          result: {
            groupId: 15,
          },
        },
        {
          all: [
            {
              field: "currency",
              operator: "is equal",
              value: "GBP",
            },
          ],
          result: {
            groupId: 15,
          },
        },
        {
          all: [
            {
              field: "currency",
              operator: "is equal",
              value: "AUD",
            },
          ],
          result: {
            groupId: 15,
          },
        },
        {
          all: [
            {
              field: "currency",
              operator: "is equal",
              value: "BIT",
            },
          ],
          result: {
            groupId: 15,
          },
        },
      ],
    },
    {
      all: [
        {
          field: "category",
          operator: "is equal",
          value: "islamic",
        },
      ],
      result: {
        groupId: 17,
      },
    },
  ],
};
