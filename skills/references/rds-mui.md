# MUI — MuiDynamicSelect

Entry: `@zealamic/react-dynamic-select/mui`

## Install

```bash
npm install @zealamic/react-dynamic-select @mui/material @emotion/react @emotion/styled
```

Peers: `react >= 19`, `@mui/material >= 5`.

## Import

```tsx
import {
  MuiDynamicSelect,
  useMuiDynamicSelect,
  SEARCH_PLACEMENT,
  LOAD_MORE_TYPE,
  FETCH_TRIGGER,
} from "@zealamic/react-dynamic-select/mui";
import type {
  MuiDynamicSelectConfig,
  MuiDynamicSelectValue,
} from "@zealamic/react-dynamic-select/mui";
```

## Quick start

```tsx
<MuiDynamicSelect
  placeholder="Select a user"
  sx={{ width: 320 }}
  dynamicConfig={userListConfig}
/>
```

Wraps MUI `Autocomplete` with async layer.

## Value — MuiDynamicSelectValue

| Mode | Type |
|---|---|
| Single | `string \| number \| null` |
| Multiple | `multiple` → `Array<string \| number>` |

```tsx
const [userId, setUserId] = useState<number | null>(null);

<MuiDynamicSelect
  value={userId}
  onChange={(_e, value) => {
    setUserId(value == null || Array.isArray(value) ? null : value);
  }}
  dynamicConfig={userListConfig}
/>
```

## Props NOT to pass (managed internally)

`options`, `value`/`defaultValue`/`onChange` (use library types), `filterOptions`, `renderInput` (unless overriding via supported `renderInput` prop).

Client-side filtering disabled — server provides filtered list.

## Search

```tsx
dynamicConfig={{
  ...config,
  search: { placement: SEARCH_PLACEMENT.INLINE, debounce: 300 },
}}
```

## Multiple

```tsx
<MuiDynamicSelect multiple placeholder="Select users" dynamicConfig={config} />
```

Custom chip display: `renderValue`.

## Total label

Keep `total.path` for load more. Hide the footer count with `hidden: true`:

```tsx
total: { path: "total", hidden: true }
```

Hide the entire footer (total, load more, add):

```tsx
isMenuFooterVisible: false
```

## Custom option label

React component in `option.template.label`. Single mode overlays custom label on input; multiple uses chips via `getOptionLabelNode`.

## Messages

Native props win: `noOptionsText`, `loadingText`. Fallback: `dynamicConfig.messages`.

## Additional props

| Prop | Purpose |
|---|---|
| `placeholder`, `label` | TextField |
| `listHeight` | Listbox height (default 200) |
| `helperText`, `error`, `required`, `name` | TextField |
| `renderInput` | Customize TextField |
| `renderValue` | Multiple-mode chips |

## React Hook Form

```tsx
<Controller
  name="user"
  control={control}
  render={({ field }) => (
    <MuiDynamicSelect
      sx={{ width: "100%" }}
      dynamicConfig={userListConfig}
      value={field.value}
      onChange={(_e, value) => {
        field.onChange(value == null || Array.isArray(value) ? null : value);
      }}
    />
  )}
/>
```

## Hook: useMuiDynamicSelect

For custom Autocomplete UI. Returns `isOpen`, `handleOpen`, `handleClose`, scroll/load-more handlers, etc.

## Notes

- Loading: `CircularProgress` in input + popup overlay.
- `search.inputSearchMenuProps` → MUI `TextField` props.
- Search inputs are disabled while load more is in progress.

See [dynamicConfig](rds-dynamic-config.md).
