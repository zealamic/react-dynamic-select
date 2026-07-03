import { expect, test } from "@rstest/core";
import { createElement } from "react";
import {
  mergeOptionsWithCurrent,
  normalizeSelectValues,
  resolveCurrentOptions,
  resolveOptionFromTemplate,
} from "../../src/lib/utils/data";

test("normalizeSelectValues handles single mode", () => {
  expect(normalizeSelectValues(4)).toEqual([4]);
  expect(normalizeSelectValues(undefined)).toEqual([]);
});

test("normalizeSelectValues handles multiple mode", () => {
  expect(
    normalizeSelectValues([1, 2, 3], {
      mode: "multiple",
    }),
  ).toEqual([1, 2, 3]);
});

test("normalizeSelectValues handles labelInValue", () => {
  expect(
    normalizeSelectValues(
      { value: 4, label: "Jill Doe" },
      {
        labelInValue: true,
      },
    ),
  ).toEqual([4]);
});

test("mergeOptionsWithCurrent injects selected current option before fetch", () => {
  const merged = mergeOptionsWithCurrent({
    fetchedOptions: [{ label: "User 1", value: 1 }],
    currentOptions: [{ label: "User 15", value: 15 }],
    selectedValues: [15],
  });

  expect(merged).toEqual([
    { label: "User 15", value: 15 },
    { label: "User 1", value: 1 },
  ]);
});

test("mergeOptionsWithCurrent deduplicates when fetched list contains value", () => {
  const merged = mergeOptionsWithCurrent({
    fetchedOptions: [{ label: "User 4", value: 4 }],
    currentOptions: [{ label: "Jill Doe", value: 4 }],
    selectedValues: [4],
  });

  expect(merged).toEqual([{ label: "Jill Doe", value: 4 }]);
});

test("resolveCurrentOptions supports single object and array", () => {
  const config = {
    currentData: { id: 4, name: "Jill Doe" },
    option: {
      template: {
        label: "name",
        value: "id",
      },
    },
  };

  // @ts-expect-error minimal config for unit test
  expect(resolveCurrentOptions(config)).toEqual([
    { label: "Jill Doe", value: 4 },
  ]);

  expect(
    // @ts-expect-error minimal config for unit test
    resolveCurrentOptions({
      ...config,
      currentData: [
        { id: 4, name: "Jill Doe" },
        { id: 15, name: "Emma Johnson" },
      ],
    }),
  ).toEqual([
    { label: "Jill Doe", value: 4 },
    { label: "Emma Johnson", value: 15 },
  ]);
});

test("resolveOptionFromTemplate supports React component labels", () => {
  const Label = ({ data }: { data: { name: string } }) =>
    createElement("span", null, data.name);

  const option = resolveOptionFromTemplate({
    template: {
      label: Label,
      value: "id",
    },
    data: { id: 4, name: "Jill Doe" },
  });

  expect(option.value).toBe(4);
  expect(option.label).toEqual(
    // @ts-expect-error minimal config for unit test
    createElement(Label, { data: { id: 4, name: "Jill Doe" } }),
  );
});
