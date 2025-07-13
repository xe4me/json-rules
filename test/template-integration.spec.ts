import { RulePilot, type Rule } from "../src";

describe("Template Integration Tests", () => {
  describe("Field-to-Field Comparisons", () => {
    it("should compare field values using template references", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "drivingExperience", operator: ">", value: "{age}" }],
        },
      };

      const data = {
        age: 25,
        drivingExperience: 30,
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });

    it("should handle field-to-field comparisons that fail", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "drivingExperience", operator: ">", value: "{age}" }],
        },
      };

      const data = {
        age: 30,
        drivingExperience: 25,
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(false);
    });

    it("should handle nested field references", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "salary", operator: ">=", value: "{profile.minSalary}" },
          ],
        },
      };

      const data = {
        salary: 75000,
        profile: {
          minSalary: 60000,
        },
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });

    it("should handle equality comparisons with templates", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "currentStatus",
              operator: "==",
              value: "{requiredStatus}",
            },
          ],
        },
      };

      const data = {
        currentStatus: "active",
        requiredStatus: "active",
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });

    it("should handle inequality comparisons with templates", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "currentStatus", operator: "!=", value: "{bannedStatus}" },
          ],
        },
      };

      const data = {
        currentStatus: "active",
        bannedStatus: "suspended",
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });
  });

  describe("String Operations with Templates", () => {
    it("should handle contains operations with templates", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "fullName", operator: "contains", value: "{firstName}" },
          ],
        },
      };

      const data = {
        fullName: "John Doe Smith",
        firstName: "John",
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });

    it("should handle startsWith operations with templates", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "email",
              operator: "starts with",
              value: "{usernamePrefix}",
            },
          ],
        },
      };

      const data = {
        email: "admin@example.com",
        usernamePrefix: "admin",
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });

    it("should handle endsWith operations with templates", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "email", operator: "ends with", value: "{domainSuffix}" },
          ],
        },
      };

      const data = {
        email: "user@company.com",
        domainSuffix: "company.com",
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });

    it("should handle regex matches with templates", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "phoneNumber",
              operator: "matches",
              value: "{phonePattern}",
            },
          ],
        },
      };

      const data = {
        phoneNumber: "123-456-7890",
        phonePattern: "\\d{3}-\\d{3}-\\d{4}",
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });
  });

  describe("Date Comparisons with Templates", () => {
    it("should handle date comparisons with templates", async () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "startDate",
              operator: "is after",
              value: "{currentDate}",
            },
          ],
        },
      };

      const data = {
        startDate: tomorrow,
        currentDate: now,
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });

    it("should handle date range comparisons with templates", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "birthYear", operator: "is between", value: "{ageRange}" },
          ],
        },
      };

      const data = {
        birthYear: 1990,
        ageRange: [1980, 2000],
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });
  });

  describe("Array Operations with Templates", () => {
    it("should handle array contains with templates", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "skills",
              operator: "array contains",
              value: "{requiredSkill}",
            },
          ],
        },
      };

      const data = {
        skills: ["javascript", "typescript", "react"],
        requiredSkill: "javascript",
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });

    it("should handle 'in' operations with templates", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "status", operator: "in", value: "{allowedStatuses}" },
          ],
        },
      };

      const data = {
        status: "active",
        allowedStatuses: ["active", "pending", "approved"],
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });

    it("should handle 'contains any' operations with templates", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "description",
              operator: "contains any",
              value: "{keywords}",
            },
          ],
        },
      };

      const data = {
        description: "This is an awesome product with great features",
        keywords: ["awesome", "excellent", "fantastic"],
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });
  });

  describe("Complex Template Scenarios", () => {
    it("should handle multiple template variables in different constraints", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "age", operator: ">=", value: "{minAge}" },
            { field: "experience", operator: ">=", value: "{minExperience}" },
            { field: "salary", operator: "is between", value: "{salaryRange}" },
          ],
        },
      };

      const data = {
        age: 30,
        experience: 5,
        salary: 75000,
        minAge: 25,
        minExperience: 3,
        salaryRange: [60000, 100000],
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });

    it("should handle deeply nested template references", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "currentLevel",
              operator: ">=",
              value: "{requirements.level.minimum}",
            },
          ],
        },
      };

      const data = {
        currentLevel: 5,
        requirements: {
          level: {
            minimum: 3,
            maximum: 10,
          },
        },
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });

    it("should handle template references in complex conditions", async () => {
      type UserData = { priority: string; urgency: string };
      const rule: Rule<UserData> = {
        conditions: {
          any: [
            { field: "priority", operator: "==", value: "{highPriority}" },
            { field: "urgency", operator: "==", value: "{urgent}" },
          ],
        },
      };

      const data = {
        priority: "high",
        urgency: "normal",
        highPriority: "high",
        urgent: "urgent",
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });

    it("should handle template references with sub-rules", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "department",
              operator: "==",
              value: "{targetDepartment}",
            },
            {
              any: [
                { field: "level", operator: ">=", value: "{minLevel}" },
                {
                  field: "experience",
                  operator: ">=",
                  value: "{minExperience}",
                },
              ],
              result: "qualified",
            },
          ],
        },
      };

      const data = {
        department: "engineering",
        level: 3,
        experience: 2,
        targetDepartment: "engineering",
        minLevel: 4,
        minExperience: 5,
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle missing template variables gracefully", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "age", operator: ">", value: "{missingField}" }],
        },
      };

      const data = {
        age: 25,
      };

      // Should return false when template variable is missing
      expect(await RulePilot.evaluate(rule, data)).toBe(false);
    });

    it("should handle undefined nested template variables", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "salary",
              operator: ">=",
              value: "{profile.missing.field}",
            },
          ],
        },
      };

      const data = {
        salary: 75000,
        profile: {
          name: "John",
        },
      };

      // Should return false when nested template variable is missing
      expect(await RulePilot.evaluate(rule, data)).toBe(false);
    });

    it("should handle template variables with null values", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "status", operator: "==", value: "{nullField}" }],
        },
      };

      const data = {
        status: null,
        nullField: null,
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });
  });

  describe("Mixed Template and Literal Values", () => {
    it("should handle rules with both template and literal values", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "age", operator: ">=", value: 18 }, // literal value
            { field: "experience", operator: ">=", value: "{minExperience}" }, // template value
          ],
        },
      };

      const data = {
        age: 25,
        experience: 5,
        minExperience: 3,
      };

      expect(await RulePilot.evaluate(rule, data)).toBe(true);
    });

    it("should handle array of criteria with template values", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "score", operator: ">=", value: "{passingScore}" }],
        },
      };

      const multipleData = [
        { score: 85, passingScore: 70 },
        { score: 65, passingScore: 70 },
        { score: 90, passingScore: 80 },
      ];

      const results = await RulePilot.evaluate(rule, multipleData);
      expect(results).toEqual([true, false, true]);
    });
  });
});
