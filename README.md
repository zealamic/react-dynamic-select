# @zealamic/react-dynamic-select

Async select components for React — fetch options from an API, search, paginate, and load more. Works with **Ant Design**, **MUI**, **Base UI**, or your own UI via headless hooks.

## Features

- **Async data** — fetch options on open or mount, with configurable API params
- **Search** — inline (main input) or menu (dropdown input), with debounce
- **Load more** — scroll-to-bottom or click-to-load pagination
- **Multiple selection** — single and multi-select support
- **Pre-loaded values** — display selected items in edit mode via `currentData`
- **Type-safe** — full TypeScript generics for API response, params, and data models

## Installation

```bash
pnpm add @zealamic/react-dynamic-select
```

Install only the UI library you need:

```bash
# Ant Design
pnpm add antd

# MUI
pnpm add @mui/material @emotion/react @emotion/styled

# Base UI
pnpm add @base-ui/react
```

Peer dependencies: `react >= 19`. UI libraries are optional — see entry points below.

## Entry points

| Import | Use case |
|---|---|
| `@zealamic/react-dynamic-select/antd` | Ant Design `Select` wrapper |
| `@zealamic/react-dynamic-select/mui` | MUI `Autocomplete` wrapper |
| `@zealamic/react-dynamic-select/base-ui` | Base UI `Combobox` wrapper (headless slots) |
| `@zealamic/react-dynamic-select` | Headless hooks and utilities |

## Quick example

```tsx
import { AntdDynamicSelect } from "@zealamic/react-dynamic-select/antd";

<AntdDynamicSelect
  placeholder="Select a user"
  showSearch
  allowClear
  dynamicConfig={{
    api: {
      fetch: fetchUsers,
      params: { page: 1, pageSize: 10, search: "" },
    },
    list: { path: "data" },
    total: { path: "total" },
    option: { template: { label: "fullName", value: "id" } },
  }}
/>
```

All variants share the same `dynamicConfig` shape. Pass only the fields that differ from the defaults.

## Documentation

| Guide | Description |
|---|---|
| [Ant Design](./docs/ANTD.md) | `AntdDynamicSelect`, `useAntdDynamicSelect` |
| [MUI](./docs/MUI.md) | `MuiDynamicSelect`, `useMuiDynamicSelect` |
| [Base UI](./docs/BASE-UI.md) | `BaseUiDynamicSelect`, slot components, icons |
| [Build your own](./docs/BUILD_YOUR_OWN.md) | Headless hooks, utilities, custom UI |

## Development

```bash
pnpm install
pnpm run build      # build library
pnpm run dev        # watch mode
pnpm run test       # run tests
pnpm run storybook  # interactive examples
```
