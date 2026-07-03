import { expect, test } from "@rstest/core";
import { createElement } from "react";
import {
  getOptionLabelNode,
  getOptionLabelText,
  hasCustomOptionLabel,
} from "../../src/lib/utils/option-label";

test("getOptionLabelText returns string labels and falls back to value", () => {
  expect(getOptionLabelText({ label: "John", value: 1 })).toBe("John");
  expect(getOptionLabelText({ value: 42 })).toBe("42");
});

test("getOptionLabelNode returns ReactNode labels", () => {
  const label = createElement("span", null, "Custom");

  expect(getOptionLabelNode({ label, value: 1 })).toBe(label);
  expect(getOptionLabelNode({ label: "Plain", value: 1 })).toBe("Plain");
});

test("hasCustomOptionLabel detects non-string labels", () => {
  const label = createElement("span", null, "Custom");

  expect(hasCustomOptionLabel({ label, value: 1 })).toBe(true);
  expect(hasCustomOptionLabel({ label: "Plain", value: 1 })).toBe(false);
});
