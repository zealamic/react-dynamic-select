export const SEARCH_PLACEMENT = {
  INLINE: "inline",
  MENU: "menu",
} as const;

export const ADD_PLACEMENT = {
  START: "start",
  END: "end",
} as const;

export const INVALID_VALUE = "" as const;
export const PLACEHOLDER_PATTERN = /\{([^}]+)\}/g;

export const LOAD_MORE_TYPE = {
  CLICK: "click",
  SCROLL: "scroll",
} as const;

export const FETCH_TRIGGER = {
  MOUNT: "mount",
  OPEN: "open",
} as const;
