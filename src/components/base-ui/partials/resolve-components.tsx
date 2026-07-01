import { Combobox } from "@base-ui/react/combobox";
import { useMemo } from "react";
import { DefaultCaretDownIcon } from "../icons/default-caret-down-icon";
import { DefaultCheckIcon } from "../icons/default-check-icon";
import { DefaultXIcon } from "../icons/default-x-icon";
import type {
  BaseUiDynamicSelectComponents,
  BaseUiDynamicSelectIcons,
} from "../types";
import { DefaultButton } from "./defaults/default-button";
import { DefaultEmpty } from "./defaults/default-empty";
import { DefaultItemText } from "./defaults/default-item-text";
import { DefaultListFooter } from "./defaults/default-list-footer";
import { DefaultLoadingOverlay } from "./defaults/default-loading-overlay";
import { DefaultMenuSearchInput } from "./defaults/default-menu-search-input";
import { DefaultSeparator } from "./defaults/default-separator";
import { DefaultStatus } from "./defaults/default-status";

export function resolveBaseUiIcons(icons?: BaseUiDynamicSelectIcons) {
  return {
    Check: icons?.Check ?? DefaultCheckIcon,
    Clear: icons?.Clear ?? DefaultXIcon,
    CaretDown: icons?.CaretDown ?? DefaultCaretDownIcon,
    CaretUpDown: icons?.CaretUpDown ?? DefaultCaretDownIcon,
    ChipRemove: icons?.ChipRemove ?? DefaultXIcon,
  };
}

export function useResolvedBaseUiComponents<
  DataType = any,
  ApiResponse = any,
  ApiParams extends Record<string, unknown> = Record<string, unknown>,
>(
  components?: BaseUiDynamicSelectComponents<DataType, ApiResponse, ApiParams>,
) {
  return useMemo(
    () => ({
      Root: components?.Root ?? Combobox.Root,
      Label: components?.Label ?? Combobox.Label,
      InputGroup: components?.InputGroup ?? Combobox.InputGroup,
      Input: components?.Input ?? Combobox.Input,
      Chips: components?.Chips ?? Combobox.Chips,
      Value: components?.Value ?? Combobox.Value,
      Chip: components?.Chip ?? Combobox.Chip,
      ChipRemove: components?.ChipRemove ?? Combobox.ChipRemove,
      Clear: components?.Clear ?? Combobox.Clear,
      Trigger: components?.Trigger ?? Combobox.Trigger,
      Icon: components?.Icon ?? Combobox.Icon,
      Portal: components?.Portal ?? Combobox.Portal,
      Backdrop: components?.Backdrop ?? Combobox.Backdrop,
      Positioner: components?.Positioner ?? Combobox.Positioner,
      Popup: components?.Popup ?? Combobox.Popup,
      Arrow: components?.Arrow ?? Combobox.Arrow,
      List: components?.List ?? Combobox.List,
      Group: components?.Group ?? Combobox.Group,
      GroupLabel: components?.GroupLabel ?? Combobox.GroupLabel,
      Collection: components?.Collection ?? Combobox.Collection,
      Row: components?.Row ?? Combobox.Row,
      Status: DefaultStatus,
      Empty: components?.Empty ?? DefaultEmpty,
      Item: components?.Item,
      ItemIndicator: components?.ItemIndicator ?? Combobox.ItemIndicator,
      ItemText: components?.ItemText ?? DefaultItemText,
      MenuSearchInput: components?.MenuSearchInput ?? DefaultMenuSearchInput,
      ListFooter: components?.ListFooter ?? DefaultListFooter,
      LoadingOverlay: components?.LoadingOverlay ?? DefaultLoadingOverlay,
      Separator: components?.Separator ?? DefaultSeparator,
      Button: components?.Button ?? DefaultButton,
    }),
    [components],
  );
}
