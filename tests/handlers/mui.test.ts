import { expect, test } from "@rstest/core";
import {
  getOptionLabel,
  isOptionEqualToValue,
  normalizeSelectedIds,
  resolveAutocompleteValue,
  resolveSelectValue,
  toChangeValue,
} from "../../src/components/mui/handlers";

const options = [
  { label: "User 1", value: 1 },
  { label: "User 15", value: 15 },
];

test("getOptionLabel returns label or stringified value", () => {
  expect(getOptionLabel({ label: "John", value: 1 })).toBe("John");
  expect(getOptionLabel({ value: 42 })).toBe("42");
});

test("isOptionEqualToValue compares by value with string coercion", () => {
  expect(isOptionEqualToValue({ value: 1 }, { value: 1 })).toBe(true);
  expect(isOptionEqualToValue({ value: "1" }, { value: 1 })).toBe(true);
});

test("resolveAutocompleteValue resolves single and multiple values", () => {
  expect(resolveAutocompleteValue(15, options, false)).toEqual({
    label: "User 15",
    value: 15,
  });

  expect(resolveAutocompleteValue([4, 15], options, true)).toEqual([
    { label: "4", value: 4 },
    { label: "User 15", value: 15 },
  ]);

  expect(resolveAutocompleteValue(null, options, false)).toBeNull();
  expect(resolveAutocompleteValue(undefined, options, true)).toEqual([]);
});

test("toChangeValue maps resolved options back to primitive values", () => {
  expect(
    toChangeValue(
      [
        { label: "User 1", value: 1 },
        { label: "User 15", value: 15 },
      ],
      true,
    ),
  ).toEqual([1, 15]);

  expect(toChangeValue({ label: "User 1", value: 1 }, false)).toBe(1);
  expect(toChangeValue(null, false)).toBeNull();
});

test("resolveSelectValue normalizes select value for single and multiple mode", () => {
  expect(resolveSelectValue(15, false)).toBe(15);
  expect(resolveSelectValue([4, 15], true)).toEqual([4, 15]);
  expect(resolveSelectValue(null, true)).toEqual([]);
  expect(resolveSelectValue(undefined, false)).toBe("");
});

test("normalizeSelectedIds extracts primitive ids from mixed selection", () => {
  expect(normalizeSelectedIds([1, { value: 2 }, "3"])).toEqual([1, 2, "3"]);
  expect(normalizeSelectedIds("not-array")).toEqual([]);
});
