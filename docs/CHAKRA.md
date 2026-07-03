# Chakra UI — Dynamic Select

Guide for using `@zealamic/react-dynamic-select/chakra` with [Chakra UI v3 Combobox](https://chakra-ui.com/docs/components/combobox).

## Installation

```bash
pnpm add @zealamic/react-dynamic-select @chakra-ui/react
```

Peer dependencies: `react >= 19`, `@chakra-ui/react >= 3`.

Wrap your app (or Storybook decorator) with `ChakraProvider`:

```tsx
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

<ChakraProvider value={defaultSystem}>
  <App />
</ChakraProvider>
```

## Import

```tsx
import {
  ChakraDynamicSelect,
  useChakraDynamicSelect,
  SEARCH_PLACEMENT,
  LOAD_MORE_TYPE,
  FETCH_TRIGGER,
} from "@zealamic/react-dynamic-select/chakra";
```

## Quick start

```tsx
import { ChakraDynamicSelect } from "@zealamic/react-dynamic-select/chakra";
import type { ChakraDynamicSelectConfig } from "@zealamic/react-dynamic-select/chakra";

type User = { id: number; fullName: string };
type ApiParams = { page?: number; pageSize?: number; search?: string };
type ApiResponse = { data: User[]; total: number };

const userListConfig = {
  api: {
    fetch: fetchUsers,
    params: { page: 1, pageSize: 10, search: "" },
  },
  list: { path: "data" },
  total: { path: "total" },
  option: {
    template: { label: "fullName", value: "id" },
  },
} satisfies ChakraDynamicSelectConfig<User, ApiResponse, ApiParams>;

function UserSelect() {
  return (
    <ChakraDynamicSelect
      placeholder="Select a user"
      width="320px"
      dynamicConfig={userListConfig}
    />
  );
}
```

![Default](https://github.com/zealamic/react-dynamic-select/blob/main/assets/chakra/default.jpg)

`ChakraDynamicSelect` extends Chakra `Combobox.Root` props and adds `dynamicConfig`, `placeholder`, `label`, and `listHeight`. Collection, value mapping, and input wiring are managed internally.

## Value

Type `ChakraDynamicSelectValue`:

- **Single:** `string | number | null` (primitive id from `option.template.value`)
- **Multiple:** `multiple={true}` → `Array<string | number>`

The component maps primitives ↔ internal `string[]` Combobox values automatically.

```tsx
// Controlled
const [userId, setUserId] = useState<number | null>(null);

<ChakraDynamicSelect
  value={userId}
  onChange={(value) => {
    setUserId(value == null || Array.isArray(value) ? null : value);
  }}
  dynamicConfig={userListConfig}
/>
```

Use `onChange` for primitive values (same as MUI/Ant Design). Use `onValueChange` when you need Chakra `ComboboxValueChangeDetails`.

## dynamicConfig

Shared across all variants. See [Dynamic config properties](https://github.com/zealamic/react-dynamic-select/blob/main/README.md#dynamic-config-properties) for the full property reference.

`search.inputSearchMenuProps` accepts Chakra `ComboboxInput` props.

## Search

**Menu search** (default): search input inside the dropdown. The main input is read-only and opens the menu on click.

**Inline search:** set `search.placement` to `SEARCH_PLACEMENT.INLINE`:

```tsx
<ChakraDynamicSelect
  dynamicConfig={{
    ...userListConfig,
    search: {
      placement: SEARCH_PLACEMENT.INLINE,
      debounce: 300,
    },
  }}
/>
```

![Inline search](https://github.com/zealamic/react-dynamic-select/blob/main/assets/chakra/inline-search.jpg)

## Load more

```tsx
loadMore: { type: LOAD_MORE_TYPE.SCROLL }
loadMore: { type: LOAD_MORE_TYPE.CLICK }
```

| Scroll | Click |
| :---: | :---: |
| ![Load more scroll](https://github.com/zealamic/react-dynamic-select/blob/main/assets/chakra/load-more-scroll.jpg) | ![Load more click](https://github.com/zealamic/react-dynamic-select/blob/main/assets/chakra/load-more-click.jpg) |

## Add button

Render a create / add action in the dropdown footer. Set `placement` to `"start"` or `"end"`.

```tsx
<ChakraDynamicSelect
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
/>
```

| Start | End |
| :---: | :---: |
| ![Add button start](https://github.com/zealamic/react-dynamic-select/blob/main/assets/chakra/add-button-start.jpg) | ![Add button end](https://github.com/zealamic/react-dynamic-select/blob/main/assets/chakra/add-button-end.jpg) |

| Property | Description |
|---|---|
| `label` | Button text |
| `icon` | Custom icon (`ReactNode`). Defaults to a built-in plus icon |
| `placement` | `"start"` — left side of footer; `"end"` — right side |
| `onClick` | Click handler |
| `disabled` | Disable the button |

The footer is shown when `total`, `loadMore`, or `add` is configured. See [add](https://github.com/zealamic/react-dynamic-select/blob/main/README.md#dynamic-config-properties) in the property reference.

## Custom option label

Use a React component in `option.template.label` to render rich rows (name + email, avatars, badges, etc.):

```tsx
<ChakraDynamicSelect
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

![Custom option label](https://github.com/zealamic/react-dynamic-select/blob/main/assets/chakra/custom-option.jpg)

In **single** mode, a custom label is overlaid on the input while keeping the Combobox accessible. In **multiple** mode, custom labels appear in both the dropdown and dismissible chips.

String helpers such as `getOptionLabel` (used for `aria-label` on chip remove buttons) fall back to `value` when the label is not plain text.

## Pre-loaded value

Use `currentData` for edit mode — see [currentData](https://github.com/zealamic/react-dynamic-select/blob/main/README.md#dynamic-config-properties) in the property reference.

```tsx
<ChakraDynamicSelect
  defaultValue={presetUser.id}
  dynamicConfig={{
    ...userListConfig,
    currentData: presetUser,
  }}
/>

// Multiple
<ChakraDynamicSelect
  multiple
  defaultValue={[user1.id, user2.id]}
  dynamicConfig={{
    ...userListConfig,
    currentData: [user1, user2],
  }}
/>
```

## Multiple selection

```tsx
<ChakraDynamicSelect
  multiple
  placeholder="Select users"
  width="320px"
  dynamicConfig={userListConfig}
/>
```

![Multiple](https://github.com/zealamic/react-dynamic-select/blob/main/assets/chakra/multiple.jpg)

Each selected item renders as a dismissible `Tag` with a per-chip remove button (`Tag.EndElement` + `Tag.CloseTrigger`). The global clear trigger clears all selections.

## Additional props

| Prop | Description |
|---|---|
| `placeholder` | Combobox input placeholder |
| `label` | Renders `Combobox.Label` above the control |
| `listHeight` | Scrollable list height in the dropdown, defaults to `200` |
| `open` / `onOpenChange` | Controlled open state (optional) |
| `onValueChange` | Chakra Combobox value change details |
| Other `Combobox.Root` props | Passed through except `collection`, `value`, `defaultValue`, `onValueChange`, `onInputValueChange`, `onOpenChange` |

## React Hook Form

```tsx
import { Controller, useForm } from "react-hook-form";
import { ChakraDynamicSelect } from "@zealamic/react-dynamic-select/chakra";

type FormValues = { user: number | null };

function Form() {
  const { control } = useForm<FormValues>({ defaultValues: { user: null } });

  return (
    <Controller
      name="user"
      control={control}
      rules={{ required: "Please select a user" }}
      render={({ field }) => (
        <ChakraDynamicSelect
          width="100%"
          placeholder="Select a user"
          dynamicConfig={userListConfig}
          value={field.value}
          onChange={(value) => {
            field.onChange(
              value == null || Array.isArray(value) ? null : value,
            );
          }}
        />
      )}
    />
  );
}
```

## Hook `useChakraDynamicSelect`

```tsx
const hookReturn = useChakraDynamicSelect(props);
// Returns: options, loading, open, handleOpenChange, handlePopupScroll,
// handleLoadMoreClick, searchValue, handleInlineSearch, handleMenuSearchChange, ...
```

Use when building a custom UI on top of Chakra Combobox.

## Notes

- Requires `ChakraProvider` with a Chakra v3 system (e.g. `defaultSystem`).
- Initial fetch shows a spinner in the indicator group; the dropdown opens only after the first page of data is ready.
- Closing the dropdown resets search and re-fetches the first page when a search was active.
- For **menu search**, the main input is read-only and opens the menu on click.
- `listHeight` defaults to `200` when not provided.
- Fetch runs only on the first open (unless `trigger: FETCH_TRIGGER.MOUNT`).
