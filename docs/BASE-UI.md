# Base UI — Dynamic Select

Guide for using `@zealamic/react-dynamic-select/base-ui` with [@base-ui/react Combobox](https://base-ui.com/react/components/combobox).

The Base UI variant is **headless-first**: fetch/search/load-more logic is built in. It ships **styled default components** out of the box — use `BaseUiDynamicSelect` with no `components` prop for a ready-to-use UI. Override individual slots via `components` when you need custom markup (e.g. [shadcn/ui](#shadcnui)).

## Installation

```bash
pnpm add @zealamic/react-dynamic-select @base-ui/react
```

Peer dependencies: `react >= 19`, `@base-ui/react >= 1`.

## Import

```tsx
import {
  BaseUiDynamicSelect,
  useBaseUiDynamicSelect,
  createDefaultBaseUiComponents,
  getOptionLabel,
  isOptionEqualToValue,
  itemToStringLabel,
  itemToStringValue,
  SEARCH_PLACEMENT,
  LOAD_MORE_TYPE,
  FETCH_TRIGGER,
} from "@zealamic/react-dynamic-select/base-ui";
```

## Quick start

`BaseUiDynamicSelect` includes styled default components — no `components` prop required:

```tsx
import { BaseUiDynamicSelect } from "@zealamic/react-dynamic-select/base-ui";
import type { BaseUiDynamicSelectConfig } from "@zealamic/react-dynamic-select/base-ui";

const userListConfig = {
  api: {
    fetch: fetchUsers,
    trigger: FETCH_TRIGGER.OPEN,
    params: { page: 1, pageSize: 10, search: "" },
  },
  list: { path: "data" },
  total: { path: "total" },
  option: {
    template: { label: "fullName", value: "id" },
  },
} satisfies BaseUiDynamicSelectConfig;

function UserSelect() {
  return (
    <BaseUiDynamicSelect
      placeholder="Select a user"
      listHeight={200}
      dynamicConfig={userListConfig}
    />
  );
}
```

![Default](https://github.com/zealamic/react-dynamic-select/blob/main/assets/base-ui/default.jpg)

### Customizing defaults

Use `createDefaultBaseUiComponents` as a starting point — spread and override only the slots you need:

```tsx
import { createDefaultBaseUiComponents } from "@zealamic/react-dynamic-select/base-ui";

const components = {
  ...createDefaultBaseUiComponents(),
  Button: MyCustomButton,
};

// Multiple mode — pass { multiple: true } for chip/input layout
const multipleComponents = createDefaultBaseUiComponents({ multiple: true });
```

## Value

Unlike Ant Design/MUI/Chakra, the value is an **option object**, not a primitive:

- **Single:** `ResolvedOption | null` → `{ label?: string | ReactNode, value: string | number }`
- **Multiple:** `multiple={true}` → `ResolvedOption[]`

```tsx
import type { ResolvedOption } from "@zealamic/react-dynamic-select";

const [user, setUser] = useState<ResolvedOption | null>(null);

<BaseUiDynamicSelect
  value={user}
  onValueChange={(value) => setUser(value as ResolvedOption | null)}
  dynamicConfig={userListConfig}
/>
```

Exported helpers for labels, equality checks, and Combobox string conversion (`itemToStringLabel`, `itemToStringValue` — also used by [shadcn custom items](https://ui.shadcn.com/docs/components/radix/combobox#custom-items)):

```tsx
getOptionLabel(option);
isOptionEqualToValue(a, b);
itemToStringLabel(option);
itemToStringValue(option);
```

## `components` — slot system

`components` is **optional**. When omitted, styled defaults are used. Pass partial overrides to replace individual Combobox parts:

| Slot | Description |
|---|---|
| `Root`, `Label`, `Input`, `InputGroup` | Main chrome |
| `Trigger`, `Icon`, `Clear` | Open/clear controls |
| `Portal`, `Positioner`, `Popup`, `List` | Dropdown |
| `Item`, `ItemText`, `ItemIndicator` | Option row |
| `MenuSearchInput` | Menu search (`SEARCH_PLACEMENT.MENU`) |
| `Status`, `Empty`, `LoadingOverlay` | Loading / empty states |
| `ListFooter` | Total count, load more, and add button |
| `Button`, `Separator` | Action button, divider |
| `Chips`, `Chip`, `ChipRemove`, `Value` | Multiple mode |

**Primitive slots** accept the same props as Base UI Combobox.

**Enriched slots** add extra context:

```tsx
// Item — includes option
({ option, ...props }) => <Combobox.Item {...props} />

// MenuSearchInput — includes searchValue, onSearchChange
({ searchValue, onSearchChange, ...props }) => (...)

// ListFooter — total, load more, add button
({ totalNumber, canLoadMore, onLoadMoreClick, loadMoreConfig, dynamicConfig, ...props }) => (...)
```

## shadcn/ui

[shadcn/ui Combobox](https://ui.shadcn.com/docs/components/radix/combobox) is a styled wrapper around `@base-ui/react` Combobox. Map shadcn primitives to the `components` slots above to keep your Tailwind styling. Start from `createDefaultBaseUiComponents()` and replace slots incrementally, or build the map from scratch.

### Setup

```bash
pnpm dlx shadcn@latest add combobox
```

### Slot mapping

| `BaseUiDynamicSelect` slot | shadcn/ui component |
|---|---|
| `Input` | `ComboboxInput` |
| `Popup` | `ComboboxContent` |
| `List` | `ComboboxList` |
| `Item` | `ComboboxItem` |
| `Empty` | `ComboboxEmpty` |
| `Chips` / `Chip` / `ChipRemove` / `Value` | `ComboboxChips` / `ComboboxChip` / chip remove / `ComboboxValue` |
| `MenuSearchInput` | `ComboboxInput` (inside popup) |
| `Separator` | `ComboboxSeparator` |
| `Button` | `Button` (load more) |
| `Label` | `Label` |

Do **not** pass a static `items` array as in a basic shadcn example — `BaseUiDynamicSelect` owns root state (`items`, `filter`, fetch lifecycle). Provide `dynamicConfig` instead.

### Example

```tsx
import { useMemo } from "react";
import { BaseUiDynamicSelect } from "@zealamic/react-dynamic-select/base-ui";
import type { BaseUiDynamicSelectComponents } from "@zealamic/react-dynamic-select/base-ui";
import { Button } from "@/components/ui/button";
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

function createShadcnComponents(): BaseUiDynamicSelectComponents {
  return {
    Input: (props) => <ComboboxInput {...props} />,
    Popup: (props) => <ComboboxContent {...props} />,
    Empty: (props) => (
      <ComboboxEmpty {...props}>No users found.</ComboboxEmpty>
    ),
    List: (props) => <ComboboxList {...props} />,
    Item: ({ option, ...props }) => (
      <ComboboxItem {...props} value={option}>
        {option.label}
      </ComboboxItem>
    ),
    MenuSearchInput: ({ searchValue, onSearchChange, ...props }) => (
      <ComboboxInput
        {...props}
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search user"
      />
    ),
    Button: (props) => <Button {...props} variant="outline" size="sm" />,
  };
}

function UserSelect() {
  const components = useMemo(() => createShadcnComponents(), []);

  return (
    <BaseUiDynamicSelect
      placeholder="Select a user"
      components={components}
      listHeight={200}
      dynamicConfig={userListConfig}
    />
  );
}
```

For multiple mode, map `Chips` / `Chip` slots to shadcn's [multiple selection](https://ui.shadcn.com/docs/components/radix/combobox#multiple-selection) parts.

## `icons`

Customize the default SVG icons:

```tsx
<BaseUiDynamicSelect
  icons={{
    Check: MyCheckIcon,
    Clear: MyClearIcon,
    CaretDown: MyCaretIcon,
  }}
  components={components}
  dynamicConfig={userListConfig}
/>
```

## dynamicConfig

Shared across all variants. See [Dynamic config properties](https://github.com/zealamic/react-dynamic-select/blob/main/README.md#dynamic-config-properties) for the full property reference.

`search.inputSearchMenuProps` accepts Base UI `ComboboxInputProps`.

## Search

```tsx
search: { placement: SEARCH_PLACEMENT.INLINE, debounce: 300 }
```

![Inline search](https://github.com/zealamic/react-dynamic-select/blob/main/assets/base-ui/inline-search.jpg)

## Load more

```tsx
loadMore: { type: LOAD_MORE_TYPE.SCROLL }
loadMore: { type: LOAD_MORE_TYPE.CLICK }
```

| Scroll | Click |
| :---: | :---: |
| ![Load more scroll](https://github.com/zealamic/react-dynamic-select/blob/main/assets/base-ui/load-more-scroll.jpg) | ![Load more click](https://github.com/zealamic/react-dynamic-select/blob/main/assets/base-ui/load-more-click.jpg) |

## Add button

```tsx
dynamicConfig={{
  ...userListConfig,
  add: {
    label: "Add user",
    placement: "start",
    onClick: () => {
      // open create form, navigate, etc.
    },
  },
}}
```

| Start | End |
| :---: | :---: |
| ![Add button start](https://github.com/zealamic/react-dynamic-select/blob/main/assets/base-ui/add-button-start.jpg) | ![Add button end](https://github.com/zealamic/react-dynamic-select/blob/main/assets/base-ui/add-button-end.jpg) |

Set `placement` to `"start"` (left of footer) or `"end"` (right). See [add](https://github.com/zealamic/react-dynamic-select/blob/main/README.md#dynamic-config-properties) in the property reference.

## Custom option label

Use a React component in `option.template.label` to render rich rows (name + email, avatars, badges, etc.):

```tsx
<BaseUiDynamicSelect
  dynamicConfig={{
    ...userListConfig,
    option: {
      template: {
        label: ({ data }) => (
          <div>
            <div>{data.fullName}</div>
            <div style={{ fontSize: 12, color: "gray" }}>{data.email}</div>
          </div>
        ),
        value: "id",
      },
    },
  }}
/>
```

![Custom option label](https://github.com/zealamic/react-dynamic-select/blob/main/assets/base-ui/custom-option.jpg)

Default `ItemText` and `Value` slots use `getOptionLabelNode` so custom labels render in the list, input, and chips. For custom `Item` slots, render `getOptionLabelNode(option)` yourself.

## Multiple selection

```tsx
<BaseUiDynamicSelect
  multiple
  placeholder="Select users"
  components={createDefaultBaseUiComponents({ multiple: true })}
  dynamicConfig={userListConfig}
/>
```

Or omit `components` — defaults adapt automatically when `multiple` is set.

![Multiple](https://github.com/zealamic/react-dynamic-select/blob/main/assets/base-ui/multiple.jpg)

## Pre-loaded value

Use `currentData` for edit mode — see [currentData](https://github.com/zealamic/react-dynamic-select/blob/main/README.md#dynamic-config-properties) in the property reference.

```tsx
const presetUser = { id: 15, fullName: "Emma Johnson", ... };

<BaseUiDynamicSelect
  defaultValue={{ label: presetUser.fullName, value: presetUser.id }}
  dynamicConfig={{
    ...userListConfig,
    currentData: presetUser,
  }}
/>
```

## React Hook Form

```tsx
import { Controller, useForm } from "react-hook-form";
import type { ResolvedOption } from "@zealamic/react-dynamic-select";
import { BaseUiDynamicSelect } from "@zealamic/react-dynamic-select/base-ui";

type FormValues = { user: ResolvedOption | null };

function Form() {
  const { control } = useForm<FormValues>({ defaultValues: { user: null } });

  return (
    <Controller
      name="user"
      control={control}
      rules={{ required: "Please select a user" }}
      render={({ field }) => (
        <BaseUiDynamicSelect
          placeholder="Select a user"
          listHeight={200}
          dynamicConfig={userListConfig}
          value={field.value}
          onValueChange={(value) => field.onChange(value)}
        />
      )}
    />
  );
}
```

## Hook `useBaseUiDynamicSelect`

```tsx
const hookReturn = useBaseUiDynamicSelect(props);
// options, loading, open, handleOpenChange, handlePopupScroll,
// handleLoadMoreClick, searchValue, ...
```

Use when building a fully custom UI from the hook.

## TypeScript generics

```tsx
BaseUiDynamicSelect<UserModel, ApiResponse, ApiParams, Multiple>
```

- `DataType` — item type in `currentData`
- `ApiResponse` — API response type
- `ApiParams` — query params type (must include `search?: string`)
- `Multiple` — `true` | `false`

## Notes

- Default styles are shipped as CSS Modules in the build output (`default.module.js` + `default_module.css`).
- Use `onValueChange(value, eventDetails)` instead of `onChange` from other variants.
- The `label` prop renders a label above the input when `components.Label` is provided.
