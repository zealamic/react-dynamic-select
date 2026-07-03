"use client";
import { useMemo } from "react";
import type { SearchableApiParams } from "@/general-types";
import { DefaultCaretDownIcon } from "@/icons/default-caret-down-icon";
import { DefaultCheckIcon } from "@/icons/default-check-icon";
import { DefaultXIcon } from "@/icons/default-x-icon";
import type {
  BaseUiDynamicSelectComponents,
  BaseUiDynamicSelectIcons,
} from "../types";
import { createDefaultBaseUiComponents } from "./defaults/create-default-base-ui-components";

type ResolvedBaseUiComponents<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
> = Required<BaseUiDynamicSelectComponents<DataType, ApiResponse, ApiParams>>;

export function resolveBaseUiIcons(icons?: BaseUiDynamicSelectIcons) {
  return {
    Check: icons?.Check ?? DefaultCheckIcon,
    Clear: icons?.Clear ?? DefaultXIcon,
    CaretDown: icons?.CaretDown ?? DefaultCaretDownIcon,
    CaretUpDown: icons?.CaretUpDown ?? DefaultCaretDownIcon,
    ChipRemove: icons?.ChipRemove ?? DefaultXIcon,
  };
}

type UseResolvedBaseUiComponentsOptions = {
  multiple?: boolean;
};

export function useResolvedBaseUiComponents<
  DataType = any,
  ApiResponse = any,
  ApiParams extends SearchableApiParams = SearchableApiParams,
>(
  components?: BaseUiDynamicSelectComponents<DataType, ApiResponse, ApiParams>,
  { multiple = false }: UseResolvedBaseUiComponentsOptions = {},
): ResolvedBaseUiComponents<DataType, ApiResponse, ApiParams> {
  const defaults = useMemo(
    () => createDefaultBaseUiComponents({ multiple }),
    [multiple],
  );

  return useMemo(
    () =>
      ({
        Root: components?.Root ?? defaults.Root,
        Label: components?.Label ?? defaults.Label,
        InputGroup: components?.InputGroup ?? defaults.InputGroup,
        Input: components?.Input ?? defaults.Input,
        Chips: components?.Chips ?? defaults.Chips,
        Value: components?.Value ?? defaults.Value,
        Chip: components?.Chip ?? defaults.Chip,
        ChipRemove: components?.ChipRemove ?? defaults.ChipRemove,
        Clear: components?.Clear ?? defaults.Clear,
        Trigger: components?.Trigger ?? defaults.Trigger,
        Icon: components?.Icon ?? defaults.Icon,
        Portal: components?.Portal ?? defaults.Portal,
        Backdrop: components?.Backdrop ?? defaults.Backdrop,
        Positioner: components?.Positioner ?? defaults.Positioner,
        Popup: components?.Popup ?? defaults.Popup,
        Arrow: components?.Arrow ?? defaults.Arrow,
        List: components?.List ?? defaults.List,
        Group: components?.Group ?? defaults.Group,
        GroupLabel: components?.GroupLabel ?? defaults.GroupLabel,
        Collection: components?.Collection ?? defaults.Collection,
        Row: components?.Row ?? defaults.Row,
        Status: components?.Status ?? defaults.Status,
        Empty: components?.Empty ?? defaults.Empty,
        Item: components?.Item ?? defaults.Item,
        ItemIndicator: components?.ItemIndicator ?? defaults.ItemIndicator,
        ItemText: components?.ItemText ?? defaults.ItemText,
        MenuSearchInput:
          components?.MenuSearchInput ?? defaults.MenuSearchInput,
        ListFooter: components?.ListFooter ?? defaults.ListFooter,
        LoadingOverlay: components?.LoadingOverlay ?? defaults.LoadingOverlay,
        Separator: components?.Separator ?? defaults.Separator,
        Button: components?.Button ?? defaults.Button,
      }) as ResolvedBaseUiComponents<DataType, ApiResponse, ApiParams>,
    [components, defaults],
  );
}
