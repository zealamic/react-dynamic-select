import type { ResolvedOption } from "@/general-types";

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

export function itemToStringLabel(option: ResolvedOption) {
  return getOptionLabel(option);
}

export function itemToStringValue(option: ResolvedOption) {
  if (option.value == null) {
    return "";
  }

  return String(option.value);
}
