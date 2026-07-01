import { expect, test } from "@rstest/core";
import { LOAD_MORE_TYPE } from "../../src/lib/constants";
import {
  hasMoreToLoad,
  resolveLoadMoreConfig,
} from "../../src/lib/utils/load-more";

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
