import { expect, test } from "@rstest/core";
import {
  DYNAMIC_SELECT_POPUP_ATTR,
  isOutsideDynamicSelectInteraction,
  shouldKeepMenuOpenOnSearchBlur,
} from "../../src/components/mui/partials/autocomplete-popup-section";

test("shouldKeepMenuOpenOnSearchBlur keeps popup open only for in-popup focus moves", () => {
  const popup = document.createElement("div");
  popup.setAttribute(DYNAMIC_SELECT_POPUP_ATTR, "");
  const searchInput = document.createElement("input");
  const outsideButton = document.createElement("button");
  popup.append(searchInput);

  expect(shouldKeepMenuOpenOnSearchBlur(null)).toBe(false);
  expect(shouldKeepMenuOpenOnSearchBlur(outsideButton)).toBe(false);
  expect(shouldKeepMenuOpenOnSearchBlur(searchInput)).toBe(true);
});

test("isOutsideDynamicSelectInteraction detects clicks outside root and popup", () => {
  const root = document.createElement("div");
  const trigger = document.createElement("input");
  const popup = document.createElement("div");
  popup.setAttribute(DYNAMIC_SELECT_POPUP_ATTR, "");
  const searchInput = document.createElement("input");
  const outsideButton = document.createElement("button");

  root.append(trigger);
  popup.append(searchInput);
  document.body.append(root, popup, outsideButton);

  expect(isOutsideDynamicSelectInteraction(trigger, root)).toBe(false);
  expect(isOutsideDynamicSelectInteraction(searchInput, root)).toBe(false);
  expect(isOutsideDynamicSelectInteraction(outsideButton, root)).toBe(true);

  outsideButton.remove();
  popup.remove();
  root.remove();
});
