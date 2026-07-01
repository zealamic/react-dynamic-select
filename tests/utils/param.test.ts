import { expect, test } from "@rstest/core";
import {
  getInitialPagination,
  getNextPagePagination,
} from "../../src/lib/utils/param";

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
