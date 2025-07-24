import { Rule } from "../../src";

export const valid10Json: Rule = {
  conditions: [
    {
      all: [
        {
          field: "foo",
          operator: "is equal",
          value: null,
        },
        {
          field: "bar",
          operator: "is not equal",
          value: null,
        },
        {
          field: "foo_array",
          operator: "array contains",
          value: null,
        },
        {
          field: "bar_array",
          operator: "array no contains",
          value: null,
        },
      ],
    },
  ],
};
