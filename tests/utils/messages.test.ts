import { expect, test } from "@rstest/core";
import {
  DEFAULT_SELECT_MESSAGES,
  resolveSelectEmptyMessage,
  resolveSelectLoadingMessage,
  resolveSelectNoOptionsMessage,
} from "../../src/lib/utils/messages";

test("resolveSelectLoadingMessage returns loading text when fetching an empty list", () => {
  expect(
    resolveSelectLoadingMessage(undefined, {
      loading: true,
      hasOptions: false,
    }),
  ).toBe(DEFAULT_SELECT_MESSAGES.loading);

  expect(
    resolveSelectLoadingMessage(
      { loading: "Đang tải..." },
      { loading: true, hasOptions: false },
    ),
  ).toBe("Đang tải...");
});

test("resolveSelectLoadingMessage returns null when options exist or not loading", () => {
  expect(
    resolveSelectLoadingMessage(undefined, {
      loading: true,
      hasOptions: true,
    }),
  ).toBeNull();

  expect(
    resolveSelectLoadingMessage(undefined, {
      loading: false,
      hasOptions: false,
    }),
  ).toBeNull();
});

test("resolveSelectEmptyMessage distinguishes empty list vs no search results", () => {
  expect(
    resolveSelectEmptyMessage(undefined, {
      loading: false,
      hasOptions: false,
      searchValue: "",
    }),
  ).toBe(DEFAULT_SELECT_MESSAGES.empty);

  expect(
    resolveSelectEmptyMessage(undefined, {
      loading: false,
      hasOptions: false,
      searchValue: "john",
    }),
  ).toBe(DEFAULT_SELECT_MESSAGES.noResults);
});

test("resolveSelectNoOptionsMessage mirrors empty vs no-results behavior", () => {
  expect(resolveSelectNoOptionsMessage(undefined, "")).toBe(
    DEFAULT_SELECT_MESSAGES.empty,
  );

  expect(resolveSelectNoOptionsMessage(undefined, "john")).toBe(
    DEFAULT_SELECT_MESSAGES.noResults,
  );
});

test("resolveSelectEmptyMessage respects explicit null to hide the message", () => {
  expect(
    resolveSelectEmptyMessage(
      { empty: null, noResults: null },
      {
        loading: false,
        hasOptions: false,
        searchValue: "john",
      },
    ),
  ).toBeNull();
});
