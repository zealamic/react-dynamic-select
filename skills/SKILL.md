---
name: react-dynamic-select
description: >-
  Integrate @zealamic/react-dynamic-select async select with Ant Design, MUI,
  Chakra UI, Base UI, or headless hooks. Use when building dynamic/async
  selects, dynamicConfig, search, load more, custom option labels, React Hook
  Form, or migrating between UI libraries.
---

# React Dynamic Select

Async select for React — fetch from API, search, paginate, load more. One shared `dynamicConfig` across UI adapters.

## Install skill

Copy this folder into Cursor skills:

```bash
# Project skill (shared with repo)
cp -r skills ~/.cursor/skills/react-dynamic-select

# Or from repo root into project
mkdir -p .cursor/skills && cp -r skills .cursor/skills/react-dynamic-select
```

Full docs: `docs/` in the package repo. Package: `@zealamic/react-dynamic-select`.

## Choose entry point

| UI library | Import | Value type |
|---|---|---|
| Ant Design | `@zealamic/react-dynamic-select/antd` | primitive id(s) |
| MUI | `@zealamic/react-dynamic-select/mui` | primitive id(s) |
| Chakra UI v3 | `@zealamic/react-dynamic-select/chakra` | primitive id(s) |
| Base UI | `@zealamic/react-dynamic-select/base-ui` | `ResolvedOption` object(s) |
| Custom UI | `@zealamic/react-dynamic-select` | you define |

Read the matching reference before implementing:

- [Ant Design](references/rds-antd.md)
- [MUI](references/rds-mui.md)
- [Chakra UI](references/rds-chakra.md)
- [Base UI](references/rds-base-ui.md)
- [Headless / build your own](references/rds-build-your-own.md)
- [Shared `dynamicConfig`](references/rds-dynamic-config.md)

## Minimal setup (all variants)

```tsx
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
};
```

Install package + UI peer. Only pass fields that differ from `defaultDynamicSelectConfig`.

## Agent workflow

1. **Identify UI library** → open the variant reference above.
2. **Define types** — `DataType`, `ApiResponse`, `ApiParams` (must include `search?: string`).
3. **Wire `dynamicConfig`** — map API response via `list.path`, `total.path`, `option.template`.
4. **Value model** — primitives (Antd/MUI/Chakra) vs `ResolvedOption` (Base UI). Do not mix APIs.
5. **Search** — default `SEARCH_PLACEMENT.MENU`; inline needs variant-specific flags (Antd: `showSearch`).
6. **Edit mode** — pass `currentData` when selected item may not be in fetched list yet.
7. **Total label** — keep `total.path` for load more; hide footer count with `total.hidden: true`.
8. **Menu footer** — hide the entire footer with `isMenuFooterVisible: false`.
9. **i18n / copy** — use `dynamicConfig.messages` or native props (`noOptionsText`, `notFoundContent`).

## Option template (string)

| Form | Example | Result |
|---|---|---|
| Field path | `label: "fullName"` | reads `item.fullName` |
| Dot path | `label: "profile.name"` | nested field |
| Placeholders | `label: "{firstName} {lastName}"` | combines fields |

`value` uses same path rules → stored id.

## Option template (React component)

```tsx
option: {
  template: {
    label: ({ data }) => <span>{data.fullName}</span>,
    value: "id",
  },
}
```

Use `getOptionLabel` / `getOptionLabelNode` for string vs ReactNode labels.

## Constants

```tsx
import {
  FETCH_TRIGGER,      // OPEN | MOUNT
  SEARCH_PLACEMENT,   // MENU | INLINE
  LOAD_MORE_TYPE,     // CLICK | SCROLL
} from "@zealamic/react-dynamic-select/<entry>";
```

## Common mistakes

- **Antd inline search** — requires `showSearch={true}` on the Select.
- **Chakra** — wrap app with `ChakraProvider` + `defaultSystem`.
- **Base UI value** — use `onValueChange`, not primitive `onChange`.
- **MUI** — do not pass `options`, `filterOptions`, or manage `renderInput` unless using `renderInput` override intentionally.
- **Closing dropdown** — search resets and re-fetches page 1 if search was active.
- **Messages** — MUI/Antd native props win over `dynamicConfig.messages` when both set.
- **Total hidden** — `total.hidden: true` hides the footer label only; `total.path` is still required for load more.
- **Footer hidden** — `isMenuFooterVisible: false` hides total, load more button, and add. Scroll load more still shows a small loading chip at the bottom-right of the menu.

## React Hook Form (primitives)

```tsx
<Controller
  name="userId"
  control={control}
  render={({ field }) => (
    <MuiDynamicSelect
      value={field.value}
      onChange={(_e, v) =>
        field.onChange(v == null || Array.isArray(v) ? null : v)
      }
      dynamicConfig={userListConfig}
    />
  )}
/>
```

Base UI: `value` is `ResolvedOption | null`, use `onValueChange`.

## Development (this repo)

```bash
pnpm install && pnpm run build && pnpm run storybook
```

Storybook stories: `stories/*.stories.tsx` per UI variant.
