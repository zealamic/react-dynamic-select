"use client";
import { Combobox } from "@base-ui/react/combobox";
import type { BaseUiDynamicSelectComponents } from "../../types";
import { DefaultButton } from "./default-button";
import {
  createDefaultInput,
  createDefaultInputGroup,
  DefaultChip,
  DefaultChipRemove,
  DefaultChips,
  DefaultClear,
  DefaultItem,
  DefaultItemIndicator,
  DefaultLabel,
  DefaultList,
  DefaultPopup,
  DefaultPositioner,
  DefaultTrigger,
} from "./default-combobox-slots";
import { DefaultEmpty } from "./default-empty";
import { DefaultItemText } from "./default-item-text";
import { DefaultListFooter } from "./default-list-footer";
import { DefaultLoadingOverlay } from "./default-loading-overlay";
import { DefaultMenuSearchInput } from "./default-menu-search-input";
import { DefaultSeparator } from "./default-separator";
import { DefaultStatus } from "./default-status";

type CreateDefaultBaseUiComponentsOptions = {
  multiple?: boolean;
};

export function createDefaultBaseUiComponents(
  options: CreateDefaultBaseUiComponentsOptions = {},
): Required<BaseUiDynamicSelectComponents> {
  const { multiple = false } = options;

  return {
    Root: Combobox.Root,
    Label: DefaultLabel,
    InputGroup: createDefaultInputGroup(multiple),
    Input: createDefaultInput(multiple),
    Chips: DefaultChips,
    Value: Combobox.Value,
    Chip: DefaultChip,
    ChipRemove: DefaultChipRemove,
    Clear: DefaultClear,
    Trigger: DefaultTrigger,
    Icon: Combobox.Icon,
    Portal: Combobox.Portal,
    Backdrop: Combobox.Backdrop,
    Positioner: DefaultPositioner,
    Popup: DefaultPopup,
    Arrow: Combobox.Arrow,
    List: DefaultList,
    Group: Combobox.Group,
    GroupLabel: Combobox.GroupLabel,
    Collection: Combobox.Collection,
    Row: Combobox.Row,
    Status: DefaultStatus,
    Empty: DefaultEmpty,
    Item: DefaultItem,
    ItemIndicator: DefaultItemIndicator,
    ItemText: DefaultItemText,
    MenuSearchInput: DefaultMenuSearchInput,
    ListFooter: DefaultListFooter,
    LoadingOverlay: DefaultLoadingOverlay,
    Separator: DefaultSeparator,
    Button: DefaultButton,
  } as Required<BaseUiDynamicSelectComponents>;
}
