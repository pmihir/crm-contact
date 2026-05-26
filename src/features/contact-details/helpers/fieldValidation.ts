import type { ContactFieldValue, FieldType, FieldValidationResult } from "../types";

function asText(value: ContactFieldValue) {
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

export function parseEditableFieldValue(type: FieldType, value: string): ContactFieldValue {
  if (type === "multi-select") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return value.trim();
}

export function formatEditableFieldValue(value: ContactFieldValue) {
  return asText(value);
}

export function validateEditableFieldValue(type: FieldType, value: ContactFieldValue): FieldValidationResult {
  const textValue = asText(value).trim();

  if (!textValue) {
    return { isValid: true };
  }

  switch (type) {
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textValue)
        ? { isValid: true }
        : { isValid: false, message: "Enter a valid email address." };

    case "phone":
      return /^[+()\-\s\d]{7,}$/.test(textValue)
        ? { isValid: true }
        : { isValid: false, message: "Enter a valid phone number." };

    case "url":
      try {
        const url = new URL(textValue);
        return url.protocol === "http:" || url.protocol === "https:"
          ? { isValid: true }
          : { isValid: false, message: "Use an http or https URL." };
      } catch {
        return { isValid: false, message: "Enter a valid URL." };
      }

    case "date":
      return Number.isNaN(new Date(textValue).getTime())
        ? { isValid: false, message: "Enter a valid date." }
        : { isValid: true };

    default:
      return { isValid: true };
  }
}
