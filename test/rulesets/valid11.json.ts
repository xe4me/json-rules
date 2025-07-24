import { Rule } from "../../src";

export const valid11Json: Rule = {
  conditions: [
    {
      all: [
        {
          field: "category",
          operator: "is equal",
          value: "demo",
        },
        {
          all: [
            {
              field: "monetization",
              operator: "is equal",
              value: "demo",
            },
            {
              field: "currency",
              operator: "is equal",
              value: "USD",
            },
          ],
          result: {
            groupId: 10997667,
            spreadPlan: "UBRK-GEN",
            commissionPlan: "UBRK-GEN-USD",
          },
        },
      ],
    },
    {
      all: [
        {
          field: "category",
          operator: "is equal",
          value: "ecn",
        },
        {
          all: [
            {
              field: "monetization",
              operator: "is equal",
              value: "demo",
            },
            {
              field: "currency",
              operator: "is equal",
              value: "USD",
            },
          ],
          result: {
            groupId: 10997668,
            spreadPlan: "UBRK-GEN",
            commissionPlan: "UBRK-GEN-USD",
          },
        },
        {
          all: [
            {
              field: "monetization",
              operator: "is equal",
              value: "demo",
            },
            {
              field: "currency",
              operator: "is equal",
              value: "EUR",
            },
          ],
          result: {
            groupId: 10997668,
            spreadPlan: "UBRK-GEN",
            commissionPlan: "UBRK-GEN-EUR",
          },
        },
        {
          all: [
            {
              field: "monetization",
              operator: "is equal",
              value: "demo",
            },
            {
              field: "currency",
              operator: "is equal",
              value: "BTC",
            },
          ],
          result: {
            groupId: 10997668,
            spreadPlan: "UBRK-GEN",
            commissionPlan: "UBRK-GEN-BTC",
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
        {
          all: [
            {
              field: "monetization",
              operator: "is equal",
              value: "demo",
            },
            {
              field: "currency",
              operator: "is equal",
              value: "USD",
            },
          ],
          result: {
            groupId: 10997669,
            spreadPlan: "UBRK-GEN",
            commissionPlan: "UBRK-GEN-USD",
          },
        },
      ],
    },
  ],
};
