# @zealamic/react-dynamic-select

Async select components for React — fetch options from an API, search, paginate, and load more. Works with **Ant Design**, **MUI**, **Chakra UI**, **Base UI** (styled defaults included), or your own UI via headless hooks.

![React Dynamic Select](https://github.com/zealamic/react-dynamic-select/blob/main/assets/cover-photo.jpg)

## Features

- **Async data** — fetch options on open or mount, with configurable API params
- **Search** — inline (main input) or menu (dropdown input), with debounce
- **Load more** — scroll-to-bottom or click-to-load pagination
- **Add button** — optional create action in the dropdown footer
- **Custom option labels** — string templates or React components per row
- **Multiple selection** — single and multi-select support with dismissible chips
- **Pre-loaded values** — display selected items in edit mode via `currentData`
- **Base UI defaults** — styled Combobox UI out of the box; override slots when needed
- **Type-safe** — full TypeScript generics for API response, params, and data models

## Preview

Same `dynamicConfig` across UI libraries:

|                                                Ant Design                                                 |                                                MUI                                                |                                                  Base UI                                                  |                                                 Chakra UI                                                  |
| :-------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------: |
| ![Ant Design default](https://github.com/zealamic/react-dynamic-select/blob/main/assets/antd/default.jpg) | ![MUI default](https://github.com/zealamic/react-dynamic-select/blob/main/assets/mui/default.jpg) | ![Base UI default](https://github.com/zealamic/react-dynamic-select/blob/main/assets/base-ui/default.jpg) | ![Chakra UI default](https://github.com/zealamic/react-dynamic-select/blob/main/assets/chakra/default.jpg) |

**Custom option label** — render each row with a React component (name + email, avatar, etc.):

|                                                      Ant Design                                                       |                                                      MUI                                                      |                                                        Base UI                                                        |                                                       Chakra UI                                                        |
| :-------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------: |
| ![Ant Design custom option](https://github.com/zealamic/react-dynamic-select/blob/main/assets/antd/custom-option.jpg) | ![MUI custom option](https://github.com/zealamic/react-dynamic-select/blob/main/assets/mui/custom-option.jpg) | ![Base UI custom option](https://github.com/zealamic/react-dynamic-select/blob/main/assets/base-ui/custom-option.jpg) | ![Chakra UI custom option](https://github.com/zealamic/react-dynamic-select/blob/main/assets/chakra/custom-option.jpg) |

More screenshots and usage details in the [documentation](#documentation).

## Installation

**npm**

```bash
npm install @zealamic/react-dynamic-select
```

**yarn**

```bash
yarn add @zealamic/react-dynamic-select
```

**pnpm**

```bash
pnpm add @zealamic/react-dynamic-select
```

Also install the UI library for your entry point. Each guide has **npm**, **yarn**, and **pnpm** commands — see [Documentation](#documentation) or the table below.

Peer dependencies: `react >= 19`. UI libraries are optional.

## Documentation

| Guide                                                                                               | Description                                                   |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [Ant Design](https://github.com/zealamic/react-dynamic-select/blob/main/docs/ANTD.md)               | `AntdDynamicSelect`, `useAntdDynamicSelect`                   |
| [MUI](https://github.com/zealamic/react-dynamic-select/blob/main/docs/MUI.md)                       | `MuiDynamicSelect`, `useMuiDynamicSelect`                     |
| [Chakra UI](https://github.com/zealamic/react-dynamic-select/blob/main/docs/CHAKRA.md)              | `ChakraDynamicSelect`, `useChakraDynamicSelect`               |
| [Base UI](https://github.com/zealamic/react-dynamic-select/blob/main/docs/BASE-UI.md)               | `BaseUiDynamicSelect`, `createDefaultBaseUiComponents`, slots |
| [Build your own](https://github.com/zealamic/react-dynamic-select/blob/main/docs/BUILD_YOUR_OWN.md) | Headless hooks, utilities, custom UI                          |

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

**Chakra UI** — wrap your app with `ChakraProvider`, then use the same config:

```tsx
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ChakraDynamicSelect } from "@zealamic/react-dynamic-select/chakra";

<ChakraProvider value={defaultSystem}>
  <ChakraDynamicSelect
    placeholder="Select a user"
    width="320px"
    dynamicConfig={userListConfig}
  />
</ChakraProvider>;
```

**Base UI** works without a `components` prop — defaults are styled and ready to use. Customize with `createDefaultBaseUiComponents()`:

```tsx
import { BaseUiDynamicSelect } from "@zealamic/react-dynamic-select/base-ui";

<BaseUiDynamicSelect
  placeholder="Select a user"
  listHeight={200}
  dynamicConfig={userListConfig}
/>;
```

**Custom option label** — use a React component instead of a string field or template:

```tsx
option: {
  template: {
    label: ({ data }) => (
      <span>
        {data.firstName} {data.lastName}
      </span>
    ),
    value: "id",
  },
}
```

The resolved `label` is a `ReactNode` in the option list. String-based helpers such as `getOptionLabel` fall back to `value` when the label is not plain text.

## Dynamic config properties

`dynamicConfig` is the shared prop that wires async behavior into every variant. It is deep-merged with `defaultDynamicSelectConfig` — you only need to pass fields that differ from the defaults.

| Property                        | Description                                                                                                  | Type                                   | Default                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ----------------------------------------------------------------- |
| **api**                         | API fetch configuration                                                                                      | `object`                               | —                                                                 |
| **api.fetch**                   | Function that loads options from the server                                                                  | `(params) => Promise<ApiResponse>`     | —                                                                 |
| **api.params**                  | Default query sent on every request (`page`, `pageSize` or `limit`, `search`)                                | `ApiParams & PaginationParams`         | `{ page: 1, pageSize: 10, search: "" }`                           |
| **api.trigger**                 | When to run the first fetch                                                                                  | `"open"` \| `"mount"`                  | `"open"`                                                          |
| **api.onSuccess**               | Called after a successful fetch                                                                              | `(data: ApiResponse) => void`          | —                                                                 |
| **api.onError**                 | Called when a fetch fails                                                                                    | `(error: Error) => void`               | —                                                                 |
| **list**                        | Maps the options array from the API response                                                                 | `object`                               | —                                                                 |
| **list.path**                   | Dot path to the list in the response, e.g. `"data"` or `"result.items"`                                      | `string`                               | `"list"`                                                          |
| **total**                       | Maps the total record count from the response                                                                | `object`                               | —                                                                 |
| **total.path**                  | Dot path to the total count, e.g. `"total"`                                                                  | `string`                               | `"total"`                                                         |
| **total.label**                 | Label shown in the dropdown footer                                                                           | `string`                               | `"Total"`                                                         |
| **option**                      | Maps each API item to a select option                                                                        | `object`                               | —                                                                 |
| **option.template.label**       | Label field, placeholder template (`"{firstName} {lastName}"`), or React component `({ data }) => ReactNode` | `string` \| `FC<{ data: DataType }>`   | `"label"`                                                         |
| **option.template.value**       | Value field                                                                                                  | `string`                               | `"value"`                                                         |
| **currentData**                 | Pre-loaded item(s) for edit mode when the selected value is not in the fetched list yet                      | `DataType` \| `DataType[]`             | —                                                                 |
| **search**                      | Search input configuration                                                                                   | `object`                               | —                                                                 |
| **search.placement**            | Where the search input is rendered                                                                           | `"menu"` \| `"inline"`                 | `"menu"`                                                          |
| **search.debounce**             | Debounce delay before triggering a search fetch (ms)                                                         | `number`                               | `500`                                                             |
| **search.inputSearchMenuProps** | Props for the menu search input (Ant Design `Input`, MUI `TextField`, Chakra/Base UI `ComboboxInput`)        | `InputSearchProps`                     | `{ placeholder: "Search..." }`                                    |
| **loadMore**                    | Enable pagination / load more. `true` enables click mode with defaults                                       | `boolean` \| `object`                  | `{ type: "click", threshold: 100, distance: 100, debounce: 100 }` |
| **loadMore.type**               | How to load the next page                                                                                    | `"click"` \| `"scroll"`                | `"click"`                                                         |
| **loadMore.label**              | Load-more button text                                                                                        | `string`                               | `"Load More"`                                                     |
| **loadMore.loadingLabel**       | Text shown while loading more                                                                                | `string`                               | `"Loading..."`                                                    |
| **loadMore.threshold**          | Scroll threshold (px) to trigger load more                                                                   | `number`                               | `100`                                                             |
| **loadMore.distance**           | Distance from bottom (px) to trigger scroll load more                                                        | `number`                               | `100`                                                             |
| **loadMore.debounce**           | Debounce delay for scroll load more (ms)                                                                     | `number`                               | `100`                                                             |
| **loadMore.afterFetch**         | Hook called after each successful fetch                                                                      | `(data: ApiResponse) => Promise<void>` | —                                                                 |
| **add**                         | Add button in the dropdown footer (e.g. create a new record)                                                 | `object`                               | —                                                                 |
| **add.label**                   | Button label text                                                                                            | `string`                               | —                                                                 |
| **add.icon**                    | Custom icon before the label                                                                                 | `ReactNode`                            | built-in plus icon                                                |
| **add.placement**               | Footer position of the add button                                                                            | `"start"` \| `"end"`                   | —                                                                 |
| **add.onClick**                 | Called when the add button is clicked                                                                        | `() => void`                           | —                                                                 |
| **add.disabled**                | Disables the add button                                                                                      | `boolean`                              | `false`                                                           |

---

## License

MIT

---

> _If this library saves you time building async selects, thanks for using it._
