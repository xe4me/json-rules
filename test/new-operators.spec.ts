import { JsonRules, type Rule } from "../src";

describe("New Operators", () => {
  describe("isBetween operator", () => {
    it("should return true when value is between the range (inclusive)", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "age", operator: "is between numbers", value: [18, 65] },
            { field: "score", operator: "is between numbers", value: [0, 100] },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { age: 25, score: 85 })).toBe(true);
      expect(await JsonRules.evaluate(rule, { age: 18, score: 0 })).toBe(true);
      expect(await JsonRules.evaluate(rule, { age: 65, score: 100 })).toBe(
        true
      );
    });

    it("should return false when value is outside the range", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "age", operator: "is between numbers", value: [18, 65] },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { age: 17 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { age: 66 })).toBe(false);
    });

    it("should return false when value or range is invalid", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "age", operator: "is between numbers", value: [18, 65] },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { age: "not a number" })).toBe(
        false
      );

      const invalidRule: Rule = {
        conditions: {
          all: [{ field: "age", operator: "is between numbers", value: [18] }],
        },
      };

      expect(await JsonRules.evaluate(invalidRule, { age: 25 })).toBe(false);
    });
  });

  describe("isNotBetween operator", () => {
    it("should return true when value is outside the range", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "age",
              operator: "is not between numbers",
              value: [18, 65],
            },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { age: 17 })).toBe(true);
      expect(await JsonRules.evaluate(rule, { age: 66 })).toBe(true);
    });

    it("should return false when value is in the range", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "age",
              operator: "is not between numbers",
              value: [18, 65],
            },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { age: 25 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { age: 18 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { age: 65 })).toBe(false);
    });
  });

  describe("is between numbers operator", () => {
    it("should return true when value is between the number range (inclusive)", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "score", operator: "is between numbers", value: [0, 100] },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule, { score: 50 })).toBe(true);
      expect(await JsonRules.evaluate(rule, { score: 0 })).toBe(true);
      expect(await JsonRules.evaluate(rule, { score: 100 })).toBe(true);
    });
    it("should return false when value is outside the number range", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "score", operator: "is between numbers", value: [0, 100] },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule, { score: -1 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { score: 101 })).toBe(false);
    });
    it("should return false for invalid range or value", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "score", operator: "is between numbers", value: [0] }],
        },
      };
      expect(await JsonRules.evaluate(rule, { score: 50 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { score: null })).toBe(false);
    });
  });

  describe("is not between numbers operator", () => {
    it("should return true when value is outside the number range", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "score",
              operator: "is not between numbers",
              value: [0, 100],
            },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule, { score: -1 })).toBe(true);
      expect(await JsonRules.evaluate(rule, { score: 101 })).toBe(true);
    });
    it("should return false when value is inside the number range", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "score",
              operator: "is not between numbers",
              value: [0, 100],
            },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule, { score: 0 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { score: 50 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { score: 100 })).toBe(false);
    });
  });

  describe("is between dates operator", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-06-15");
    const date3 = new Date("2023-12-31");
    it("should return true when value is between the date range (inclusive)", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "eventDate",
              operator: "is between dates",
              value: [date1, date3],
            },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule, { eventDate: date2 })).toBe(true);
      expect(await JsonRules.evaluate(rule, { eventDate: date1 })).toBe(true);
      expect(await JsonRules.evaluate(rule, { eventDate: date3 })).toBe(true);
    });
    it("should return false when value is outside the date range", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "eventDate",
              operator: "is between dates",
              value: [date1, date3],
            },
          ],
        },
      };
      expect(
        await JsonRules.evaluate(rule, { eventDate: new Date("2022-12-31") })
      ).toBe(false);
      expect(
        await JsonRules.evaluate(rule, { eventDate: new Date("2024-01-01") })
      ).toBe(false);
    });
    it("should return false for invalid range or value", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "eventDate",
              operator: "is between dates",
              value: [date1, null] as any,
            },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule, { eventDate: date2 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { eventDate: null })).toBe(false);
    });
  });

  describe("is not between dates operator", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-06-15");
    const date3 = new Date("2023-12-31");
    it("should return true when value is outside the date range", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "eventDate",
              operator: "is not between dates",
              value: [date1, date3],
            },
          ],
        },
      };
      expect(
        await JsonRules.evaluate(rule, { eventDate: new Date("2022-12-31") })
      ).toBe(true);
      expect(
        await JsonRules.evaluate(rule, { eventDate: new Date("2024-01-01") })
      ).toBe(true);
    });
    it("should return false when value is inside the date range", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "eventDate",
              operator: "is not between dates",
              value: [date1, date3],
            },
          ],
        },
      };
      expect(await JsonRules.evaluate(rule, { eventDate: date1 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { eventDate: date2 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { eventDate: date3 })).toBe(false);
    });
  });

  describe("Date operators", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-06-15");
    const date3 = new Date("2023-12-31");

    describe("isBefore operator", () => {
      it("should return true when first date is before second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "startDate", operator: "is before", value: date2 }],
          },
        };

        expect(await JsonRules.evaluate(rule, { startDate: date1 })).toBe(true);
      });

      it("should return false when first date is after or equal to second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "startDate", operator: "is before", value: date2 }],
          },
        };

        expect(await JsonRules.evaluate(rule, { startDate: date3 })).toBe(
          false
        );
        expect(await JsonRules.evaluate(rule, { startDate: date2 })).toBe(
          false
        );
      });

      it("should return false when values are not dates", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "startDate", operator: "is before", value: date2 }],
          },
        };

        expect(
          await JsonRules.evaluate(rule, { startDate: "2023-01-01" })
        ).toBe(false);
        expect(
          await JsonRules.evaluate(rule, { startDate: 1672531200000 })
        ).toBe(false);
      });
    });

    describe("isAfter operator", () => {
      it("should return true when first date is after second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "endDate", operator: "is after", value: date2 }],
          },
        };

        expect(await JsonRules.evaluate(rule, { endDate: date3 })).toBe(true);
      });

      it("should return false when first date is before or equal to second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "endDate", operator: "is after", value: date2 }],
          },
        };

        expect(await JsonRules.evaluate(rule, { endDate: date1 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { endDate: date2 })).toBe(false);
      });
    });

    describe("isOnOrBefore operator", () => {
      it("should return true when first date is before or equal to second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "deadline", operator: "is on or before", value: date2 },
            ],
          },
        };

        expect(await JsonRules.evaluate(rule, { deadline: date1 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { deadline: date2 })).toBe(true);
      });

      it("should return false when first date is after second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "deadline", operator: "is on or before", value: date2 },
            ],
          },
        };

        expect(await JsonRules.evaluate(rule, { deadline: date3 })).toBe(false);
      });
    });

    describe("isOnOrAfter operator", () => {
      it("should return true when first date is after or equal to second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "startDate", operator: "is on or after", value: date2 },
            ],
          },
        };

        expect(await JsonRules.evaluate(rule, { startDate: date2 })).toBe(true);
        expect(await JsonRules.evaluate(rule, { startDate: date3 })).toBe(true);
      });

      it("should return false when first date is before second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "startDate", operator: "is on or after", value: date2 },
            ],
          },
        };

        expect(await JsonRules.evaluate(rule, { startDate: date1 })).toBe(
          false
        );
      });
    });
  });

  describe("String operators", () => {
    describe("startsWith operator", () => {
      it("should return true when string starts with the given prefix", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "name", operator: "starts with", value: "John" },
              { field: "email", operator: "starts with", value: "admin@" },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            name: "John Doe",
            email: "admin@example.com",
          })
        ).toBe(true);
      });

      it("should return false when string does not start with the given prefix", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "name", operator: "starts with", value: "John" }],
          },
        };

        expect(await JsonRules.evaluate(rule, { name: "Jane Doe" })).toBe(
          false
        );
      });

      it("should return false when values are not strings", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "name", operator: "starts with", value: "John" }],
          },
        };

        expect(await JsonRules.evaluate(rule, { name: 123 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { name: null })).toBe(false);
      });
    });

    describe("endsWith operator", () => {
      it("should return true when string ends with the given suffix", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "filename", operator: "ends with", value: ".pdf" },
              { field: "domain", operator: "ends with", value: ".com" },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            filename: "document.pdf",
            domain: "example.com",
          })
        ).toBe(true);
      });

      it("should return false when string does not end with the given suffix", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "filename", operator: "ends with", value: ".pdf" }],
          },
        };

        expect(
          await JsonRules.evaluate(rule, { filename: "document.txt" })
        ).toBe(false);
      });

      it("should return false when values are not strings", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "filename", operator: "ends with", value: ".pdf" }],
          },
        };

        expect(await JsonRules.evaluate(rule, { filename: 123 })).toBe(false);
        expect(await JsonRules.evaluate(rule, { filename: null })).toBe(false);
      });
    });
  });

  describe("Array operators", () => {
    describe("arrayContains operator", () => {
      it("should return true when array contains the value", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              {
                field: "tags",
                operator: "array contains",
                value: "javascript",
              },
              { field: "numbers", operator: "array contains", value: 42 },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            tags: ["javascript", "typescript", "react"],
            numbers: [1, 42, 99],
          })
        ).toBe(true);
      });

      it("should return false when array does not contain the value", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "tags", operator: "array contains", value: "python" },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            tags: ["javascript", "typescript", "react"],
          })
        ).toBe(false);
      });

      it("should return false when field is not an array", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              {
                field: "tags",
                operator: "array contains",
                value: "javascript",
              },
            ],
          },
        };

        expect(await JsonRules.evaluate(rule, { tags: "javascript" })).toBe(
          false
        );
        expect(await JsonRules.evaluate(rule, { tags: null })).toBe(false);
      });

      it("should work with null values", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "values", operator: "array contains", value: null }],
          },
        };

        expect(await JsonRules.evaluate(rule, { values: [1, null, 3] })).toBe(
          true
        );
        expect(await JsonRules.evaluate(rule, { values: [1, 2, 3] })).toBe(
          false
        );
      });
    });

    describe("arrayNotContains operator", () => {
      it("should return true when array does not contain the value", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "tags", operator: "array no contains", value: "python" },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            tags: ["javascript", "typescript", "react"],
          })
        ).toBe(true);
      });

      it("should return false when array contains the value", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              {
                field: "tags",
                operator: "array no contains",
                value: "javascript",
              },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            tags: ["javascript", "typescript", "react"],
          })
        ).toBe(false);
      });

      it("should return true when field is not an array", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              {
                field: "tags",
                operator: "array no contains",
                value: "javascript",
              },
            ],
          },
        };

        expect(await JsonRules.evaluate(rule, { tags: "javascript" })).toBe(
          true
        );
        expect(await JsonRules.evaluate(rule, { tags: null })).toBe(true);
      });
    });
  });

  describe("Updated string contains operators", () => {
    describe("contains operator (string-based)", () => {
      it("should return true when string contains the substring", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "description", operator: "contains", value: "awesome" },
              { field: "email", operator: "contains", value: "@example.com" },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            description: "This is an awesome product",
            email: "user@example.com",
          })
        ).toBe(true);
      });

      it("should return false when string does not contain the substring", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "description", operator: "contains", value: "terrible" },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            description: "This is an awesome product",
          })
        ).toBe(false);
      });

      it("should return false when values are not strings", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "description", operator: "contains", value: "awesome" },
            ],
          },
        };

        expect(await JsonRules.evaluate(rule, { description: 123 })).toBe(
          false
        );
        expect(
          await JsonRules.evaluate(rule, { description: ["awesome"] })
        ).toBe(false);
      });
    });

    describe("not contains operator (string-based)", () => {
      it("should return true when string does not contain the substring", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              {
                field: "description",
                operator: "not contains",
                value: "terrible",
              },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            description: "This is an awesome product",
          })
        ).toBe(true);
      });

      it("should return false when string contains the substring", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              {
                field: "description",
                operator: "not contains",
                value: "awesome",
              },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            description: "This is an awesome product",
          })
        ).toBe(false);
      });

      it("should return false when values are not strings", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              {
                field: "description",
                operator: "not contains",
                value: "awesome",
              },
            ],
          },
        };

        expect(await JsonRules.evaluate(rule, { description: 123 })).toBe(
          false
        );
        expect(
          await JsonRules.evaluate(rule, { description: ["awesome"] })
        ).toBe(false);
      });
    });

    describe("contains any operator (string-based)", () => {
      it("should return true when string contains any of the substrings", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              {
                field: "description",
                operator: "contains any",
                value: ["great", "awesome", "fantastic"],
              },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            description: "This is an awesome product",
          })
        ).toBe(true);

        expect(
          await JsonRules.evaluate(rule, {
            description: "This is a great product",
          })
        ).toBe(true);
      });

      it("should return false when string does not contain any of the substrings", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              {
                field: "description",
                operator: "contains any",
                value: ["terrible", "bad", "awful"],
              },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            description: "This is an awesome product",
          })
        ).toBe(false);
      });

      it("should return false when values are not strings", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              {
                field: "description",
                operator: "contains any",
                value: ["awesome"],
              },
            ],
          },
        };

        expect(await JsonRules.evaluate(rule, { description: 123 })).toBe(
          false
        );
        expect(
          await JsonRules.evaluate(rule, { description: ["awesome"] })
        ).toBe(false);
      });
    });

    describe("not contains any operator (string-based)", () => {
      it("should return true when string does not contain any of the substrings", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              {
                field: "description",
                operator: "not contains any",
                value: ["terrible", "bad", "awful"],
              },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            description: "This is an awesome product",
          })
        ).toBe(true);
      });

      it("should return false when string contains any of the substrings", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              {
                field: "description",
                operator: "not contains any",
                value: ["great", "awesome", "fantastic"],
              },
            ],
          },
        };

        expect(
          await JsonRules.evaluate(rule, {
            description: "This is an awesome product",
          })
        ).toBe(false);
      });

      it("should return false when values are not strings", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              {
                field: "description",
                operator: "not contains any",
                value: ["awesome"],
              },
            ],
          },
        };

        expect(await JsonRules.evaluate(rule, { description: 123 })).toBe(
          false
        );
        expect(
          await JsonRules.evaluate(rule, { description: ["awesome"] })
        ).toBe(false);
      });
    });
  });

  describe("Complex scenarios with new operators", () => {
    it("should handle mixed conditions with new operators", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "age", operator: "is between numbers", value: [18, 65] },
            { field: "email", operator: "ends with", value: "@company.com" },
            {
              field: "skills",
              operator: "array contains",
              value: "javascript",
            },
            { field: "bio", operator: "contains", value: "developer" },
          ],
        },
      };

      expect(
        await JsonRules.evaluate(rule, {
          age: 30,
          email: "john@company.com",
          skills: ["javascript", "react", "node.js"],
          bio: "I am a full-stack developer",
        })
      ).toBe(true);

      expect(
        await JsonRules.evaluate(rule, {
          age: 17, // Too young
          email: "john@company.com",
          skills: ["javascript", "react", "node.js"],
          bio: "I am a full-stack developer",
        })
      ).toBe(false);
    });

    it("should work with any conditions", async () => {
      const rule: Rule = {
        conditions: {
          any: [
            { field: "priority", operator: "starts with", value: "high" },
            {
              field: "score",
              operator: "is between numbers",
              value: [90, 100],
            },
            { field: "tags", operator: "array contains", value: "urgent" },
          ],
        },
      };

      expect(
        await JsonRules.evaluate(rule, {
          priority: "high-priority",
          score: 70,
          tags: ["normal", "review"],
        })
      ).toBe(true);

      expect(
        await JsonRules.evaluate(rule, {
          priority: "normal",
          score: 95,
          tags: ["normal", "review"],
        })
      ).toBe(true);

      expect(
        await JsonRules.evaluate(rule, {
          priority: "normal",
          score: 70,
          tags: ["normal", "urgent"],
        })
      ).toBe(true);

      expect(
        await JsonRules.evaluate(rule, {
          priority: "normal",
          score: 70,
          tags: ["normal", "review"],
        })
      ).toBe(false);
    });
  });
});
