import { createElement, type ReactNode } from "react";
import type { ResolvedOption } from "@/general-types";
import type { MuiDynamicSelectValue } from "./types";

function isSameOptionValue(a: unknown, b: unknown) {
  return a === b || String(a) === String(b);
}

export function getOptionLabel(option: ResolvedOption) {
  return option.label ?? String(option.value ?? "");
}

export function isOptionEqualToValue(
  option: ResolvedOption,
  value: ResolvedOption,
) {
  return isSameOptionValue(option.value, value.value);
}

function resolveSingleOption(
  value: string | number,
  options: ResolvedOption[],
): ResolvedOption {
  const matched = options.find((option) =>
    isSameOptionValue(option.value, value),
  );

  if (matched) {
    return matched;
  }

  return {
    label: String(value),
    value,
  };
}

export function resolveAutocompleteValue(
  value: MuiDynamicSelectValue | undefined,
  options: ResolvedOption[],
  multiple: boolean,
): ResolvedOption | ResolvedOption[] | null {
  if (value == null) {
    return multiple ? [] : null;
  }

  if (multiple) {
    const values = Array.isArray(value) ? value : [value];

    return values.map((item) => resolveSingleOption(item, options));
  }

  if (Array.isArray(value)) {
    const firstValue = value[0];

    return firstValue == null ? null : resolveSingleOption(firstValue, options);
  }

  return resolveSingleOption(value, options);
}

export function toChangeValue(
  value: ResolvedOption | ResolvedOption[] | null,
  multiple: boolean,
): MuiDynamicSelectValue {
  if (multiple) {
    const items = Array.isArray(value) ? value : [];

    return items
      .map((option) => option.value)
      .filter((item): item is string | number => item != null);
  }

  if (value == null || Array.isArray(value)) {
    return null;
  }

  return value.value ?? null;
}

export function resolveSelectValue(
  value: MuiDynamicSelectValue | undefined,
  multiple: boolean,
): string | number | Array<string | number> {
  if (multiple) {
    if (value == null) {
      return [];
    }

    return Array.isArray(value) ? value : [value];
  }

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export function formatSelectDisplayValue(
  selected: unknown,
  options: ResolvedOption[],
  placeholder?: string,
  multiple = false,
): ReactNode {
  if (multiple) {
    const values = Array.isArray(selected) ? selected : [];

    if (values.length === 0) {
      return placeholder ? createElement("em", null, placeholder) : "";
    }

    return values
      .map((item) => {
        const option = options.find((entry) => isSameOptionValue(entry.value, item));
        return option ? getOptionLabel(option) : String(item);
      })
      .join(", ");
  }

  if (selected === "" || selected == null) {
    return placeholder ? createElement("em", null, placeholder) : "";
  }

  const option = options.find((entry) =>
    isSameOptionValue(entry.value, selected),
  );

  return option ? getOptionLabel(option) : String(selected);
}
