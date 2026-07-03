# Ant Design — Dynamic Select

Guide for using `@zealamic/react-dynamic-select/antd` with [Ant Design Select](https://ant.design/components/select).

## Installation

```bash
pnpm add @zealamic/react-dynamic-select antd
```

Peer dependencies: `react >= 19`, `antd >= 5`.

## Import

```tsx
import {
  AntdDynamicSelect,
  useAntdDynamicSelect,
  SEARCH_PLACEMENT,
  LOAD_MORE_TYPE,
  FETCH_TRIGGER,
} from "@zealamic/react-dynamic-select/antd";
```

## Quick start

```tsx
import { AntdDynamicSelect } from "@zealamic/react-dynamic-select/antd";
import type { AntdDynamicSelectConfig } from "@zealamic/react-dynamic-select/antd";

type User = { id: number; fullName: string };
type ApiParams = { page?: number; pageSize?: number; search?: string };
type ApiResponse = { data: User[]; total: number };

const userListConfig = {
  api: {
    fetch: (params) => fetchUsers(params),
    params: { page: 1, pageSize: 10, search: "" },
  },
  list: { path: "data" },
  total: { path: "total" },
  option: {
    template: { label: "fullName", value: "id" },
  },
} satisfies AntdDynamicSelectConfig<User, ApiResponse, ApiParams>;

function UserSelect() {
  return (
    <AntdDynamicSelect
      placeholder="Select a user"
      style={{ width: 320 }}
      allowClear
      showSearch
      dynamicConfig={userListConfig}
    />
  );
}
```

![Default](https://github.com/zealamic/react-dynamic-select/blob/main/assets/antd/default.jpg)

`AntdDynamicSelect` extends all Ant Design `Select` props and adds `dynamicConfig`.

## Value

- **Single:** `string | number | null` (the `option.template.value` field, e.g. `id`)
- **Multiple:** `mode="multiple"` → array of ids
- Supports Ant Design `labelInValue`

## dynamicConfig

Shared across all variants. See [Dynamic config properties](https://github.com/zealamic/react-dynamic-select/blob/main/README.md#dynamic-config-properties) for the full property reference.

`search.inputSearchMenuProps` accepts Ant Design `Input` props.

## Search

**Menu search** (default): search input inside the dropdown.

**Inline search:** set `search.placement` to `SEARCH_PLACEMENT.INLINE` and enable `showSearch`:

```tsx
<AntdDynamicSelect
  showSearch
  allowClear
  dynamicConfig={{
    ...userListConfig,
    search: { placement: SEARCH_PLACEMENT.INLINE },
  }}
/>
```

![Inline search](https://github.com/zealamic/react-dynamic-select/blob/main/assets/antd/inline-search.jpg)

## Load more

```tsx
dynamicConfig={{ ...config, loadMore: { type: LOAD_MORE_TYPE.SCROLL } }}
dynamicConfig={{ ...config, loadMore: { type: LOAD_MORE_TYPE.CLICK } }}
```

| Scroll | Click |
| :---: | :---: |
| ![Load more scroll](https://github.com/zealamic/react-dynamic-select/blob/main/assets/antd/load-more-scroll.jpg) | ![Load more click](https://github.com/zealamic/react-dynamic-select/blob/main/assets/antd/load-more-click.jpg) |

## Add button

Render a create / add action in the dropdown footer (left or right of total count and load more). Set `placement` to `"start"` or `"end"`.

```tsx
<AntdDynamicSelect
  showSearch
  allowClear
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
| ![Add button start](https://github.com/zealamic/react-dynamic-select/blob/main/assets/antd/add-button-start.jpg) | ![Add button end](https://github.com/zealamic/react-dynamic-select/blob/main/assets/antd/add-button-end.jpg) |

| Property | Description |
|---|---|
| `label` | Button text |
| `icon` | Custom icon (`ReactNode`). Defaults to a built-in plus icon |
| `placement` | `"start"` — left side of footer; `"end"` — right side |
| `onClick` | Click handler |
| `disabled` | Disable the button |

The footer is shown when `total`, `loadMore`, or `add` is configured. See [add](https://github.com/zealamic/react-dynamic-select/blob/main/README.md#dynamic-config-properties) in the property reference.

## Edit mode

Use `currentData` when the form already has a value but the option is not in the fetched list:

```tsx
<AntdDynamicSelect
  defaultValue={presetUser.id}
  showSearch
  allowClear
  dynamicConfig={{
    ...userListConfig,
    currentData: presetUser, // or an array for multiple
  }}
/>
```

## Custom option label

Use a React component in `option.template.label` to render rich rows (name + email, avatars, badges, etc.):

```tsx
<AntdDynamicSelect
  showSearch
  allowClear
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

![Custom option label](https://github.com/zealamic/react-dynamic-select/blob/main/assets/antd/custom-option.jpg)

Custom labels render in the dropdown and in the selected value display. String helpers such as `getOptionLabel` fall back to `value` when the label is not plain text.

## Multiple selection

```tsx
<AntdDynamicSelect
  mode="multiple"
  showSearch
  allowClear
  dynamicConfig={userListConfig}
/>
```

![Multiple](https://github.com/zealamic/react-dynamic-select/blob/main/assets/antd/multiple.jpg)

## React Hook Form

```tsx
import { Controller, useForm } from "react-hook-form";
import { AntdDynamicSelect } from "@zealamic/react-dynamic-select/antd";

type FormValues = { user: number | null };

function Form() {
  const { control } = useForm<FormValues>({ defaultValues: { user: null } });

  return (
    <Controller
      name="user"
      control={control}
      rules={{ required: "Please select a user" }}
      render={({ field }) => (
        <AntdDynamicSelect
          showSearch
          allowClear
          style={{ width: "100%" }}
          dynamicConfig={userListConfig}
          value={field.value}
          onChange={(value) => field.onChange(value ?? null)}
        />
      )}
    />
  );
}
```

## Hook `useAntdDynamicSelect`

Use when building a custom UI on top of Ant Design `Select`:

```tsx
const selectProps = useAntdDynamicSelect(props);

// Also returns: options, loading, totalNumber, isLoadingMore,
// canLoadMore, loadMoreConfig, handleOpenChange, handlePopupScroll,
// handleLoadMoreClick, searchValue, handleInlineSearch, handleMenuSearchChange
```

## Notes

- For **inline search**, `showSearch={true}` is required.
- Closing the dropdown resets the search value and re-fetches the first page (if a search was active).
- `listHeight` defaults to `200` when not provided.
- Fetch runs only on the first open (unless `trigger: FETCH_TRIGGER.MOUNT`).
