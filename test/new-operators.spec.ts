import { RulePilot, Rule } from "../src";

describe("New Operators", () => {
  describe("isBetween operator", () => {
    it("should return true when value is between the range (inclusive)", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "age", operator: "isBetween", value: [18, 65] },
            { field: "score", operator: "isBetween", value: [0, 100] }
          ]
        }
      };

      expect(await RulePilot.evaluate(rule, { age: 25, score: 85 })).toBe(true);
      expect(await RulePilot.evaluate(rule, { age: 18, score: 0 })).toBe(true);
      expect(await RulePilot.evaluate(rule, { age: 65, score: 100 })).toBe(true);
    });

    it("should return false when value is outside the range", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "age", operator: "isBetween", value: [18, 65] }]
        }
      };

      expect(await RulePilot.evaluate(rule, { age: 17 })).toBe(false);
      expect(await RulePilot.evaluate(rule, { age: 66 })).toBe(false);
    });

    it("should return false when value or range is invalid", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "age", operator: "isBetween", value: [18, 65] }]
        }
      };

      expect(await RulePilot.evaluate(rule, { age: "not a number" })).toBe(false);
      
      const invalidRule: Rule = {
        conditions: {
          all: [{ field: "age", operator: "isBetween", value: [18] }]
        }
      };
      
      expect(await RulePilot.evaluate(invalidRule, { age: 25 })).toBe(false);
    });
  });

  describe("isNotBetween operator", () => {
    it("should return true when value is outside the range", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "age", operator: "isNotBetween", value: [18, 65] }]
        }
      };

      expect(await RulePilot.evaluate(rule, { age: 17 })).toBe(true);
      expect(await RulePilot.evaluate(rule, { age: 66 })).toBe(true);
    });

    it("should return false when value is in the range", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "age", operator: "isNotBetween", value: [18, 65] }]
        }
      };

      expect(await RulePilot.evaluate(rule, { age: 25 })).toBe(false);
      expect(await RulePilot.evaluate(rule, { age: 18 })).toBe(false);
      expect(await RulePilot.evaluate(rule, { age: 65 })).toBe(false);
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
            all: [{ field: "startDate", operator: "isBefore", value: date2 }]
          }
        };

        expect(await RulePilot.evaluate(rule, { startDate: date1 })).toBe(true);
      });

      it("should return false when first date is after or equal to second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "startDate", operator: "isBefore", value: date2 }]
          }
        };

        expect(await RulePilot.evaluate(rule, { startDate: date3 })).toBe(false);
        expect(await RulePilot.evaluate(rule, { startDate: date2 })).toBe(false);
      });

      it("should return false when values are not dates", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "startDate", operator: "isBefore", value: date2 }]
          }
        };

        expect(await RulePilot.evaluate(rule, { startDate: "2023-01-01" })).toBe(false);
        expect(await RulePilot.evaluate(rule, { startDate: 1672531200000 })).toBe(false);
      });
    });

    describe("isAfter operator", () => {
      it("should return true when first date is after second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "endDate", operator: "isAfter", value: date2 }]
          }
        };

        expect(await RulePilot.evaluate(rule, { endDate: date3 })).toBe(true);
      });

      it("should return false when first date is before or equal to second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "endDate", operator: "isAfter", value: date2 }]
          }
        };

        expect(await RulePilot.evaluate(rule, { endDate: date1 })).toBe(false);
        expect(await RulePilot.evaluate(rule, { endDate: date2 })).toBe(false);
      });
    });

    describe("isOnOrBefore operator", () => {
      it("should return true when first date is before or equal to second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "deadline", operator: "isOnOrBefore", value: date2 }]
          }
        };

        expect(await RulePilot.evaluate(rule, { deadline: date1 })).toBe(true);
        expect(await RulePilot.evaluate(rule, { deadline: date2 })).toBe(true);
      });

      it("should return false when first date is after second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "deadline", operator: "isOnOrBefore", value: date2 }]
          }
        };

        expect(await RulePilot.evaluate(rule, { deadline: date3 })).toBe(false);
      });
    });

    describe("isOnOrAfter operator", () => {
      it("should return true when first date is after or equal to second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "startDate", operator: "isOnOrAfter", value: date2 }]
          }
        };

        expect(await RulePilot.evaluate(rule, { startDate: date2 })).toBe(true);
        expect(await RulePilot.evaluate(rule, { startDate: date3 })).toBe(true);
      });

      it("should return false when first date is before second date", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "startDate", operator: "isOnOrAfter", value: date2 }]
          }
        };

        expect(await RulePilot.evaluate(rule, { startDate: date1 })).toBe(false);
      });
    });
  });

  describe("String operators", () => {
    describe("startsWith operator", () => {
      it("should return true when string starts with the given prefix", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "name", operator: "startsWith", value: "John" },
              { field: "email", operator: "startsWith", value: "admin@" }
            ]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          name: "John Doe", 
          email: "admin@example.com" 
        })).toBe(true);
      });

      it("should return false when string does not start with the given prefix", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "name", operator: "startsWith", value: "John" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { name: "Jane Doe" })).toBe(false);
      });

      it("should return false when values are not strings", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "name", operator: "startsWith", value: "John" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { name: 123 })).toBe(false);
        expect(await RulePilot.evaluate(rule, { name: null })).toBe(false);
      });
    });

    describe("endsWith operator", () => {
      it("should return true when string ends with the given suffix", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "filename", operator: "endsWith", value: ".pdf" },
              { field: "domain", operator: "endsWith", value: ".com" }
            ]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          filename: "document.pdf", 
          domain: "example.com" 
        })).toBe(true);
      });

      it("should return false when string does not end with the given suffix", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "filename", operator: "endsWith", value: ".pdf" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { filename: "document.txt" })).toBe(false);
      });

      it("should return false when values are not strings", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "filename", operator: "endsWith", value: ".pdf" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { filename: 123 })).toBe(false);
        expect(await RulePilot.evaluate(rule, { filename: null })).toBe(false);
      });
    });
  });

  describe("Array operators", () => {
    describe("arrayContains operator", () => {
      it("should return true when array contains the value", async () => {
        const rule: Rule = {
          conditions: {
            all: [
              { field: "tags", operator: "arrayContains", value: "javascript" },
              { field: "numbers", operator: "arrayContains", value: 42 }
            ]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          tags: ["javascript", "typescript", "react"], 
          numbers: [1, 42, 99] 
        })).toBe(true);
      });

      it("should return false when array does not contain the value", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "tags", operator: "arrayContains", value: "python" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          tags: ["javascript", "typescript", "react"] 
        })).toBe(false);
      });

      it("should return false when field is not an array", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "tags", operator: "arrayContains", value: "javascript" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { tags: "javascript" })).toBe(false);
        expect(await RulePilot.evaluate(rule, { tags: null })).toBe(false);
      });

      it("should work with null values", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "values", operator: "arrayContains", value: null }]
          }
        };

        expect(await RulePilot.evaluate(rule, { values: [1, null, 3] })).toBe(true);
        expect(await RulePilot.evaluate(rule, { values: [1, 2, 3] })).toBe(false);
      });
    });

    describe("arrayNotContains operator", () => {
      it("should return true when array does not contain the value", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "tags", operator: "arrayNotContains", value: "python" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          tags: ["javascript", "typescript", "react"] 
        })).toBe(true);
      });

      it("should return false when array contains the value", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "tags", operator: "arrayNotContains", value: "javascript" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          tags: ["javascript", "typescript", "react"] 
        })).toBe(false);
      });

      it("should return true when field is not an array", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "tags", operator: "arrayNotContains", value: "javascript" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { tags: "javascript" })).toBe(true);
        expect(await RulePilot.evaluate(rule, { tags: null })).toBe(true);
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
              { field: "email", operator: "contains", value: "@example.com" }
            ]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          description: "This is an awesome product", 
          email: "user@example.com" 
        })).toBe(true);
      });

      it("should return false when string does not contain the substring", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "description", operator: "contains", value: "terrible" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          description: "This is an awesome product" 
        })).toBe(false);
      });

      it("should return false when values are not strings", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "description", operator: "contains", value: "awesome" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { description: 123 })).toBe(false);
        expect(await RulePilot.evaluate(rule, { description: ["awesome"] })).toBe(false);
      });
    });

    describe("not contains operator (string-based)", () => {
      it("should return true when string does not contain the substring", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "description", operator: "not contains", value: "terrible" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          description: "This is an awesome product" 
        })).toBe(true);
      });

      it("should return false when string contains the substring", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "description", operator: "not contains", value: "awesome" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          description: "This is an awesome product" 
        })).toBe(false);
      });

      it("should return true when values are not strings", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "description", operator: "not contains", value: "awesome" }]
          }
        };

        expect(await RulePilot.evaluate(rule, { description: 123 })).toBe(true);
        expect(await RulePilot.evaluate(rule, { description: ["awesome"] })).toBe(true);
      });
    });

    describe("contains any operator (string-based)", () => {
      it("should return true when string contains any of the substrings", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "description", operator: "contains any", value: ["great", "awesome", "fantastic"] }]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          description: "This is an awesome product" 
        })).toBe(true);

        expect(await RulePilot.evaluate(rule, { 
          description: "This is a great product" 
        })).toBe(true);
      });

      it("should return false when string does not contain any of the substrings", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "description", operator: "contains any", value: ["terrible", "bad", "awful"] }]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          description: "This is an awesome product" 
        })).toBe(false);
      });

      it("should return false when values are not strings", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "description", operator: "contains any", value: ["awesome"] }]
          }
        };

        expect(await RulePilot.evaluate(rule, { description: 123 })).toBe(false);
        expect(await RulePilot.evaluate(rule, { description: ["awesome"] })).toBe(false);
      });
    });

    describe("not contains any operator (string-based)", () => {
      it("should return true when string does not contain any of the substrings", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "description", operator: "not contains any", value: ["terrible", "bad", "awful"] }]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          description: "This is an awesome product" 
        })).toBe(true);
      });

      it("should return false when string contains any of the substrings", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "description", operator: "not contains any", value: ["great", "awesome", "fantastic"] }]
          }
        };

        expect(await RulePilot.evaluate(rule, { 
          description: "This is an awesome product" 
        })).toBe(false);
      });

      it("should return true when values are not strings", async () => {
        const rule: Rule = {
          conditions: {
            all: [{ field: "description", operator: "not contains any", value: ["awesome"] }]
          }
        };

        expect(await RulePilot.evaluate(rule, { description: 123 })).toBe(true);
        expect(await RulePilot.evaluate(rule, { description: ["awesome"] })).toBe(true);
      });
    });
  });

  describe("Complex scenarios with new operators", () => {
    it("should handle mixed conditions with new operators", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "age", operator: "isBetween", value: [18, 65] },
            { field: "email", operator: "endsWith", value: "@company.com" },
            { field: "skills", operator: "arrayContains", value: "javascript" },
            { field: "bio", operator: "contains", value: "developer" }
          ]
        }
      };

      expect(await RulePilot.evaluate(rule, { 
        age: 30,
        email: "john@company.com",
        skills: ["javascript", "react", "node.js"],
        bio: "I am a full-stack developer"
      })).toBe(true);

      expect(await RulePilot.evaluate(rule, { 
        age: 17, // Too young
        email: "john@company.com",
        skills: ["javascript", "react", "node.js"],
        bio: "I am a full-stack developer"
      })).toBe(false);
    });

    it("should work with any conditions", async () => {
      const rule: Rule = {
        conditions: {
          any: [
            { field: "priority", operator: "startsWith", value: "high" },
            { field: "score", operator: "isBetween", value: [90, 100] },
            { field: "tags", operator: "arrayContains", value: "urgent" }
          ]
        }
      };

      expect(await RulePilot.evaluate(rule, { 
        priority: "high-priority",
        score: 70,
        tags: ["normal", "review"]
      })).toBe(true);

      expect(await RulePilot.evaluate(rule, { 
        priority: "normal",
        score: 95,
        tags: ["normal", "review"]
      })).toBe(true);

      expect(await RulePilot.evaluate(rule, { 
        priority: "normal",
        score: 70,
        tags: ["normal", "urgent"]
      })).toBe(true);

      expect(await RulePilot.evaluate(rule, { 
        priority: "normal",
        score: 70,
        tags: ["normal", "review"]
      })).toBe(false);
    });
  });
}); 