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
          operator: "arrayContains",
          value: null,
        },
        {
          field: "bar_array",
          operator: "arrayNotContains",
          value: null,
        },
      ],
    }
  ],
};
