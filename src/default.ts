import type { DynamicSelectConfig } from "@/general-types";

import {
  FETCH_TRIGGER,
  LOAD_MORE_TYPE,
  SEARCH_PLACEMENT,
} from "@/lib/constants";

export const defaultDynamicSelectConfig: DynamicSelectConfig = {
  api: {
    params: {
      page: 1,
      pageSize: 10,
      search: "",
    },
    trigger: FETCH_TRIGGER.OPEN,
  },
  total: {
    path: "total",
    label: "Total",
  },
  list: {
    path: "list",
  },
  option: {
    template: {
      label: "label",
      value: "value",
    },
  },
  search: {
    placement: SEARCH_PLACEMENT.MENU,
    inputSearchMenuProps: {
      placeholder: "Search...",
    },
    debounce: 500,
  },
  loadMore: {
    type: LOAD_MORE_TYPE.CLICK,
    threshold: 100,
    distance: 100,
    debounce: 100,
  },
};
