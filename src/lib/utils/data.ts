import type {
  DynamicSelectConfig,
  OptionTemplate,
  ResolvedOption,
} from "@/general-types";
import { INVALID_VALUE, PLACEHOLDER_PATTERN } from "@/lib/constants";

type NormalizeSelectValuesOptions = {
  mode?: "multiple" | "tags";
  labelInValue?: boolean;
};

function resolvePath(data: Record<string, unknown>, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = data;

  for (const key of keys) {
    if (current == null || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string, unknown>)[key];
  }

  return current;
}

function formatResolvedValue(value: unknown): string {
  if (value === undefined || value === null) {
    return INVALID_VALUE;
  }

  return String(value);
}

function resolveLabelTemplate({
  template,
  data,
}: {
  template: string | null | undefined;
  data: Record<string, unknown>;
}): string {
  if (template == null || template === "") {
    return INVALID_VALUE;
  }

  if (template.includes("{")) {
    return template.replace(PLACEHOLDER_PATTERN, (_, path: string) =>
      formatResolvedValue(resolvePath(data, path.trim())),
    );
  }

  return formatResolvedValue(resolvePath(data, template));
}

export function resolveDataFromTemplate({
  template,
  data,
}: {
  template: string | null | undefined;
  data: Record<string, unknown>;
}): unknown {
  if (template == null || template === "") {
    return undefined;
  }

  if (template.includes("{")) {
    const singlePlaceholderMatch = template.match(/^\{([^}]+)\}$/);

    if (singlePlaceholderMatch) {
      return resolvePath(data, singlePlaceholderMatch[1].trim());
    }

    return template.replace(PLACEHOLDER_PATTERN, (_, path: string) =>
      formatResolvedValue(resolvePath(data, path.trim())),
    );
  }

  return resolvePath(data, template);
}

export function resolveOptionFromTemplate({
  template,
  data,
}: {
  template: OptionTemplate;
  data: Record<string, unknown>;
}): ResolvedOption {
  const { label, value } = template;

  return {
    label: resolveLabelTemplate({ template: label, data }),
    value: resolveDataFromTemplate({
      template: value,
      data,
    }) as ResolvedOption["value"],
  };
}

function extractRawValue(
  item: unknown,
  labelInValue?: boolean,
): string | number | null | undefined {
  if (
    labelInValue &&
    item != null &&
    typeof item === "object" &&
    "value" in item
  ) {
    return (item as { value: string | number }).value;
  }

  if (typeof item === "string" || typeof item === "number") {
    return item;
  }

  return undefined;
}

export function normalizeSelectValues(
  selectValue: unknown,
  { mode, labelInValue }: NormalizeSelectValuesOptions = {},
): Array<string | number> {
  if (selectValue == null) {
    return [];
  }

  const isMultiple = mode === "multiple" || mode === "tags";

  if (isMultiple) {
    const values = Array.isArray(selectValue) ? selectValue : [selectValue];

    return values
      .map((item) => extractRawValue(item, labelInValue))
      .filter((value): value is string | number => value != null);
  }

  const value = extractRawValue(selectValue, labelInValue);
  return value != null ? [value] : [];
}

export function resolveCurrentOptions<DataType, ApiResponse, ApiParams>(
  dynamicConfig: DynamicSelectConfig<DataType, ApiResponse, ApiParams>,
): ResolvedOption[] {
  const { currentData, option } = dynamicConfig;

  if (!currentData) {
    return [];
  }

  const template = option?.template;
  if (!template) {
    return [];
  }

  const items = (
    Array.isArray(currentData) ? currentData : [currentData]
  ) as DataType[];

  return items.map((item) =>
    resolveOptionFromTemplate({
      template,
      data: item as Record<string, unknown>,
    }),
  );
}

function isSameOptionValue(a: unknown, b: unknown) {
  return a === b || String(a) === String(b);
}

export function mergeOptionsWithCurrent({
  fetchedOptions,
  currentOptions,
  selectedValues,
}: {
  fetchedOptions: ResolvedOption[];
  currentOptions: ResolvedOption[];
  selectedValues: Array<string | number>;
}): ResolvedOption[] {
  if (selectedValues.length === 0) {
    return fetchedOptions;
  }

  const relevantCurrent = currentOptions.filter((option) =>
    selectedValues.some((value) => isSameOptionValue(option.value, value)),
  );

  if (relevantCurrent.length === 0) {
    return fetchedOptions;
  }

  const merged = [...relevantCurrent];

  for (const option of fetchedOptions) {
    if (!merged.some((item) => isSameOptionValue(item.value, option.value))) {
      merged.push(option);
    }
  }

  return merged;
}
