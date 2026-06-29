import { expect, test } from "@rstest/core";
import { LOAD_MORE_TYPE } from "../src/lib/constants";
import {
  getInitialPagination,
  getNextPagePagination,
  hasMoreToLoad,
  resolveLoadMoreConfig,
} from "../src/lib/utils";

test("getInitialPagination preserves pageSize key", () => {
  expect(getInitialPagination({ page: 2, pageSize: 20 })).toEqual({
    page: 2,
    pageSize: 20,
  });
});

test("getInitialPagination preserves limit key", () => {
  expect(getInitialPagination({ page: 1, limit: 15 })).toEqual({
    page: 1,
    limit: 15,
  });
});

test("getNextPagePagination increments page while keeping pageSize", () => {
  expect(getNextPagePagination({ page: 1, pageSize: 10 })).toEqual({
    page: 2,
    pageSize: 10,
  });
});

test("resolveLoadMoreConfig treats boolean true as click load more", () => {
  expect(resolveLoadMoreConfig(true)).toEqual({
    type: LOAD_MORE_TYPE.CLICK,
  });
});

test("hasMoreToLoad returns false when all items are loaded", () => {
  expect(hasMoreToLoad(10, 10)).toBe(false);
  expect(hasMoreToLoad(5, 10)).toBe(true);
  expect(hasMoreToLoad(0, 0)).toBe(false);
});
