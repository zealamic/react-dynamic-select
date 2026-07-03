# MUI — Dynamic Select

Guide for using `@zealamic/react-dynamic-select/mui` with [MUI Autocomplete](https://mui.com/material-ui/react-autocomplete/).

## Installation

**npm**

```bash
npm install @zealamic/react-dynamic-select @mui/material @emotion/react @emotion/styled
```

**yarn**

```bash
yarn add @zealamic/react-dynamic-select @mui/material @emotion/react @emotion/styled
```

**pnpm**

```bash
pnpm add @zealamic/react-dynamic-select @mui/material @emotion/react @emotion/styled
```

Peer dependencies: `react >= 19`, `@mui/material >= 5`.

## Import

```tsx
import {
  MuiDynamicSelect,
  useMuiDynamicSelect,
  SEARCH_PLACEMENT,
  LOAD_MORE_TYPE,
  FETCH_TRIGGER,
} from "@zealamic/react-dynamic-select/mui";
```

## Quick start

```tsx
import { MuiDynamicSelect } from "@zealamic/react-dynamic-select/mui";
import type { MuiDynamicSelectConfig } from "@zealamic/react-dynamic-select/mui";

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
} satisfies MuiDynamicSelectConfig<User, ApiResponse, ApiParams>;

function UserSelect() {
  return (
    <MuiDynamicSelect
      placeholder="Select a user"
      sx={{ width: 320 }}
      dynamicConfig={userListConfig}
    />
  );
}
```

![Default](https://github.com/zealamic/react-dynamic-select/blob/main/assets/mui/default.jpg)

`MuiDynamicSelect` wraps MUI `Autocomplete` with an async data layer. Most Autocomplete props are supported, except `options`, `value`, `defaultValue`, `onChange`, `filterOptions`, and `renderInput` (managed internally).

## Value

Type `MuiDynamicSelectValue`:

- **Single:** `string | number | null` (primitive id)
- **Multiple:** `Array<string | number>`

The component maps primitives ↔ internal `ResolvedOption` objects automatically.

```tsx
// Controlled
const [userId, setUserId] = useState<number | null>(null);

<MuiDynamicSelect
  value={userId}
  onChange={(_event, value) => {
    setUserId(value == null || Array.isArray(value) ? null : value);
  }}
  dynamicConfig={userListConfig}
/>
```

## dynamicConfig

Shared across all variants. See [Dynamic config properties](https://github.com/zealamic/react-dynamic-select/blob/main/README.md#dynamic-config-properties) for the full property reference.

`search.inputSearchMenuProps` accepts MUI `TextField` props.

## Search

```tsx
<MuiDynamicSelect
  dynamicConfig={{
    ...userListConfig,
    search: {
      placement: SEARCH_PLACEMENT.INLINE,
      debounce: 300,
    },
  }}
/>
```

![Inline search](https://github.com/zealamic/react-dynamic-select/blob/main/assets/mui/inline-search.jpg)

## Load more

```tsx
loadMore: { type: LOAD_MORE_TYPE.SCROLL }
loadMore: { type: LOAD_MORE_TYPE.CLICK }
```

| Scroll | Click |
| :---: | :---: |
| ![Load more scroll](https://github.com/zealamic/react-dynamic-select/blob/main/assets/mui/load-more-scroll.jpg) | ![Load more click](https://github.com/zealamic/react-dynamic-select/blob/main/assets/mui/load-more-click.jpg) |

## Add button

Render a create / add action in the dropdown footer. Set `placement` to `"start"` or `"end"`.

```tsx
<MuiDynamicSelect
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
| ![Add button start](https://github.com/zealamic/react-dynamic-select/blob/main/assets/mui/add-button-start.jpg) | ![Add button end](https://github.com/zealamic/react-dynamic-select/blob/main/assets/mui/add-button-end.jpg) |

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
<MuiDynamicSelect
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

![Custom option label](https://github.com/zealamic/react-dynamic-select/blob/main/assets/mui/custom-option.jpg)

In **single** mode, a custom label is overlaid on the input. In **multiple** mode, custom labels appear in chips via `renderValue` / `getOptionLabelNode`.

## Multiple selection

```tsx
<MuiDynamicSelect
  multiple
  placeholder="Select users"
  sx={{ width: 320 }}
  dynamicConfig={userListConfig}
/>
```

![Multiple](https://github.com/zealamic/react-dynamic-select/blob/main/assets/mui/multiple.jpg)

## Pre-loaded value

Use `currentData` for edit mode — see [currentData](https://github.com/zealamic/react-dynamic-select/blob/main/README.md#dynamic-config-properties) in the property reference.

```tsx
<MuiDynamicSelect
  defaultValue={presetUser.id}
  dynamicConfig={{
    ...userListConfig,
    currentData: presetUser,
  }}
/>

// Multiple
<MuiDynamicSelect
  multiple
  defaultValue={[user1.id, user2.id]}
  dynamicConfig={{
    ...userListConfig,
    currentData: [user1, user2],
  }}
/>
```

## Additional props

| Prop | Description |
|---|---|
| `placeholder` | TextField placeholder |
| `label` | TextField label |
| `listHeight` | Listbox height, defaults to `200` |
| `helperText` / `error` / `required` / `name` | From MUI TextField |
| `renderInput` | Customize the TextField |
| `renderValue` | Customize multiple-mode chip display |

## React Hook Form

```tsx
import { Controller, useForm } from "react-hook-form";
import { MuiDynamicSelect } from "@zealamic/react-dynamic-select/mui";

type FormValues = { user: number | null };

function Form() {
  const { control } = useForm<FormValues>({ defaultValues: { user: null } });

  return (
    <Controller
      name="user"
      control={control}
      rules={{ required: "Please select a user" }}
      render={({ field }) => (
        <MuiDynamicSelect
          sx={{ width: "100%" }}
          placeholder="Select a user"
          dynamicConfig={userListConfig}
          value={field.value}
          onChange={(_event, value) => {
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

## Hook `useMuiDynamicSelect`

```tsx
const hookReturn = useMuiDynamicSelect(props);
// Returns: options, loading, isOpen, handleOpen, handleClose,
// handlePopupScroll, handleLoadMoreClick, searchValue, ...
```

Use when rendering a custom UI on top of MUI Autocomplete.

## Notes

- Client-side filtering is disabled (`filterOptions` always returns all server-fetched options).
- Loading is shown via `CircularProgress` in the input and an overlay in the popup.
- Closing the popup resets search, same as the Ant Design variant.
