import type { ResolvedOption } from "@/general-types";
import {
  getOptionLabelNode,
  getOptionLabelText,
  hasCustomOptionLabel,
} from "@/lib/utils/option-label";
import type { ChakraDynamicSelectValue } from "../types";

function isSameOptionValue(a: unknown, b: unknown) {
  return a === b || String(a) === String(b);
}

export function getOptionLabel(option: ResolvedOption) {
  return getOptionLabelText(option);
}

export { getOptionLabelNode, hasCustomOptionLabel };

export function toComboboxValues(
  value: ChakraDynamicSelectValue | undefined,
): string[] {
  if (value == null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  return [String(value)];
}

function resolveValueFromString(
  value: string,
  options: ResolvedOption[],
): string | number {
  const matched = options.find((option) =>
    isSameOptionValue(option.value, value),
  );

  if (matched?.value != null) {
    return matched.value;
  }

  const numericValue = Number(value);

  if (!Number.isNaN(numericValue) && String(numericValue) === value) {
    return numericValue;
  }

  return value;
}

export function fromComboboxValues(
  values: string[],
  options: ResolvedOption[],
  multiple: boolean,
): ChakraDynamicSelectValue {
  if (multiple) {
    return values
      .map((value) => resolveValueFromString(value, options))
      .filter((item): item is string | number => item != null);
  }

  if (values.length === 0) {
    return null;
  }

  return resolveValueFromString(values[0], options);
}
