import { expect, test } from "@rstest/core";
import { isSelectSearchDisabled } from "../../src/lib/utils/search";

test("isSelectSearchDisabled is true while load more is in progress", () => {
  expect(isSelectSearchDisabled({ isLoadingMore: true })).toBe(true);
});

test("isSelectSearchDisabled is true while the initial fetch is loading", () => {
  expect(isSelectSearchDisabled({ loading: true })).toBe(true);
});

test("isSelectSearchDisabled respects an explicit disabled flag", () => {
  expect(isSelectSearchDisabled({ disabled: true })).toBe(true);
});

test("isSelectSearchDisabled is false when search can accept input", () => {
  expect(isSelectSearchDisabled()).toBe(false);
  expect(
    isSelectSearchDisabled({
      disabled: false,
      loading: false,
      isLoadingMore: false,
    }),
  ).toBe(false);
});
