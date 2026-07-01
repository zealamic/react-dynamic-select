import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { createElement, type ReactNode, type SyntheticEvent } from "react";
import type { ResolvedOption } from "@/general-types";
import type { MuiDynamicSelectValue } from "../types";

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

export function normalizeSelectedIds(
  selected: unknown,
): Array<string | number> {
  if (!Array.isArray(selected)) {
    return [];
  }

  return selected
    .map((item) => {
      if (
        typeof item === "object" &&
        item !== null &&
        "value" in item &&
        (typeof item.value === "string" || typeof item.value === "number")
      ) {
        return item.value;
      }

      if (typeof item === "string" || typeof item === "number") {
        return item;
      }

      return null;
    })
    .filter((item): item is string | number => item != null);
}

export function renderMultipleValueChips(
  selected: unknown,
  options: ResolvedOption[],
  placeholder?: string,
  onRemoveItem?: (item: string | number) => (event: SyntheticEvent) => void,
): ReactNode {
  const values = normalizeSelectedIds(selected);

  if (values.length === 0) {
    return placeholder ? createElement("em", null, placeholder) : "";
  }

  return createElement(
    Box,
    {
      sx: {
        display: "flex",
        flexWrap: "wrap",
        gap: 0.5,
        py: 0.25,
      },
    },
    values.map((item) => {
      const option = options.find((entry) =>
        isSameOptionValue(entry.value, item),
      );
      const label = option ? getOptionLabel(option) : String(item);
      const handleRemove = onRemoveItem?.(item);

      return createElement(Chip, {
        key: String(item),
        size: "small",
        label,
        onDelete: handleRemove,
        onMouseDown: handleRemove
          ? (event: SyntheticEvent) => {
              event.stopPropagation();
            }
          : undefined,
      });
    }),
  );
}

export function formatSelectDisplayValue(
  selected: unknown,
  options: ResolvedOption[],
  placeholder?: string,
  multiple = false,
  onRemoveItem?: (item: string | number) => (event: SyntheticEvent) => void,
): ReactNode {
  if (multiple) {
    return renderMultipleValueChips(
      selected,
      options,
      placeholder,
      onRemoveItem,
    );
  }

  if (selected === "" || selected == null) {
    return placeholder ? createElement("em", null, placeholder) : "";
  }

  const option = options.find((entry) =>
    isSameOptionValue(entry.value, selected),
  );

  return option ? getOptionLabel(option) : String(selected);
}
