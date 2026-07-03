import type { ResolvedOption } from "@/general-types";
import {
  getOptionLabelNode,
  getOptionLabelText,
} from "@/lib/utils/option-label";

function isSameOptionValue(a: unknown, b: unknown) {
  return a === b || String(a) === String(b);
}

export function getOptionLabel(option: ResolvedOption) {
  return getOptionLabelText(option);
}

export { getOptionLabelNode };

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
