import { expect, test } from "@rstest/core";
import {
  shouldShowListFooter,
  shouldShowLoadMoreStatusChip,
  shouldShowTotalLabel,
} from "../../src/lib/utils/total";

test("shouldShowTotalLabel is true when path or label is set", () => {
  expect(shouldShowTotalLabel({ path: "total" })).toBe(true);
  expect(shouldShowTotalLabel({ label: "Total" })).toBe(true);
});

test("shouldShowTotalLabel is false when hidden is true", () => {
  expect(shouldShowTotalLabel({ path: "total", hidden: true })).toBe(false);
  expect(shouldShowTotalLabel({ label: "Total", hidden: true })).toBe(false);
});

test("shouldShowTotalLabel is false when total is empty", () => {
  expect(shouldShowTotalLabel()).toBe(false);
  expect(shouldShowTotalLabel({})).toBe(false);
});

test("shouldShowListFooter is false when isMenuFooterVisible is false", () => {
  expect(
    shouldShowListFooter({
      isMenuFooterVisible: false,
      loadMoreConfig: { type: "click" },
      total: { path: "total" },
      add: { placement: "start" },
    }),
  ).toBe(false);
});

test("shouldShowListFooter defaults to visible when content exists", () => {
  expect(
    shouldShowListFooter({
      loadMoreConfig: { type: "click" },
    }),
  ).toBe(true);
});

test("shouldShowLoadMoreStatusChip is true only while load more runs with a hidden footer", () => {
  expect(
    shouldShowLoadMoreStatusChip({
      isMenuFooterVisible: false,
      isLoadingMore: true,
    }),
  ).toBe(true);

  expect(
    shouldShowLoadMoreStatusChip({
      isMenuFooterVisible: true,
      isLoadingMore: true,
    }),
  ).toBe(false);

  expect(
    shouldShowLoadMoreStatusChip({
      isMenuFooterVisible: false,
      isLoadingMore: false,
    }),
  ).toBe(false);
});
