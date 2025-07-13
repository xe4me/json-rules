import { Rule } from "../../src";

export const valid10Json: Rule = {
  conditions: [
    {
      all: [
        {
          field: "foo",
          operator: "==",
          value: null,
        },
        {
          field: "bar",
          operator: "!=",
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
