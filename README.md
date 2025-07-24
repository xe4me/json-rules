[![npm version](https://badge.fury.io/js/@ivandt/json-rules.svg)](https://badge.fury.io/js/@ivandt/json-rules?v1.3.1)

| Statements                                                                  | Functions                                                                  | Lines                                                                  |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Functions](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) |

# JsonRules

A powerful, lightweight, and fast rule engine for JavaScript and TypeScript applications.

## Overview

**JsonRules** is a modern rule engine that evaluates human-readable JSON rules against data criteria. Whether you need simple boolean evaluations or complex conditional logic with custom results, JsonRules provides an intuitive and performant solution.

### Key Features

- 🚀 **High Performance**: 10,000+ rule evaluations in ~35-40ms
- 📦 **Zero Dependencies**: Lightweight with no external dependencies
- 🔧 **TypeScript First**: Full TypeScript support with comprehensive type definitions
- 🌐 **Universal**: Runs seamlessly in Node.js and browsers
- 🛠️ **Flexible**: Support for simple boolean rules and complex granular evaluations
- 🎯 **Intuitive**: Human-readable JSON syntax
- 🔄 **Extensible**: Fluent builder API and dynamic criteria mutation
- 🧪 **Reliable**: Comprehensive validation and debugging tools

## Operators Reference

JsonRules supports a comprehensive set of operators for different data types and comparison scenarios:

### Equality Operators

**`==` (Equal To)**
- **Description**: Tests if the field value equals the constraint value using JavaScript equality
- **Accepts**: `string | number | boolean | Date | null`
- **Example**: 
  ```typescript
  { field: "status", operator: "==", value: "active" }
  { field: "count", operator: "==", value: 42 }
  { field: "isEnabled", operator: "==", value: true }
  { field: "deletedAt", operator: "==", value: null }
  ```

**`!=` (Not Equal To)**
- **Description**: Tests if the field value does not equal the constraint value
- **Accepts**: `string | number | boolean | Date | null`
- **Example**:
  ```typescript
  { field: "status", operator: "!=", value: "inactive" }
  { field: "count", operator: "!=", value: 0 }
  ```

### Comparison Operators

**`is greater than`**
- **Description**: Tests if the field value is greater than the constraint value
- **Accepts**: `string | number | Date`
- **Example**:
  ```typescript
  { field: "age", operator: "is greater than", value: 18 }
  { field: "score", operator: "is greater than", value: 85.5 }
  { field: "createdAt", operator: "is greater than", value: new Date('2024-01-01') }
  ```

**`is less than`**
- **Description**: Tests if the field value is less than the constraint value
- **Accepts**: `string | number | Date`
- **Example**:
  ```typescript
  { field: "age", operator: "is less than", value: 65 }
  { field: "price", operator: "is less than", value: 100.00 }
  ```

**`is greater than or equal`**
- **Description**: Tests if the field value is greater than or equal to the constraint value
- **Accepts**: `string | number | Date`
- **Example**:
  ```typescript
  { field: "minimumAge", operator: "is greater than or equal", value: 21 }
  { field: "balance", operator: "is greater than or equal", value: 1000 }
  ```

**`is less than or equal`**
- **Description**: Tests if the field value is less than or equal to the constraint value
- **Accepts**: `string | number | Date`
- **Example**:
  ```typescript
  { field: "maxItems", operator: "is less than or equal", value: 10 }
  { field: "endDate", operator: "is less than or equal", value: new Date('2024-12-31') }
  ```

### Range Operators

**`is between numbers`**
- **Description**: Tests if a numeric field value falls within a specified range (inclusive)
- **Accepts**: `[number, number]` (tuple of min and max values)
- **Example**:
  ```typescript
  { field: "age", operator: "is between numbers", value: [18, 65] }
  { field: "score", operator: "is between numbers", value: [80.0, 100.0] }
  ```

**`is not between numbers`**
- **Description**: Tests if a numeric field value falls outside a specified range
- **Accepts**: `[number, number]` (tuple of min and max values)
- **Example**:
  ```typescript
  { field: "temperature", operator: "is not between numbers", value: [32, 212] }
  ```

**`is between dates`**
- **Description**: Tests if a date field value falls within a specified date range (inclusive)
- **Accepts**: `[Date, Date]` (tuple of start and end dates)
- **Example**:
  ```typescript
  { field: "eventDate", operator: "is between dates", value: [new Date('2024-01-01'), new Date('2024-12-31')] }
  { field: "birthDate", operator: "is between dates", value: [new Date('1990-01-01'), new Date('2000-12-31')] }
  ```

**`is not between dates`**
- **Description**: Tests if a date field value falls outside a specified date range
- **Accepts**: `[Date, Date]` (tuple of start and end dates)
- **Example**:
  ```typescript
  { field: "maintenanceDate", operator: "is not between dates", value: [new Date('2024-06-01'), new Date('2024-06-30')] }
  ```

### Collection Operators

**`in`**
- **Description**: Tests if the field value exists in the provided array
- **Accepts**: `(string | number | boolean | object | null)[]`
- **Example**:
  ```typescript
  { field: "country", operator: "in", value: ["US", "CA", "GB"] }
  { field: "priority", operator: "in", value: [1, 2, 3] }
  { field: "plan", operator: "in", value: ["basic", "premium"] }
  ```

**`not in`**
- **Description**: Tests if the field value does not exist in the provided array
- **Accepts**: `(string | number | boolean | object | null)[]`
- **Example**:
  ```typescript
  { field: "status", operator: "not in", value: ["banned", "suspended"] }
  { field: "role", operator: "not in", value: ["guest", "anonymous"] }
  ```

**`array contains`**
- **Description**: Tests if an array field contains the specified value
- **Accepts**: `string | number | boolean | object | null`
- **Example**:
  ```typescript
  { field: "skills", operator: "array contains", value: "javascript" }
  { field: "tags", operator: "array contains", value: "urgent" }
  ```

**`array no contains`**
- **Description**: Tests if an array field does not contain the specified value
- **Accepts**: `string | number | boolean | object | null`
- **Example**:
  ```typescript
  { field: "permissions", operator: "array no contains", value: "admin" }
  { field: "categories", operator: "array no contains", value: "restricted" }
  ```

### String Operators

**`contains`**
- **Description**: Tests if a string field contains the specified substring
- **Accepts**: `string`
- **Example**:
  ```typescript
  { field: "email", operator: "contains", value: "@company.com" }
  { field: "description", operator: "contains", value: "urgent" }
  ```

**`not contains`**
- **Description**: Tests if a string field does not contain the specified substring
- **Accepts**: `string`
- **Example**:
  ```typescript
  { field: "message", operator: "not contains", value: "spam" }
  { field: "title", operator: "not contains", value: "draft" }
  ```

**`contains any`**
- **Description**: Tests if a string field contains any of the specified substrings
- **Accepts**: `string[]`
- **Example**:
  ```typescript
  { field: "description", operator: "contains any", value: ["urgent", "critical", "emergency"] }
  { field: "tags", operator: "contains any", value: ["react", "vue", "angular"] }
  ```

**`not contains any`**
- **Description**: Tests if a string field does not contain any of the specified substrings
- **Accepts**: `string[]`
- **Example**:
  ```typescript
  { field: "content", operator: "not contains any", value: ["spam", "scam", "phishing"] }
  ```

**`starts with`**
- **Description**: Tests if a string field starts with the specified prefix
- **Accepts**: `string`
- **Example**:
  ```typescript
  { field: "phoneNumber", operator: "starts with", value: "+1" }
  { field: "productCode", operator: "starts with", value: "PRD-" }
  ```

**`ends with`**
- **Description**: Tests if a string field ends with the specified suffix
- **Accepts**: `string`
- **Example**:
  ```typescript
  { field: "email", operator: "ends with", value: "@company.com" }
  { field: "filename", operator: "ends with", value: ".pdf" }
  ```

### Pattern Matching Operators

**`matches`**
- **Description**: Tests if a string field matches a regular expression pattern
- **Accepts**: `RegexPattern` object with `regex` string and optional `flags` string
- **Example**:
  ```typescript
  { field: "email", operator: "matches", value: { regex: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$" } }
  { field: "phoneNumber", operator: "matches", value: { regex: "^\\+1[0-9]{10}$", flags: "i" } }
  ```

**`not matches`**
- **Description**: Tests if a string field does not match a regular expression pattern
- **Accepts**: `RegexPattern` object with `regex` string and optional `flags` string
- **Example**:
  ```typescript
  { field: "username", operator: "not matches", value: { regex: "^admin|root|test$", flags: "i" } }
  ```

### Date Operators

**`is before`**
- **Description**: Tests if a date field is before the specified date
- **Accepts**: `string | number | Date`
- **Example**:
  ```typescript
  { field: "expirationDate", operator: "is before", value: new Date('2024-12-31') }
  { field: "createdAt", operator: "is before", value: "2024-01-01T00:00:00Z" }
  ```

**`is after`**
- **Description**: Tests if a date field is after the specified date
- **Accepts**: `string | number | Date`
- **Example**:
  ```typescript
  { field: "startDate", operator: "is after", value: new Date('2024-01-01') }
  { field: "lastLogin", operator: "is after", value: 1704067200000 } // Unix timestamp
  ```

**`is on or before`**
- **Description**: Tests if a date field is on or before the specified date
- **Accepts**: `string | number | Date`
- **Example**:
  ```typescript
  { field: "deadline", operator: "is on or before", value: new Date('2024-03-31') }
  ```

**`is on or after`**
- **Description**: Tests if a date field is on or after the specified date
- **Accepts**: `string | number | Date`
- **Example**:
  ```typescript
  { field: "validFrom", operator: "is on or after", value: new Date('2024-01-01') }
  ```

### Template Variables

All operators support template variables that reference other fields in the criteria object:

```typescript
// Reference another field's value
{ field: "endDate", operator: "is after", value: "{startDate}" }
{ field: "maxPrice", operator: "is greater than", value: "{basePrice}" }

// Works with nested properties too
{ field: "shipping.cost", operator: "is less than", value: "{order.total}" }
```

## Installation

```bash
npm install @ivandt/json-rules
```

```bash
yarn add @ivandt/json-rules
```

## Quick Start

### Basic Usage

```typescript
import { JsonRules, Rule } from "@ivandt/json-rules";

// Define a rule
const rule: Rule = {
  conditions: {
    all: [
      { field: "age", operator: "is greater than or equal", value: 18 },
      { field: "country", operator: "in", value: ["US", "CA", "GB"] },
      { field: "hasAccount", operator: "==", value: true }
    ]
  }
};

// Test against criteria
const user = {
  age: 25,
  country: "US",
  hasAccount: true
};

const result = await JsonRules.evaluate(rule, user);
console.log(result); // true
```

### Static vs Instance Usage

JsonRules can be used as a static class or as an instance:

```typescript
// Static approach (recommended for most cases)
const result = await JsonRules.evaluate(rule, criteria);

// Instance approach (useful for different configurations)
const engine = new JsonRules();
const result = await engine.evaluate(rule, criteria);
```

## Rule Structure

### Basic Rule Components

A rule consists of:
- **conditions**: The logic to evaluate (required)
- **default**: Default result if no conditions match (optional)

```typescript
const rule: Rule = {
  conditions: {
    // Condition logic here
  },
  default: false // Optional default result
};
```

### Condition Types

JsonRules supports three condition types:

- **`all`**: All constraints must be true (AND logic)
- **`any`**: At least one constraint must be true (OR logic)  
- **`none`**: No constraints should be true (NOT logic)

```typescript
const rule: Rule = {
  conditions: {
    all: [
      { field: "age", operator: "is greater than or equal", value: 18 },
      { field: "verified", operator: "==", value: true }
    ]
  }
};
```

## Examples

### 1. E-commerce Discount Eligibility

```typescript
const discountRule: Rule = {
  conditions: {
    any: [
      {
        // Premium members get discount automatically
        all: [
          { field: "membershipLevel", operator: "==", value: "premium" },
          { field: "accountAge", operator: "is greater than", value: 30 }
        ]
      },
      {
        // Regular users need minimum purchase
        all: [
          { field: "orderTotal", operator: "is greater than or equal", value: 100 },
          { field: "country", operator: "in", value: ["US", "CA"] },
          { field: "hasCoupon", operator: "==", value: true }
        ]
      }
    ]
  }
};

const customer = {
  membershipLevel: "standard",
  orderTotal: 150,
  country: "US",
  hasCoupon: true,
  accountAge: 15
};

const isEligible = await JsonRules.evaluate(discountRule, customer);
// Result: true (meets second condition)
```

### 2. Date Range Validation

```typescript
const eventRule: Rule = {
  conditions: {
    all: [
      { 
        field: "eventDate", 
        operator: "is between dates", 
        value: [new Date('2024-01-01'), new Date('2024-12-31')] 
      },
      { field: "participantAge", operator: "is between numbers", value: [18, 65] },
      { field: "registrationStatus", operator: "==", value: "confirmed" }
    ]
  }
};

const participant = {
  eventDate: new Date('2024-06-15'),
  participantAge: 28,
  registrationStatus: "confirmed"
};

const canParticipate = await JsonRules.evaluate(eventRule, participant);
// Result: true
```

### 3. String Pattern Matching

```typescript
const contentRule: Rule = {
  conditions: {
    all: [
      { field: "title", operator: "contains any", value: ["urgent", "important", "critical"] },
      { field: "email", operator: "matches", value: { regex: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$" } },
      { field: "description", operator: "not contains", value: "spam" }
    ]
  }
};

const message = {
  title: "Urgent: System Maintenance",
  email: "admin@company.com",
  description: "Critical system update required"
};

const isValid = await JsonRules.evaluate(contentRule, message);
// Result: true
```

### 4. Granular Results

Instead of boolean results, you can return specific values based on which conditions match:

```typescript
const shippingRule: Rule = {
  conditions: [
    {
      all: [
        { field: "orderValue", operator: "is greater than or equal", value: 200 },
        { field: "membershipLevel", operator: "==", value: "premium" }
      ],
      result: { shipping: "free", priority: "express" }
    },
    {
      all: [
        { field: "orderValue", operator: "is greater than or equal", value: 100 },
        { field: "country", operator: "in", value: ["US", "CA"] }
      ],
      result: { shipping: "free", priority: "standard" }
    },
    {
      all: [
        { field: "orderValue", operator: "is greater than", value: 50 }
      ],
      result: { shipping: 5.99, priority: "standard" }
    }
  ],
  default: { shipping: 12.99, priority: "standard" }
};

const order = {
  orderValue: 150,
  country: "US",
  membershipLevel: "standard"
};

const shippingInfo = await JsonRules.evaluate(shippingRule, order);
// Result: { shipping: "free", priority: "standard" }
```

## Advanced Features

### Nested Property Access

Access nested object properties using dot notation:

```typescript
const rule: Rule = {
  conditions: {
    all: [
      { field: "user.profile.age", operator: "is greater than or equal", value: 21 },
      { field: "user.preferences.newsletter", operator: "==", value: true },
      { field: "account.billing.verified", operator: "==", value: true }
    ]
  }
};

const data = {
  user: {
    profile: { age: 25 },
    preferences: { newsletter: true }
  },
  account: {
    billing: { verified: true }
  }
};
```

### Multiple Criteria Evaluation

Evaluate the same rule against multiple data sets:

```typescript
const users = [
  { age: 25, country: "US", verified: true },
  { age: 17, country: "CA", verified: true },
  { age: 30, country: "GB", verified: false }
];

const results = await JsonRules.evaluate(rule, users);
// Returns array: [true, false, false]
```

### Complex Nested Conditions

```typescript
const complexRule: Rule = {
  conditions: {
    any: [
      {
        all: [
          { field: "region", operator: "==", value: "North America" },
          {
            any: [
              { field: "salesVolume", operator: "is greater than", value: 1000000 },
              {
                all: [
                  { field: "customerSatisfaction", operator: "is greater than or equal", value: 4.5 },
                  { field: "marketShare", operator: "is greater than", value: 0.15 }
                ]
              }
            ]
          }
        ]
      },
      {
        all: [
          { field: "region", operator: "==", value: "Europe" },
          { field: "complianceScore", operator: "is greater than or equal", value: 95 },
          { field: "localPartnership", operator: "==", value: true }
        ]
      }
    ]
  }
};
```

## Validation and Debugging

### Rule Validation

Always validate rules before evaluation:

```typescript
const validation = JsonRules.validate(rule);

if (!validation.isValid) {
  console.error("Rule validation failed:", validation.error);
  // Handle validation error
} else {
  const result = await JsonRules.evaluate(rule, criteria);
}
```

### Debug Mode

Enable debug mode for detailed logging:

```typescript
// Enable debug output
process.env.DEBUG = "true";

const result = await JsonRules.evaluate(rule, criteria);
// Detailed logs will be printed to console
```

## Performance Tips

1. **Structure conditions efficiently**: Place most likely to fail conditions first in `all` blocks
2. **Use specific operators**: `==` is faster than `contains` for exact matches
3. **Minimize nested conditions**: Flatten when possible for better performance
4. **Cache compiled rules**: Reuse the same rule objects across evaluations
5. **Validate once**: Validate rules at application startup, not per evaluation

## Error Handling

```typescript
import { JsonRules, RuleError } from "@ivandt/json-rules";

try {
  const result = await JsonRules.evaluate(rule, criteria);
} catch (error) {
  if (error instanceof RuleError) {
    console.error("Rule validation error:", error.message);
  } else {
    console.error("Evaluation error:", error);
  }
}
```

## TypeScript Support

JsonRules provides full TypeScript support with generic types:

```typescript
interface UserCriteria {
  age: number;
  country: string;
  verified: boolean;
}

interface DiscountResult {
  percentage: number;
  code: string;
}

const rule: Rule<UserCriteria, DiscountResult> = {
  conditions: {
    all: [
      { field: "age", operator: "is greater than or equal", value: 18 },
      { field: "verified", operator: "==", value: true }
    ]
  }
};

const result = await JsonRules.evaluate<DiscountResult>(rule, userData);
```

## Fluent Rule Builder

For complex rules, use the fluent builder API:

```typescript
import { RuleBuilder } from "@ivandt/json-rules";

const rule = RuleBuilder
  .create()
  .condition("all", [
    RuleBuilder.constraint("age", "is greater than or equal", 18),
    RuleBuilder.constraint("country", "in", ["US", "CA"]),
    RuleBuilder.condition("any", [
      RuleBuilder.constraint("memberLevel", "==", "premium"),
      RuleBuilder.constraint("orderValue", "is greater than", 100)
    ])
  ])
  .build();
```

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our GitHub repository.


