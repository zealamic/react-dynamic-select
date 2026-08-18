# Chakra UI — ChakraDynamicSelect

Entry: `@zealamic/react-dynamic-select/chakra`

## Install

```bash
npm install @zealamic/react-dynamic-select @chakra-ui/react
```

Peers: `react >= 19`, `@chakra-ui/react >= 3`.

## Provider (required)

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
import type {
  ChakraDynamicSelectConfig,
  ChakraDynamicSelectValue,
} from "@zealamic/react-dynamic-select/chakra";
```

## Quick start

```tsx
<ChakraDynamicSelect
  placeholder="Select a user"
  width="320px"
  dynamicConfig={userListConfig}
/>
```

Extends Chakra `Combobox.Root` props. Collection and value wiring are internal.

## Value — ChakraDynamicSelectValue

| Mode | Type |
|---|---|
| Single | `string \| number \| null` |
| Multiple | `multiple` → `Array<string \| number>` |

```tsx
<ChakraDynamicSelect
  value={userId}
  onChange={(value) => {
    setUserId(value == null || Array.isArray(value) ? null : value);
  }}
  dynamicConfig={userListConfig}
/>
```

- `onChange` — primitive values (like MUI/Antd)
- `onValueChange` — Chakra `ComboboxValueChangeDetails`

## Search

- **Menu** (default): main input read-only, opens menu on click.
- **Inline**: `search.placement: SEARCH_PLACEMENT.INLINE`

## Multiple

Dismissible `Tag` chips with per-chip remove (`Tag.EndElement` + `Tag.CloseTrigger`).

```tsx
<ChakraDynamicSelect multiple dynamicConfig={userListConfig} />
```

## Custom option label

Single: overlay on input. Multiple: custom labels in chips and dropdown.

## Additional props

| Prop | Purpose |
|---|---|
| `placeholder`, `label` | Combobox label/input |
| `listHeight` | Scroll area (default 200) |
| `open`, `onOpenChange` | Controlled open state |
| Other `Combobox.Root` props | Passthrough (except collection, value handlers) |

## Messages

`dynamicConfig.messages` → `Combobox.Empty`. Initial load shows spinner in indicator group; dropdown opens after first page ready.

## React Hook Form

```tsx
<Controller
  name="user"
  control={control}
  render={({ field }) => (
    <ChakraDynamicSelect
      width="100%"
      dynamicConfig={userListConfig}
      value={field.value}
      onChange={(value) => {
        field.onChange(value == null || Array.isArray(value) ? null : value);
      }}
    />
  )}
/>
```

## Hook: useChakraDynamicSelect

Build custom Combobox UI on top of shared fetch/search/load-more logic.

## Notes

- Requires Chakra v3 + `ChakraProvider`.
- Menu search: `autoFocus={false}` on root; menu input gets focus when open.
- Closing resets search when active.
- `search.inputSearchMenuProps` → Chakra `ComboboxInput` props.

See [dynamicConfig](rds-dynamic-config.md).
