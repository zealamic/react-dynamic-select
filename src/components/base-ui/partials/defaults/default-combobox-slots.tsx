"use client";
import type {
  ComboboxChipProps,
  ComboboxChipRemoveProps,
  ComboboxChipsProps,
  ComboboxClearProps,
  ComboboxInputGroupProps,
  ComboboxInputProps,
  ComboboxItemIndicatorProps,
  ComboboxLabelProps,
  ComboboxListProps,
  ComboboxPopupProps,
  ComboboxPositionerProps,
  ComboboxTriggerProps,
} from "@base-ui/react/combobox";
import { Combobox } from "@base-ui/react/combobox";
import type { BaseUiItemSlotProps } from "../../types";
import styles from "./default.module.css";
import { mergeClassName } from "./merge-class-name";

export function DefaultLabel({ className, ...props }: ComboboxLabelProps) {
  return (
    <Combobox.Label
      className={mergeClassName(styles["rds-base-ui__label"], className)}
      {...props}
    />
  );
}

export function createDefaultInputGroup(multiple: boolean) {
  return function DefaultInputGroup({
    className,
    ...props
  }: ComboboxInputGroupProps) {
    return (
      <Combobox.InputGroup
        className={mergeClassName(
          styles[
            multiple
              ? "rds-base-ui__input-group--multiple"
              : "rds-base-ui__input-group"
          ],
          className,
        )}
        {...props}
      />
    );
  };
}

export function createDefaultInput(multiple: boolean) {
  return function DefaultInput({ className, ...props }: ComboboxInputProps) {
    return (
      <Combobox.Input
        className={mergeClassName(
          styles[multiple ? "rds-base-ui__input--multiple" : "rds-base-ui__input"],
          className,
        )}
        {...props}
      />
    );
  };
}

export function DefaultChips({ className, ...props }: ComboboxChipsProps) {
  return (
    <Combobox.Chips
      className={mergeClassName(styles["rds-base-ui__chips"], className)}
      {...props}
    />
  );
}

export function DefaultChip({ className, ...props }: ComboboxChipProps) {
  return (
    <Combobox.Chip
      className={mergeClassName(styles["rds-base-ui__chip"], className)}
      {...props}
    />
  );
}

export function DefaultChipRemove({
  className,
  ...props
}: ComboboxChipRemoveProps) {
  return (
    <Combobox.ChipRemove
      className={mergeClassName(styles["rds-base-ui__chip-remove"], className)}
      {...props}
    />
  );
}

export function DefaultClear({ className, ...props }: ComboboxClearProps) {
  return (
    <Combobox.Clear
      className={mergeClassName(styles["rds-base-ui__clear"], className)}
      {...props}
    />
  );
}

export function DefaultTrigger({ className, ...props }: ComboboxTriggerProps) {
  return (
    <Combobox.Trigger
      className={mergeClassName(styles["rds-base-ui__trigger"], className)}
      {...props}
    />
  );
}

export function DefaultPositioner({
  className,
  ...props
}: ComboboxPositionerProps) {
  return (
    <Combobox.Positioner
      className={mergeClassName(styles["rds-base-ui__positioner"], className)}
      {...props}
    />
  );
}

export function DefaultPopup({ className, ...props }: ComboboxPopupProps) {
  return (
    <Combobox.Popup
      className={mergeClassName(styles["rds-base-ui__popup"], className)}
      {...props}
    />
  );
}

export function DefaultList({ className, ...props }: ComboboxListProps) {
  return (
    <Combobox.List
      className={mergeClassName(styles["rds-base-ui__list"], className)}
      {...props}
    />
  );
}

export function DefaultItem({
  option,
  className,
  children,
  ...props
}: BaseUiItemSlotProps) {
  return (
    <Combobox.Item
      className={mergeClassName(styles["rds-base-ui__item"], className)}
      value={option}
      {...props}
    >
      {children}
    </Combobox.Item>
  );
}

export function DefaultItemIndicator({
  className,
  ...props
}: ComboboxItemIndicatorProps) {
  return (
    <Combobox.ItemIndicator
      className={mergeClassName(
        styles["rds-base-ui__item-indicator"],
        className,
      )}
      {...props}
    />
  );
}
