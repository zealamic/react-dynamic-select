# @zealamic/react-dynamic-select

Async select components for React — fetch options from an API, search, paginate, and load more. Works with **Ant Design**, **MUI**, **Base UI**, or your own UI via headless hooks.

## Features

- **Async data** — fetch options on open or mount, with configurable API params
- **Search** — inline (main input) or menu (dropdown input), with debounce
- **Load more** — scroll-to-bottom or click-to-load pagination
- **Multiple selection** — single and multi-select support
- **Pre-loaded values** — display selected items in edit mode via `currentData`
- **Type-safe** — full TypeScript generics for API response, params, and data models

## Preview

Same `dynamicConfig` across UI libraries:

| Ant Design | MUI | Base UI |
| :---: | :---: | :---: |
| ![Ant Design default](https://github.com/zealamic/react-dynamic-select/blob/main/assets/antd/default.jpg) | ![MUI default](https://github.com/zealamic/react-dynamic-select/blob/main/assets/mui/default.jpg) | ![Base UI default](https://github.com/zealamic/react-dynamic-select/blob/main/assets/base-ui/default.jpg) |

More screenshots and usage details in the [documentation](#documentation).

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

| Import                                   | Use case                                    |
| ---------------------------------------- | ------------------------------------------- |
| `@zealamic/react-dynamic-select/antd`    | Ant Design `Select` wrapper                 |
| `@zealamic/react-dynamic-select/mui`     | MUI `Autocomplete` wrapper                  |
| `@zealamic/react-dynamic-select/base-ui` | Base UI `Combobox` wrapper (headless slots) |
| `@zealamic/react-dynamic-select`         | Headless hooks and utilities                |

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
/>;
```

All variants share the same `dynamicConfig` shape. Pass only the fields that differ from the defaults.

## Dynamic config properties

`dynamicConfig` is the shared prop that wires async behavior into every variant. It is deep-merged with `defaultDynamicSelectConfig` — you only need to pass fields that differ from the defaults.

Full reference: [ANTD.md](./docs/ANTD.md#dynamicconfig).

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| **api** | API fetch configuration | `object` | — |
| **api.fetch** | Function that loads options from the server | `(params) => Promise<ApiResponse>` | — |
| **api.params** | Default query sent on every request (`page`, `pageSize` or `limit`, `search`) | `ApiParams & PaginationParams` | `{ page: 1, pageSize: 10, search: "" }` |
| **api.trigger** | When to run the first fetch | `"open"` \| `"mount"` | `"open"` |
| **api.onSuccess** | Called after a successful fetch | `(data: ApiResponse) => void` | — |
| **api.onError** | Called when a fetch fails | `(error: Error) => void` | — |
| **list** | Maps the options array from the API response | `object` | — |
| **list.path** | Dot path to the list in the response, e.g. `"data"` or `"result.items"` | `string` | `"list"` |
| **total** | Maps the total record count from the response | `object` | — |
| **total.path** | Dot path to the total count, e.g. `"total"` | `string` | `"total"` |
| **total.label** | Label shown in the dropdown footer | `string` | `"Total"` |
| **option** | Maps each API item to a select option | `object` | — |
| **option.template.label** | Label field or template, supports `"{firstName} {lastName}"` | `string` | `"label"` |
| **option.template.value** | Value field | `string` | `"value"` |
| **currentData** | Pre-loaded item(s) for edit mode when the selected value is not in the fetched list yet | `DataType` \| `DataType[]` | — |
| **search** | Search input configuration | `object` | — |
| **search.placement** | Where the search input is rendered | `"menu"` \| `"inline"` | `"menu"` |
| **search.debounce** | Debounce delay before triggering a search fetch (ms) | `number` | `500` |
| **search.inputSearchMenuProps** | Props for the menu search input (Ant Design `Input`, MUI `TextField`, or Base UI `ComboboxInput`) | `InputSearchProps` | `{ placeholder: "Search..." }` |
| **loadMore** | Enable pagination / load more. `true` enables click mode with defaults | `boolean` \| `object` | `{ type: "click", threshold: 100, distance: 100, debounce: 100 }` |
| **loadMore.type** | How to load the next page | `"click"` \| `"scroll"` | `"click"` |
| **loadMore.label** | Load-more button text | `string` | `"Load More"` |
| **loadMore.loadingLabel** | Text shown while loading more | `string` | `"Loading..."` |
| **loadMore.threshold** | Scroll threshold (px) to trigger load more | `number` | `100` |
| **loadMore.distance** | Distance from bottom (px) to trigger scroll load more | `number` | `100` |
| **loadMore.debounce** | Debounce delay for scroll load more (ms) | `number` | `100` |
| **loadMore.afterFetch** | Hook called after each successful fetch | `(data: ApiResponse) => Promise<void>` | — |

## Documentation

| Guide                                                                                               | Description                                   |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [Ant Design](https://github.com/zealamic/react-dynamic-select/blob/main/docs/ANTD.md)               | `AntdDynamicSelect`, `useAntdDynamicSelect`   |
| [MUI](https://github.com/zealamic/react-dynamic-select/blob/main/docs/MUI.md)                       | `MuiDynamicSelect`, `useMuiDynamicSelect`     |
| [Base UI](https://github.com/zealamic/react-dynamic-select/blob/main/docs/BASE-UI.md)               | `BaseUiDynamicSelect`, slot components, icons |
| [Build your own](https://github.com/zealamic/react-dynamic-select/blob/main/docs/BUILD_YOUR_OWN.md) | Headless hooks, utilities, custom UI          |

## Development

```bash
pnpm install
pnpm run build      # build library
pnpm run dev        # watch mode
pnpm run test       # run tests
pnpm run storybook  # interactive examples
```

---

## License

MIT

---

> _If this library saves you time building async selects, thanks for using it._
