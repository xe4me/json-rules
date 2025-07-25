import "../src/validators/phone/us";
import "../src/validators/phone/gb";
import "../src/validators/phone/de";
import { Rule, JsonRules } from "../src";

describe("Advanced Validators", () => {
  describe("Email Validation", () => {
    it("should validate basic email addresses", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "email", operator: "is valid email", value: null }],
        },
      };

      expect(
        await JsonRules.evaluate(rule, { email: "test@example.com" })
      ).toBe(true);
      expect(
        await JsonRules.evaluate(rule, { email: "user.name+tag@domain.co.uk" })
      ).toBe(true);
      expect(await JsonRules.evaluate(rule, { email: "invalid-email" })).toBe(
        false
      );
      expect(await JsonRules.evaluate(rule, { email: "@domain.com" })).toBe(
        false
      );
      expect(await JsonRules.evaluate(rule, { email: "test@" })).toBe(false);
    });

    it("should validate emails with configuration", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "email",
              operator: "is valid email",
              value: {
                requireTld: true,
                allowDisplayName: false,
                hostBlacklist: ["tempmail.com", "10minutemail.com"],
              },
            },
          ],
        },
      };

      expect(
        await JsonRules.evaluate(rule, { email: "test@example.com" })
      ).toBe(true);
      expect(
        await JsonRules.evaluate(rule, { email: "test@tempmail.com" })
      ).toBe(false);
      expect(
        await JsonRules.evaluate(rule, { email: "Name <test@example.com>" })
      ).toBe(false);
    });

    it("should validate emails with whitelist", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "email",
              operator: "is valid email",
              value: {
                hostWhitelist: ["company.com", "partner.org"],
              },
            },
          ],
        },
      };

      expect(
        await JsonRules.evaluate(rule, { email: "user@company.com" })
      ).toBe(true);
      expect(
        await JsonRules.evaluate(rule, { email: "user@partner.org" })
      ).toBe(true);
      expect(
        await JsonRules.evaluate(rule, { email: "user@external.com" })
      ).toBe(false);
    });

    it("should handle non-string values", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "email", operator: "is valid email", value: null }],
        },
      };

      expect(await JsonRules.evaluate(rule, { email: 12345 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { email: null })).toBe(false);
      expect(await JsonRules.evaluate(rule, { email: undefined })).toBe(false);
      expect(await JsonRules.evaluate(rule, { email: {} })).toBe(false);
    });
  });

  describe("Phone Validation", () => {
    it("should validate US phone numbers", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "phone",
              operator: "is valid phone",
              value: { locale: "us" },
            },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { phone: "+1 202 456 1111" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { phone: "(202) 456-1111" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { phone: "202-456-1111" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { phone: "2024561111" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { phone: "123-456" })).toBe(false);
      expect(await JsonRules.evaluate(rule, { phone: "invalid" })).toBe(false);
    });

    it("should validate GB phone numbers", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "phone",
              operator: "is valid phone",
              value: { locale: "gb" },
            },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { phone: "+44 7700 900123" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { phone: "07700 900123" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { phone: "+1 202 456 1111" })).toBe(
        false
      );
    });

    it("should validate German phone numbers", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "phone",
              operator: "is valid phone",
              value: { locale: "de" },
            },
          ],
        },
      };

      expect(
        await JsonRules.evaluate(rule, { phone: "+49 151 12345678" })
      ).toBe(true);
      expect(await JsonRules.evaluate(rule, { phone: "0151 12345678" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { phone: "+1 202 456 1111" })).toBe(
        false
      );
    });

    it("should throw error for unregistered locale", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "phone",
              operator: "is valid phone",
              value: { locale: "fr" },
            },
          ],
        },
      };

      await expect(
        JsonRules.evaluate(rule, { phone: "+33 123456789" })
      ).rejects.toThrow("Phone locale 'fr' not registered");
    });

    it("should validate with strict mode", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "phone",
              operator: "is valid phone",
              value: { locale: "us", strict: true },
            },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { phone: "+1 202 456 1111" })).toBe(
        true
      );
      // Note: strict mode validation depends on validator.js implementation
    });

    it("should handle non-string values", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "phone",
              operator: "is valid phone",
              value: { locale: "us" },
            },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { phone: 5551234567 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { phone: null })).toBe(false);
      expect(await JsonRules.evaluate(rule, { phone: undefined })).toBe(false);
    });
  });

  describe("URL Validation", () => {
    it("should validate basic URLs", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "url", operator: "is URL", value: { requireTld: false } },
          ],
        },
      };

      expect(
        await JsonRules.evaluate(rule, { url: "https://www.example.com" })
      ).toBe(true);
      expect(
        await JsonRules.evaluate(rule, { url: "http://localhost:3000" })
      ).toBe(true);
      expect(
        await JsonRules.evaluate(rule, { url: "ftp://files.example.com" })
      ).toBe(true);
      expect(await JsonRules.evaluate(rule, { url: "invalid-url" })).toBe(
        false
      );
      expect(await JsonRules.evaluate(rule, { url: "just-text" })).toBe(false);
    });

    it("should validate URLs with protocol restrictions", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "url",
              operator: "is URL",
              value: {
                protocols: ["https"],
                requireProtocol: true,
              },
            },
          ],
        },
      };

      expect(
        await JsonRules.evaluate(rule, { url: "https://example.com" })
      ).toBe(true);
      expect(
        await JsonRules.evaluate(rule, { url: "http://example.com" })
      ).toBe(false);
      expect(await JsonRules.evaluate(rule, { url: "ftp://example.com" })).toBe(
        false
      );
    });

    it("should handle non-string values", async () => {
      const rule: Rule = {
        conditions: { all: [{ field: "url", operator: "is URL", value: {} }] },
      };

      expect(await JsonRules.evaluate(rule, { url: 12345 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { url: null })).toBe(false);
      expect(await JsonRules.evaluate(rule, { url: {} })).toBe(false);
    });
  });

  describe("UUID Validation", () => {
    it("should validate UUIDs", async () => {
      const rule: Rule = {
        conditions: { all: [{ field: "id", operator: "is UUID", value: {} }] },
      };

      expect(
        await JsonRules.evaluate(rule, {
          id: "550e8400-e29b-41d4-a716-446655440000",
        })
      ).toBe(true);
      expect(
        await JsonRules.evaluate(rule, {
          id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        })
      ).toBe(true);
      expect(await JsonRules.evaluate(rule, { id: "invalid-uuid" })).toBe(
        false
      );
      expect(
        await JsonRules.evaluate(rule, { id: "550e8400-e29b-41d4-a716" })
      ).toBe(false);
    });

    it("should validate specific UUID versions", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "id",
              operator: "is UUID",
              value: { version: 4 },
            },
          ],
        },
      };

      expect(
        await JsonRules.evaluate(rule, {
          id: "550e8400-e29b-41d4-a716-446655440000",
        })
      ).toBe(true);
      // Note: Specific version validation depends on the actual UUID format
    });

    it("should handle non-string values", async () => {
      const rule: Rule = {
        conditions: { all: [{ field: "id", operator: "is UUID", value: {} }] },
      };

      expect(await JsonRules.evaluate(rule, { id: 12345 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { id: null })).toBe(false);
    });
  });

  describe("EAN Validation", () => {
    it("should validate EAN codes", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "barcode", operator: "is EAN", value: null }],
        },
      };

      expect(await JsonRules.evaluate(rule, { barcode: "4006381333931" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { barcode: "9780471117094" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { barcode: "1234567890123" })).toBe(
        false
      );
      expect(await JsonRules.evaluate(rule, { barcode: "invalid-ean" })).toBe(
        false
      );
    });

    it("should handle non-string values", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "barcode", operator: "is EAN", value: null }],
        },
      };

      expect(await JsonRules.evaluate(rule, { barcode: 4006381333931 })).toBe(
        false
      );
      expect(await JsonRules.evaluate(rule, { barcode: null })).toBe(false);
    });
  });

  describe("IMEI Validation", () => {
    it("should validate IMEI numbers", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "imei", operator: "is IMEI", value: {} }],
        },
      };

      expect(await JsonRules.evaluate(rule, { imei: "352099001761481" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { imei: "356938035643809" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { imei: "123456789012345" })).toBe(
        false
      );
      expect(await JsonRules.evaluate(rule, { imei: "invalid-imei" })).toBe(
        false
      );
    });

    it("should validate IMEI with hyphens", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "imei",
              operator: "is IMEI",
              value: { allowHyphens: true },
            },
          ],
        },
      };

      expect(
        await JsonRules.evaluate(rule, { imei: "35-209900-176148-1" })
      ).toBe(true);
      expect(await JsonRules.evaluate(rule, { imei: "352099001761481" })).toBe(
        true
      );
    });
  });

  describe("Unit Validation", () => {
    it("should validate length units", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "distance", operator: "is unit", value: "length" }],
        },
      };

      expect(await JsonRules.evaluate(rule, { distance: "5km" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { distance: "10 meters" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { distance: "3.5 ft" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { distance: "100cm" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { distance: "5 seconds" })).toBe(
        false
      );
      expect(await JsonRules.evaluate(rule, { distance: "invalid" })).toBe(
        false
      );
    });

    it("should validate mass units", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "weight", operator: "is unit", value: "mass" }],
        },
      };

      expect(await JsonRules.evaluate(rule, { weight: "70kg" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { weight: "150 lbs" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { weight: "2.5 tons" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { weight: "5 meters" })).toBe(
        false
      );
    });

    it("should validate temperature units", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "temp", operator: "is unit", value: "temperature" }],
        },
      };

      expect(await JsonRules.evaluate(rule, { temp: "23.5°C" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { temp: "75°F" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { temp: "298K" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { temp: "23 celsius" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { temp: "100 meters" })).toBe(
        false
      );
    });

    it("should validate time units", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "duration", operator: "is unit", value: "time" }],
        },
      };

      expect(await JsonRules.evaluate(rule, { duration: "30s" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { duration: "5 minutes" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { duration: "2.5 hours" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { duration: "1 day" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { duration: "10 kg" })).toBe(false);
    });

    it("should handle scientific notation and decimals", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "distance", operator: "is unit", value: "length" }],
        },
      };

      expect(await JsonRules.evaluate(rule, { distance: "1.5e3m" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { distance: "-5.5km" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { distance: "0.001 mm" })).toBe(
        true
      );
    });

    it("should handle non-string values", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "distance", operator: "is unit", value: "length" }],
        },
      };

      expect(await JsonRules.evaluate(rule, { distance: 5 })).toBe(false);
      expect(await JsonRules.evaluate(rule, { distance: null })).toBe(false);
      expect(await JsonRules.evaluate(rule, { distance: {} })).toBe(false);
    });
  });

  describe("Country Validation", () => {
    it("should validate ISO2 country codes", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "country",
              operator: "is country",
              value: { format: "iso2" },
            },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { country: "US" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { country: "GB" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { country: "DE" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { country: "USA" })).toBe(false);
      expect(await JsonRules.evaluate(rule, { country: "XX" })).toBe(false);
    });

    it("should validate ISO3 country codes", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "country",
              operator: "is country",
              value: { format: "iso3" },
            },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { country: "USA" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { country: "GBR" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { country: "DEU" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { country: "US" })).toBe(false);
      expect(await JsonRules.evaluate(rule, { country: "XXX" })).toBe(false);
    });

    it("should validate country names", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "country",
              operator: "is country",
              value: { format: "name" },
            },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { country: "United States" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { country: "Germany" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { country: "Japan" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { country: "US" })).toBe(false);
      expect(
        await JsonRules.evaluate(rule, { country: "Invalid Country" })
      ).toBe(false);
    });

    it("should handle case insensitive country names", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "country",
              operator: "is country",
              value: { format: "name" },
            },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { country: "united states" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { country: "GERMANY" })).toBe(true);
      expect(await JsonRules.evaluate(rule, { country: "JaPaN" })).toBe(true);
    });
  });

  describe("Domain Validation", () => {
    it("should validate domain names", async () => {
      const rule: Rule = {
        conditions: {
          all: [{ field: "domain", operator: "is domain", value: {} }],
        },
      };

      expect(await JsonRules.evaluate(rule, { domain: "example.com" })).toBe(
        true
      );
      expect(
        await JsonRules.evaluate(rule, { domain: "subdomain.example.org" })
      ).toBe(true);
      expect(
        await JsonRules.evaluate(rule, { domain: "api.service.company.co.uk" })
      ).toBe(true);
      expect(await JsonRules.evaluate(rule, { domain: "invalid_domain" })).toBe(
        false
      );
      expect(await JsonRules.evaluate(rule, { domain: ".invalid" })).toBe(
        false
      );
    });

    it("should validate domains with configuration", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            {
              field: "domain",
              operator: "is domain",
              value: {
                requireTld: true,
                allowUnderscores: false,
              },
            },
          ],
        },
      };

      expect(await JsonRules.evaluate(rule, { domain: "example.com" })).toBe(
        true
      );
      expect(await JsonRules.evaluate(rule, { domain: "localhost" })).toBe(
        false
      );
      expect(
        await JsonRules.evaluate(rule, { domain: "under_score.com" })
      ).toBe(false);
    });
  });

  describe("Complex Rules with Advanced Validators", () => {
    it("should handle multiple advanced validators in one rule", async () => {
      const rule: Rule = {
        conditions: {
          all: [
            { field: "email", operator: "is valid email", value: null },
            {
              field: "phone",
              operator: "is valid phone",
              value: { locale: "us" },
            },
            {
              field: "website",
              operator: "is URL",
              value: { protocols: ["https"] },
            },
            { field: "distance", operator: "is unit", value: "length" },
          ],
        },
      };

      expect(
        await JsonRules.evaluate(rule, {
          email: "user@example.com",
          phone: "+1 202 456 1111",
          website: "https://example.com",
          distance: "5km",
        })
      ).toBe(true);

      expect(
        await JsonRules.evaluate(rule, {
          email: "invalid-email",
          phone: "+1 202 456 1111",
          website: "https://example.com",
          distance: "5km",
        })
      ).toBe(false);
    });
  });
});
