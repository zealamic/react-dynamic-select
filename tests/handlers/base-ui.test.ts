import { expect, test } from "@rstest/core";
import {
  getOptionLabel,
  isOptionEqualToValue,
  itemToStringLabel,
  itemToStringValue,
} from "../../src/components/base-ui/handlers";

test("getOptionLabel returns label or stringified value", () => {
  expect(getOptionLabel({ label: "John", value: 1 })).toBe("John");
  expect(getOptionLabel({ value: 42 })).toBe("42");
  expect(getOptionLabel({ label: "", value: null })).toBe("");
});

test("isOptionEqualToValue compares by value with string coercion", () => {
  expect(isOptionEqualToValue({ value: 1 }, { value: 1 })).toBe(true);
  expect(isOptionEqualToValue({ value: "1" }, { value: 1 })).toBe(true);
  expect(isOptionEqualToValue({ value: 1 }, { value: 2 })).toBe(false);
});

test("itemToStringLabel mirrors getOptionLabel", () => {
  expect(itemToStringLabel({ label: "Jane", value: 2 })).toBe("Jane");
});

test("itemToStringValue stringifies value or returns empty string", () => {
  expect(itemToStringValue({ value: 7 })).toBe("7");
  expect(itemToStringValue({ value: null })).toBe("");
  expect(itemToStringValue({ value: undefined })).toBe("");
});
