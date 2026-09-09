# Base UI — BaseUiDynamicSelect

Entry: `@zealamic/react-dynamic-select/base-ui`

Headless-first with **styled defaults** included. Override slots via `components` for shadcn/ui or custom design systems.

## Install

```bash
npm install @zealamic/react-dynamic-select @base-ui/react
```

Peers: `react >= 19`, `@base-ui/react >= 1`.

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
import type {
  BaseUiDynamicSelectConfig,
  BaseUiDynamicSelectComponents,
  ResolvedOption,
} from "@zealamic/react-dynamic-select/base-ui";
```

## Quick start (no components prop)

```tsx
<BaseUiDynamicSelect
  placeholder="Select a user"
  listHeight={200}
  dynamicConfig={userListConfig}
/>
```

## Value — IMPORTANT

Unlike Antd/MUI/Chakra, value is **option object**, not primitive:

| Mode | Type |
|---|---|
| Single | `ResolvedOption \| null` |
| Multiple | `ResolvedOption[]` |

```tsx
const [user, setUser] = useState<ResolvedOption | null>(null);

<BaseUiDynamicSelect
  value={user}
  onValueChange={(value) => setUser(value as ResolvedOption | null)}
  dynamicConfig={userListConfig}
/>
```

Use `onValueChange`, not primitive `onChange`.

## Slot system (`components` prop)

Optional. Partial overrides merge with defaults.

| Slot | Role |
|---|---|
| `Root`, `Label`, `Input`, `InputGroup` | Chrome |
| `Trigger`, `Icon`, `Clear` | Controls |
| `Portal`, `Positioner`, `Popup`, `List` | Dropdown |
| `Item`, `ItemText`, `ItemIndicator` | Rows |
| `MenuSearchInput` | Menu search |
| `Status`, `Empty`, `LoadingOverlay` | States |
| `ListFooter` | Total, load more, add |
| `Chips`, `Chip`, `ChipRemove`, `Value` | Multiple mode |

Enriched slots receive extra context:

```tsx
Item: ({ option, ...props }) => <Combobox.Item {...props} />
MenuSearchInput: ({ searchValue, onSearchChange, ...props }) => (...)
ListFooter: ({ totalNumber, canLoadMore, onLoadMoreClick, dynamicConfig, ...props }) => (...)
```

## Customize defaults

```tsx
const components = {
  ...createDefaultBaseUiComponents(),
  Button: MyButton,
};

// Multiple layout
createDefaultBaseUiComponents({ multiple: true });
```

## Icons

```tsx
icons={{ Check: MyCheck, Clear: MyClear, CaretDown: MyCaret, ChipRemove: MyX }}
```

## shadcn/ui mapping

| Slot | shadcn |
|---|---|
| `Input` | `ComboboxInput` |
| `Popup` | `ComboboxContent` |
| `List` | `ComboboxList` |
| `Item` | `ComboboxItem` |
| `Empty` | `ComboboxEmpty` |
| `Chips`/`Chip`/`ChipRemove` | shadcn multiple selection parts |

Do **not** pass static `items` — library owns fetch lifecycle via `dynamicConfig`.

## Custom option label

Default `ItemText` uses `getOptionLabelNode`. Custom `Item` slot: render `getOptionLabelNode(option)` yourself.

## Total label

Keep `total.path` for load more. Hide the footer count with `hidden: true`:

```tsx
total: { path: "total", hidden: true }
```

Hide the entire footer (total, load more, add):

```tsx
isMenuFooterVisible: false
```

## Messages

`dynamicConfig.messages` drives `Empty`, `LoadingOverlay`, and `Status`.

## React Hook Form

```tsx
<Controller
  name="user"
  control={control}
  render={({ field }) => (
    <BaseUiDynamicSelect
      dynamicConfig={userListConfig}
      value={field.value}
      onValueChange={field.onChange}
    />
  )}
/>
```

## Hook: useBaseUiDynamicSelect

Full custom UI from hook return (`options`, `open`, handlers, etc.).

## Generics

```tsx
BaseUiDynamicSelect<UserModel, ApiResponse, ApiParams, Multiple>
```

## Notes

- Default styles: CSS Modules in build (`default.module.css`).
- `label` prop renders when `components.Label` exists.
- Do not pass `items` / `filter` to Root — managed internally.
- Search inputs are disabled while load more is in progress.

See [dynamicConfig](rds-dynamic-config.md).
