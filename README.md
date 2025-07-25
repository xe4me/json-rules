[![npm version](https://badge.fury.io/js/@ivandt/json-rules.svg)](https://badge.fury.io/js/@ivandt/json-rules?v1.3.1)

| Statements                                                                  | Functions                                                                  | Lines                                                                  |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Functions](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) |

<div align="center">

# JsonRules Engine

**The most intuitive and powerful rule engine for JavaScript & TypeScript**

*Build complex business logic with simple, readable JSON rules*

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-green.svg)](https://www.npmjs.com/package/@ivandt/json-rules)
[![Performance](https://img.shields.io/badge/Performance-10k+_rules/40ms-brightgreen.svg)](#performance)

</div>

---

## 🚀 Why JsonRules?

In modern applications, business logic often becomes scattered across your codebase, making it hard to maintain, test, and understand. **JsonRules** solves this by letting you define your business rules as clean, human-readable JSON that can be evaluated against any data.

### ✨ Perfect For

- **E-commerce**: Dynamic pricing, discount eligibility, shipping rules
- **User Management**: Access control, feature flags, membership tiers  
- **Content Filtering**: Moderation rules, recommendation engines
- **Workflow Automation**: Approval processes, notification triggers
- **A/B Testing**: Feature rollout conditions, experiment targeting

### 🎯 Core Benefits

| Feature | Benefit |
|---------|---------|
| **🔍 Human Readable** | Business stakeholders can read and understand rules |
| **⚡ Blazing Fast** | 10,000+ rule evaluations in ~40ms |
| **🛡️ Type Safe** | Full TypeScript support with intelligent autocompletion |
| **🌐 Universal** | Works seamlessly in Node.js, browsers, and edge functions |
| **📦 Zero Dependencies** | Lightweight with no external dependencies |
| **🔧 Flexible** | Simple boolean rules to complex multi-condition logic |

---

## 🚀 Quick Start

### Installation

```bash
# npm
npm install @ivandt/json-rules

# yarn
yarn add @ivandt/json-rules

# pnpm
pnpm add @ivandt/json-rules
```

### Your First Rule

```typescript
import { JsonRules, Rule } from "@ivandt/json-rules";

// Define business logic as readable JSON
const discountRule: Rule = {
  conditions: {
    all: [
      { field: "totalAmount", operator: "is greater than or equal", value: 100 },
      { field: "customerType", operator: "is equal", value: "premium" },
      { field: "country", operator: "in", value: ["US", "CA"] }
    ]
  }
};

// Test against real data
const order = {
  totalAmount: 150,
  customerType: "premium", 
  country: "US"
};

const qualifiesForDiscount = await JsonRules.evaluate(discountRule, order);
console.log(qualifiesForDiscount); // true ✅
```

That's it! No complex setup, no learning curve—just intuitive rules that work.

---

## 📚 Complete Operator Reference

JsonRules provides **40+ comprehensive operators** designed for real-world applications, including advanced math, data validation, and unit verification:

### 🟰 Equality & Comparison

| Operator | Description | Accepts | Example |
|----------|-------------|---------|---------|
| `is equal` | Equal to | `string \| number \| boolean \| Date \| null` | `{ field: "status", operator: "is equal", value: "active" }` |
| `is not equal` | Not equal to | `string \| number \| boolean \| Date \| null` | `{ field: "status", operator: "is not equal", value: "banned" }` |
| `is greater than` | Greater than comparison | `string \| number \| Date` | `{ field: "age", operator: "is greater than", value: 18 }` |
| `is less than` | Less than comparison | `string \| number \| Date` | `{ field: "price", operator: "is less than", value: 100 }` |
| `is greater than or equal` | Greater than or equal | `string \| number \| Date` | `{ field: "score", operator: "is greater than or equal", value: 80 }` |
| `is less than or equal` | Less than or equal | `string \| number \| Date` | `{ field: "items", operator: "is less than or equal", value: 10 }` |

### 📊 Range & Between

| Operator | Description | Accepts | Example |
|----------|-------------|---------|---------|
| `is between numbers` | Number within range (inclusive) | `[number, number]` | `{ field: "age", operator: "is between numbers", value: [18, 65] }` |
| `is not between numbers` | Number outside range | `[number, number]` | `{ field: "temperature", operator: "is not between numbers", value: [32, 100] }` |
| `is between dates` | Date within range (inclusive) | `[Date, Date]` | `{ field: "eventDate", operator: "is between dates", value: [startDate, endDate] }` |
| `is not between dates` | Date outside range | `[Date, Date]` | `{ field: "blackoutDate", operator: "is not between dates", value: [holiday1, holiday2] }` |

### 📋 Collection & Array

| Operator | Description | Accepts | Example |
|----------|-------------|---------|---------|
| `in` | Value exists in array | `(string \| number \| boolean \| object \| null)[]` | `{ field: "country", operator: "in", value: ["US", "CA", "UK"] }` |
| `not in` | Value not in array | `(string \| number \| boolean \| object \| null)[]` | `{ field: "status", operator: "not in", value: ["banned", "suspended"] }` |
| `array contains` | Array field contains value | `string \| number \| boolean \| object \| null` | `{ field: "skills", operator: "array contains", value: "javascript" }` |
| `array no contains` | Array field doesn't contain value | `string \| number \| boolean \| object \| null` | `{ field: "permissions", operator: "array no contains", value: "admin" }` |

### 🔤 String Operations

| Operator | Description | Accepts | Example |
|----------|-------------|---------|---------|
| `contains` | String contains substring | `string` | `{ field: "email", operator: "contains", value: "@company.com" }` |
| `not contains` | String doesn't contain substring | `string` | `{ field: "message", operator: "not contains", value: "spam" }` |
| `contains any` | String contains any substring | `string[]` | `{ field: "title", operator: "contains any", value: ["urgent", "critical"] }` |
| `not contains any` | String contains none of substrings | `string[]` | `{ field: "content", operator: "not contains any", value: ["spam", "scam"] }` |
| `starts with` | String starts with prefix | `string` | `{ field: "productCode", operator: "starts with", value: "PRD-" }` |
| `ends with` | String ends with suffix | `string` | `{ field: "filename", operator: "ends with", value: ".pdf" }` |

### 🎯 Pattern Matching

| Operator | Description | Accepts | Example |
|----------|-------------|---------|---------|
| `matches` | Matches regex pattern | `{ regex: string, flags?: string }` | `{ field: "email", operator: "matches", value: { regex: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$" } }` |
| `not matches` | Doesn't match regex pattern | `{ regex: string, flags?: string }` | `{ field: "username", operator: "not matches", value: { regex: "^(admin\|root)$", flags: "i" } }` |

### 📅 Date Operations

| Operator | Description | Accepts | Example |
|----------|-------------|---------|---------|
| `is before` | Date is before specified date | `string \| number \| Date` | `{ field: "expiry", operator: "is before", value: new Date('2024-12-31') }` |
| `is after` | Date is after specified date | `string \| number \| Date` | `{ field: "startDate", operator: "is after", value: new Date('2024-01-01') }` |
| `is on or before` | Date is on or before specified date | `string \| number \| Date` | `{ field: "deadline", operator: "is on or before", value: new Date() }` |
| `is on or after` | Date is on or after specified date | `string \| number \| Date` | `{ field: "validFrom", operator: "is on or after", value: new Date() }` |

### 🔢 Math & Number Validation

| Operator | Description | Accepts | Example |
|----------|-------------|---------|---------|
| `is even` | Number is even | `null` | `{ field: "quantity", operator: "is even", value: null }` |
| `is odd` | Number is odd | `null` | `{ field: "productId", operator: "is odd", value: null }` |
| `is positive` | Number is positive (> 0) | `null` | `{ field: "balance", operator: "is positive", value: null }` |
| `is negative` | Number is negative (< 0) | `null` | `{ field: "adjustment", operator: "is negative", value: null }` |
| `is empty` | Value is null, undefined, or empty string/array | `null` | `{ field: "optionalField", operator: "is empty", value: null }` |
| `is not empty` | Value is not empty | `null` | `{ field: "requiredField", operator: "is not empty", value: null }` |

### 📊 Data Validation

| Operator | Description | Accepts | Example |
|----------|-------------|---------|---------|
| `is valid email` | Valid email address | `EmailValidationConfig \| null` | `{ field: "email", operator: "is valid email", value: null }` |
| `is valid phone` | Valid phone number | `PhoneValidationConfig` | `{ field: "phone", operator: "is valid phone", value: { locale: "us" } }` |
| `is URL` | Valid URL | `URLValidationConfig` | `{ field: "website", operator: "is URL", value: { requireTld: false } }` |
| `is UUID` | Valid UUID | `UUIDValidationConfig` | `{ field: "id", operator: "is UUID", value: { version: 4 } }` |
| `is EAN` | Valid EAN barcode | `null` | `{ field: "barcode", operator: "is EAN", value: null }` |
| `is IMEI` | Valid IMEI number | `IMEIValidationConfig` | `{ field: "deviceId", operator: "is IMEI", value: { allowHyphens: true } }` |
| `is unit` | Valid unit of measurement | `UnitType` | `{ field: "distance", operator: "is unit", value: "length" }` |
| `is country` | Valid country identifier | `CountryValidationConfig` | `{ field: "country", operator: "is country", value: { format: "iso2" } }` |
| `is domain` | Valid domain name | `DomainValidationConfig` | `{ field: "domain", operator: "is domain", value: { requireTld: true } }` |

---

## 🏗️ Rule Architecture

### Rule Components

Every JsonRules rule consists of:

```typescript
interface Rule {
  conditions: Condition | Condition[];  // The logic to evaluate (required)
  default?: any;                       // Fallback result (optional)
}
```

### Condition Types

JsonRules supports three logical operators for combining constraints:

| Type | Logic | Description | Use Case |
|------|-------|-------------|----------|
| `all` | **AND** | All constraints must be true | User must be 18+ AND verified AND in allowed country |
| `any` | **OR** | At least one constraint must be true | Premium member OR high-value order OR special promotion |
| `none` | **NOT** | No constraints should be true | Not banned AND not in restricted region |

### Constraint Structure

Each constraint follows this pattern:

```typescript
{
  field: string,           // Property path (supports dot notation)
  operator: string,        // Comparison operator
  value: any              // Expected value or template reference
}
```

---

## 💡 Real-World Examples

### 🛒 E-commerce: Dynamic Shipping Rules

```typescript
const shippingRule: Rule = {
  conditions: [
    {
      // Free express shipping for premium members
      all: [
        { field: "membershipTier", operator: "is equal", value: "premium" },
        { field: "orderValue", operator: "is greater than or equal", value: 50 }
      ],
      result: { cost: 0, method: "express", deliveryDays: 1 }
    },
    {
      // Free standard shipping for orders over $100
      all: [
        { field: "orderValue", operator: "is greater than or equal", value: 100 },
        { field: "country", operator: "in", value: ["US", "CA"] }
      ],
      result: { cost: 0, method: "standard", deliveryDays: 3 }
    },
    {
      // Express shipping available
      all: [
        { field: "orderValue", operator: "is greater than", value: 25 },
        { field: "zipCode", operator: "matches", value: { regex: "^(90|91|92)" } }
      ],
      result: { cost: 9.99, method: "express", deliveryDays: 1 }
    }
  ],
  default: { cost: 15.99, method: "standard", deliveryDays: 5 }
};

const order = {
  orderValue: 75,
  membershipTier: "standard",
  country: "US",
  zipCode: "90210"
};

const shipping = await JsonRules.evaluate(shippingRule, order);
// Result: { cost: 9.99, method: "express", deliveryDays: 1 }
```

### 🎫 Event Management: Ticket Pricing

```typescript
const ticketPricingRule: Rule = {
  conditions: [
    {
      // Early bird pricing
      all: [
        { field: "purchaseDate", operator: "is before", value: new Date('2024-03-01') },
        { field: "attendeeType", operator: "is equal", value: "regular" }
      ],
      result: { price: 149, category: "early-bird" }
    },
    {
      // Student discount
      all: [
        { field: "attendeeType", operator: "is equal", value: "student" },
        { field: "age", operator: "is between numbers", value: [16, 25] },
        { field: "hasValidStudentId", operator: "is equal", value: true }
      ],
      result: { price: 99, category: "student" }
    },
    {
      // Group discount (5+ attendees)
      all: [
        { field: "groupSize", operator: "is greater than or equal", value: 5 },
        { field: "totalSpend", operator: "is greater than or equal", value: 500 }
      ],
      result: { price: 129, category: "group" }
    },
    {
      // VIP pricing
      all: [
        { field: "attendeeType", operator: "is equal", value: "vip" },
        { field: "hasBackstageAccess", operator: "is equal", value: true }
      ],
      result: { price: 299, category: "vip" }
    }
  ],
  default: { price: 199, category: "regular" }
};
```

### 🔐 Access Control: Feature Gates

```typescript
const featureAccessRule: Rule = {
  conditions: {
    any: [
      {
        // Admin users get everything
        all: [
          { field: "role", operator: "is equal", value: "admin" },
          { field: "isActive", operator: "is equal", value: true }
        ]
      },
      {
        // Beta users in specific regions
        all: [
          { field: "betaProgram", operator: "is equal", value: true },
          { field: "country", operator: "in", value: ["US", "CA", "GB"] },
          { field: "accountAge", operator: "is greater than", value: 30 }
        ]
      },
      {
        // Premium subscribers
        all: [
          { field: "subscription.plan", operator: "in", value: ["premium", "enterprise"] },
          { field: "subscription.status", operator: "is equal", value: "active" },
          { field: "paymentStatus", operator: "is not equal", value: "overdue" }
        ]
      }
    ]
  }
};

const user = {
  role: "user",
  isActive: true,
  betaProgram: true,
  country: "US",
  accountAge: 45,
  subscription: {
    plan: "basic",
    status: "active"
  },
  paymentStatus: "current"
};

const hasAccess = await JsonRules.evaluate(featureAccessRule, user);
// Result: true (matches beta user criteria)
```

### 📊 Analytics: Segmentation Rules

```typescript
const userSegmentationRule: Rule = {
  conditions: [
    {
      // High-value customers
      all: [
        { field: "lifetimeValue", operator: "is greater than or equal", value: 1000 },
        { field: "lastPurchase", operator: "is after", value: "{thirtyDaysAgo}" },
        { field: "averageOrderValue", operator: "is greater than", value: 50 }
      ],
      result: { segment: "high-value", priority: "A", offers: ["vip", "loyalty"] }
    },
    {
      // At-risk customers
      all: [
        { field: "lastPurchase", operator: "is before", value: "{ninetyDaysAgo}" },
        { field: "lifetimeValue", operator: "is greater than", value: 100 },
        { field: "emailEngagement", operator: "is less than", value: 0.1 }
      ],
      result: { segment: "at-risk", priority: "B", offers: ["winback", "discount"] }
    },
    {
      // New customers
      all: [
        { field: "accountAge", operator: "is less than or equal", value: 30 },
        { field: "purchaseCount", operator: "is between numbers", value: [1, 3] }
      ],
      result: { segment: "new-customer", priority: "C", offers: ["welcome", "tutorial"] }
    }
  ],
  default: { segment: "standard", priority: "D", offers: ["general"] }
};
```

---

## 🔧 Advanced Features

### 🎯 Nested Property Access

JsonRules supports deep object traversal using dot notation:

```typescript
const complexDataRule: Rule = {
  conditions: {
    all: [
      { field: "user.profile.demographics.age", operator: "is greater than or equal", value: 21 },
      { field: "user.preferences.notifications.email", operator: "is equal", value: true },
      { field: "account.billing.paymentMethod.type", operator: "is equal", value: "credit_card" },
      { field: "order.items.0.category", operator: "is equal", value: "electronics" }
    ]
  }
};

const data = {
  user: {
    profile: {
      demographics: { age: 28 }
    },
    preferences: {
      notifications: { email: true }
    }
  },
  account: {
    billing: {
      paymentMethod: { type: "credit_card" }
    }
  },
  order: {
    items: [
      { category: "electronics", price: 299 }
    ]
  }
};
```

### 🔗 Template Variables & Field References

Reference other fields dynamically within your rules:

```typescript
const dynamicPricingRule: Rule = {
  conditions: {
    all: [
      // End date must be after start date
      { field: "endDate", operator: "is after", value: "{startDate}" },
      
      // Discount cannot exceed base price
      { field: "discountAmount", operator: "is less than", value: "{basePrice}" },
      
      // Final price calculation
      { field: "finalPrice", operator: "is equal", value: "{basePrice}" },
      
      // Nested field references
      { field: "shipping.cost", operator: "is less than", value: "{order.total}" }
    ]
  }
};
```

### 📊 Batch Processing

Evaluate rules against multiple data sets efficiently:

```typescript
const users = [
  { age: 25, country: "US", verified: true },
  { age: 17, country: "CA", verified: true },
  { age: 30, country: "GB", verified: false },
  { age: 45, country: "US", verified: true }
];

// Process all users at once
const results = await JsonRules.evaluate(eligibilityRule, users);
console.log(results); // [true, false, false, true]

// Or with detailed results
const detailedRule: Rule = {
  conditions: [
    {
      all: [
        { field: "age", operator: "is greater than or equal", value: 18 },
        { field: "verified", operator: "is equal", value: true }
      ],
      result: { eligible: true, reason: "meets-criteria" }
    }
  ],
  default: { eligible: false, reason: "requirements-not-met" }
};

const detailedResults = await JsonRules.evaluate(detailedRule, users);
// Returns array of detailed result objects
```

### 🏗️ Complex Nested Logic

Build sophisticated business rules with nested conditions:

```typescript
const advancedEligibilityRule: Rule = {
  conditions: {
    any: [
      {
        // Path 1: Premium members with good standing
        all: [
          { field: "membershipTier", operator: "in", value: ["premium", "platinum"] },
          { field: "accountStatus", operator: "is equal", value: "good-standing" },
          {
            any: [
              { field: "lifetimeSpend", operator: "is greater than", value: 1000 },
              { field: "referralCount", operator: "is greater than or equal", value: 5 }
            ]
          }
        ]
      },
      {
        // Path 2: New customers with verification
        all: [
          { field: "accountAge", operator: "is less than or equal", value: 30 },
          { field: "emailVerified", operator: "is equal", value: true },
          { field: "phoneVerified", operator: "is equal", value: true },
          {
            none: [
              { field: "flags", operator: "array contains", value: "suspicious" },
              { field: "ipCountry", operator: "in", value: ["blocked-country-1", "blocked-country-2"] }
            ]
          }
        ]
      },
      {
        // Path 3: Corporate accounts
        all: [
          { field: "accountType", operator: "is equal", value: "corporate" },
          { field: "contractValue", operator: "is greater than", value: 10000 },
          { field: "paymentTerms", operator: "is not equal", value: "overdue" }
        ]
      }
    ]
  }
};
```

### 🔢 Math & Data Validation Examples

```typescript
// Math validation for inventory management
const inventoryRule: Rule = {
  conditions: {
    all: [
      { field: "quantity", operator: "is even", value: null },      // Even quantities for packaging
      { field: "balance", operator: "is positive", value: null },   // Positive stock balance  
      { field: "adjustment", operator: "is not empty", value: null } // Required adjustment note
    ]
  }
};

// Data validation for user registration
const registrationRule: Rule = {
  conditions: {
    all: [
      { field: "email", operator: "is valid email", value: { 
        requireTld: true,
        hostBlacklist: ["tempmail.com", "10minutemail.com"]
      }},
      { field: "phone", operator: "is valid phone", value: { locale: "us", strict: false }},
      { field: "website", operator: "is URL", value: { 
        protocols: ["https"],
        requireProtocol: true 
      }},
      { field: "country", operator: "is country", value: { format: "iso2" }}
    ]
  }
};

// Unit validation for product specifications
const productRule: Rule = {
  conditions: {
    all: [
      { field: "dimensions.length", operator: "is unit", value: "length" },  // "5m", "10ft", etc.
      { field: "weight", operator: "is unit", value: "mass" },               // "2kg", "5lbs", etc.
      { field: "capacity", operator: "is unit", value: "volume" }            // "500ml", "1.5l", etc.
    ]
  }
};
```

### 📏 Unit Validation Examples

JsonRules supports comprehensive unit validation across 12 categories:

```typescript
const unitExamples: Rule = {
  conditions: {
    all: [
      // Length: supports metric, imperial, nautical
      { field: "distance", operator: "is unit", value: "length" },     // ✅ "5km", "10ft", "2.5mi"
      
      // Mass: supports metric, imperial, specialized
      { field: "weight", operator: "is unit", value: "mass" },         // ✅ "2kg", "5lbs", "100g"
      
      // Temperature: supports all scales
      { field: "temp", operator: "is unit", value: "temperature" },    // ✅ "23°C", "75°F", "298K"
      
      // Time: from nanoseconds to millennia
      { field: "duration", operator: "is unit", value: "time" },       // ✅ "30s", "5min", "2h"
      
      // Area: square measurements
      { field: "area", operator: "is unit", value: "area" },           // ✅ "100m²", "50ft²"
      
      // Volume: liquid and dry measures
      { field: "volume", operator: "is unit", value: "volume" },       // ✅ "500ml", "2cups", "1gal"
      
      // Energy: various energy units
      { field: "energy", operator: "is unit", value: "energy" },       // ✅ "100J", "5kWh", "200cal"
      
      // Pressure: atmospheric and mechanical
      { field: "pressure", operator: "is unit", value: "pressure" },   // ✅ "1atm", "15psi", "100Pa"
      
      // Speed: velocity measurements
      { field: "speed", operator: "is unit", value: "speed" },         // ✅ "60mph", "25m/s", "10kn"
      
      // Force: mechanical force
      { field: "force", operator: "is unit", value: "force" },         // ✅ "100N", "50lbf"
      
      // Power: electrical and mechanical
      { field: "power", operator: "is unit", value: "power" },         // ✅ "100W", "5kW", "2hp"
      
      // Frequency: oscillations and rotations
      { field: "frequency", operator: "is unit", value: "frequency" }  // ✅ "60Hz", "1kHz", "120rpm"
    ]
  }
};
```

### ⚙️ Validation Configuration Interfaces

**Email Validation**
```typescript
interface EmailValidationConfig {
  allowDisplayName?: boolean;        // Allow "Name <email@domain.com>" format
  requireDisplayName?: boolean;      // Require display name
  allowUtf8LocalPart?: boolean;     // Allow UTF-8 characters in local part
  requireTld?: boolean;             // Require top-level domain
  allowIpDomain?: boolean;          // Allow IP addresses as domain
  allowUnderscores?: boolean;       // Allow underscores in domain
  domainSpecificValidation?: boolean; // Enable domain-specific rules
  blacklistedChars?: string;        // Characters to disallow
  hostBlacklist?: string[];         // Blocked domains
  hostWhitelist?: string[];         // Allowed domains only
}
```

**Phone Validation**
```typescript
interface PhoneValidationConfig {
  locale: string;                   // Required: "us", "gb", "de", etc.
  strict?: boolean;                 // Enable strict formatting validation
}

// Import locale validators to enable them
import "@ivandt/json-rules/validators/phone/us";
import "@ivandt/json-rules/validators/phone/gb";
import "@ivandt/json-rules/validators/phone/de";
```

**URL Validation**
```typescript
interface URLValidationConfig {
  protocols?: string[];             // Allowed protocols ["http", "https", "ftp"]
  requireProtocol?: boolean;        // Require protocol specification
  requireTld?: boolean;             // Require top-level domain
  allowUnderscores?: boolean;       // Allow underscores in domain
  allowTrailingDot?: boolean;       // Allow trailing dot in domain
  allowNumericTld?: boolean;        // Allow numeric TLD
  allowWildcard?: boolean;          // Allow wildcard in domain
  ignoreMaxLength?: boolean;        // Ignore URL length limits
}
```

**UUID Validation**
```typescript
interface UUIDValidationConfig {
  version?: 1 | 2 | 3 | 4 | 5;     // Specific UUID version to validate
}
```

**IMEI Validation**
```typescript
interface IMEIValidationConfig {
  allowHyphens?: boolean;           // Allow hyphenated format "35-209900-176148-1"
}
```

**Country Validation**
```typescript
interface CountryValidationConfig {
  format: "iso2" | "iso3" | "name"; // Required: validation format
}

// Examples:
// iso2: "US", "GB", "DE"
// iso3: "USA", "GBR", "DEU"  
// name: "United States", "Germany", "Japan"
```

**Domain Validation**
```typescript
interface DomainValidationConfig {
  requireTld?: boolean;             // Require top-level domain
  allowUnderscores?: boolean;       // Allow underscores
  allowTrailingDot?: boolean;       // Allow trailing dot
  allowNumericTld?: boolean;        // Allow numeric TLD
  allowWildcard?: boolean;          // Allow wildcard characters
  ignoreMaxLength?: boolean;        // Ignore domain length limits
}
```

**Unit Types**
```typescript
type UnitType = 
  | "length"       // m, km, ft, in, mi, etc.
  | "mass"         // kg, g, lb, oz, ton, etc.
  | "volume"       // l, ml, gal, cup, pt, etc.
  | "temperature"  // °C, °F, K, °R
  | "time"         // s, min, h, day, year, etc.
  | "area"         // m², ft², acre, hectare, etc.
  | "energy"       // J, kWh, cal, BTU, etc.
  | "pressure"     // Pa, psi, atm, bar, etc.
  | "speed"        // m/s, mph, km/h, knots, etc.
  | "force"        // N, lbf, kgf, dyne, etc.
  | "power"        // W, kW, hp, PS, etc.
  | "frequency";   // Hz, rpm, bpm, etc.
```

---

## 🛠️ Development & Integration

### 🏭 Usage Patterns

**Static Class (Recommended for most cases)**
```typescript
import { JsonRules } from "@ivandt/json-rules";

// Simple evaluation
const result = await JsonRules.evaluate(rule, data);

// With validation
const validation = JsonRules.validate(rule);
if (validation.isValid) {
  const result = await JsonRules.evaluate(rule, data);
}
```

**Instance-based (For advanced configurations)**
```typescript
import { JsonRules } from "@ivandt/json-rules";

// Create configured instance
const engine = new JsonRules();

// Use instance methods
const result = await engine.evaluate(rule, data);
```

### 🔍 Validation & Error Handling

Always validate rules before deployment:

```typescript
import { JsonRules, RuleError } from "@ivandt/json-rules";

// Validate rule structure
const validation = JsonRules.validate(complexRule);

if (!validation.isValid) {
  console.error("Rule validation failed:");
  console.error("- Error:", validation.error);
  console.error("- Location:", validation.path);
  console.error("- Expected:", validation.expected);
} else {
  console.log("✅ Rule is valid");
}

// Handle runtime errors
try {
  const result = await JsonRules.evaluate(rule, data);
} catch (error) {
  if (error instanceof RuleError) {
    console.error("Rule processing error:", error.message);
    console.error("Rule details:", error.rule);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

### 🐛 Debug Mode

Enable detailed logging for troubleshooting:

```typescript
// Enable debug output
process.env.DEBUG = "true";

const result = await JsonRules.evaluate(rule, data);
// Outputs detailed evaluation steps:
// ✓ Condition 1: field 'age' (25) is greater than or equal 18
// ✓ Condition 2: field 'country' (US) in [US, CA, GB]
// ✅ Rule evaluation: PASSED
```

### 🚀 Performance Optimization

**Best Practices for High-Performance Rules:**

1. **Structure conditions efficiently**
   ```typescript
   // ✅ Put likely-to-fail conditions first
   {
     all: [
       { field: "isActive", operator: "is equal", value: true }, // Fast boolean check
       { field: "complex.calculation", operator: "is greater than", value: 100 } // Slower nested access
     ]
   }
   ```

2. **Use specific operators**
   ```typescript
   // ✅ Faster
   { field: "status", operator: "is equal", value: "active" }
   
   // ❌ Slower
   { field: "status", operator: "contains", value: "activ" }
   ```

3. **Cache rule objects**
   ```typescript
   // ✅ Reuse rule objects
   const cachedRule = { conditions: { /* ... */ } };
   
   // Use same rule object for multiple evaluations
   const results = await Promise.all([
     JsonRules.evaluate(cachedRule, data1),
     JsonRules.evaluate(cachedRule, data2),
     JsonRules.evaluate(cachedRule, data3)
   ]);
   ```

---

## 💪 TypeScript Excellence

JsonRules is built with TypeScript-first principles, providing exceptional developer experience:

### 🎯 Generic Type Safety

```typescript
// Define your data shape
interface UserProfile {
  age: number;
  email: string;
  preferences: {
    notifications: boolean;
    theme: "light" | "dark";
  };
}

// Define your result type
interface AccessResult {
  granted: boolean;
  level: "basic" | "premium" | "admin";
  expires?: Date;
}

// Create fully typed rule
const accessRule: Rule<UserProfile, AccessResult> = {
  conditions: {
    all: [
      { field: "age", operator: "is greater than or equal", value: 18 }, // ✅ Type-safe
      { field: "preferences.notifications", operator: "is equal", value: true } // ✅ Nested props
    ]
  }
};

// Evaluate with type safety
const result = await JsonRules.evaluate<AccessResult>(accessRule, userData);
// result is typed as AccessResult | boolean
```

### 🔧 Intelligent Autocompletion

```typescript
// Field names are autocompleted based on your data type
const rule: Rule<UserProfile> = {
  conditions: {
    all: [
      { 
        field: "preferences.", // 🎯 IDE shows: notifications, theme
        operator: "is equal",
        value: true
      }
    ]
  }
};

// Operators are validated based on field type
{ field: "age", operator: "is greater than", value: 18 } // ✅ Valid
{ field: "age", operator: "contains", value: "test" }    // ❌ Type error
```

### 🏗️ Builder Pattern with Types

```typescript
import { RuleBuilder } from "@ivandt/json-rules";

const typedRule = RuleBuilder
  .create<UserProfile, AccessResult>()
  .condition("all", [
    RuleBuilder.constraint("age", "is greater than or equal", 18),
    RuleBuilder.constraint("email", "ends with", "@company.com"),
    RuleBuilder.condition("any", [
      RuleBuilder.constraint("preferences.theme", "==", "dark"),
      RuleBuilder.constraint("preferences.notifications", "==", true)
    ])
  ])
  .defaultResult({ granted: false, level: "basic" })
  .build();
```

---

## 📈 Performance Benchmarks

JsonRules is engineered for production workloads:

| Scenario | Rules/Second | Latency (avg) | Memory Usage |
|----------|--------------|---------------|--------------|
| Simple boolean rules | 25,000+ | 0.04ms | < 1MB |
| Complex nested conditions | 12,000+ | 0.08ms | < 2MB |
| Large dataset (1000 items) | 500+ batches | 2ms | < 5MB |
| Real-world e-commerce rules | 8,000+ | 0.12ms | < 3MB |

**Benchmark Details:**
- Environment: Node.js 20, MacBook Pro M2
- Rule complexity: 3-8 conditions with mixed operators
- Data size: Typical business objects (50-200 properties)

---

## 🌟 Community & Support

### 📖 Additional Resources

- **[API Documentation](https://github.com/ivandt/json-rules/wiki)** - Complete API reference
- **[Examples Repository](https://github.com/ivandt/json-rules-examples)** - Real-world use cases
- **[Community Discussions](https://github.com/ivandt/json-rules/discussions)** - Questions & ideas

### 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with tests
4. **Run the test suite**: `npm run test`
5. **Submit a pull request**

### 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

JsonRules is built by developers, for developers. Thanks to our amazing community of contributors who make this project better every day.

---

<div align="center">

**Ready to simplify your business logic?**

⭐ **[Star us on GitHub](https://github.com/ivandt/json-rules)** if JsonRules helps your project!

</div>


