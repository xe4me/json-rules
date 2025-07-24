// an invalid rule with null and greater than
import { Rule } from "../../src";

export const invalid3Json: Rule = {
  conditions: [
    {
      any: [
        {
          field: "foo",
          operator: "is greater than or equal",
          value: null,
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
