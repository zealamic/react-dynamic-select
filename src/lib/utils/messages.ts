import type { ReactNode } from "react";
import type { SelectMessages } from "@/general-types";

export const DEFAULT_SELECT_MESSAGES = {
  loading: "Loading...",
  empty: "No items found",
  noResults: "No results found.",
} as const;

function resolveMessage(
  value: ReactNode | null | undefined,
  fallback: ReactNode,
): ReactNode {
  if (value === null) {
    return null;
  }

  return value ?? fallback;
}

export function resolveSelectLoadingMessage(
  messages: SelectMessages | undefined,
  {
    loading,
    hasOptions,
  }: {
    loading: boolean;
    hasOptions: boolean;
  },
): ReactNode | null {
  if (!loading || hasOptions) {
    return null;
  }

  return resolveMessage(messages?.loading, DEFAULT_SELECT_MESSAGES.loading);
}

export function resolveSelectEmptyMessage(
  messages: SelectMessages | undefined,
  {
    loading,
    hasOptions,
    searchValue,
  }: {
    loading: boolean;
    hasOptions: boolean;
    searchValue: string;
  },
): ReactNode | null {
  if (loading || hasOptions) {
    return null;
  }

  if (searchValue) {
    return resolveMessage(
      messages?.noResults,
      DEFAULT_SELECT_MESSAGES.noResults,
    );
  }

  return resolveMessage(messages?.empty, DEFAULT_SELECT_MESSAGES.empty);
}

export function resolveSelectNoOptionsMessage(
  messages: SelectMessages | undefined,
  searchValue: string,
): ReactNode {
  if (searchValue) {
    return resolveMessage(
      messages?.noResults,
      DEFAULT_SELECT_MESSAGES.noResults,
    );
  }

  return resolveMessage(messages?.empty, DEFAULT_SELECT_MESSAGES.empty);
}
