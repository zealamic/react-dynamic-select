import type { Meta, StoryObj } from "@storybook/react";
import type {
  AntdDynamicSelectConfig,
  AntdDynamicSelectProps,
} from "../src/antd";
import { AntdDynamicSelect } from "../src/antd";
import { LOAD_MORE_TYPE, SEARCH_PLACEMENT } from "../src/lib/constants";
import { getUserList, MOCK_USER_LIST } from "./mocks/user";

type UserListParams = Parameters<typeof getUserList>[0];
type UserListResult = Awaited<ReturnType<typeof getUserList>>;

const presetUser = MOCK_USER_LIST[14]; // id: 15
const presetUsers = [MOCK_USER_LIST[14], MOCK_USER_LIST[15]]; // id: 15, 16

const userListConfig = {
  api: {
    fetch: getUserList,
    params: {
      page: 1,
      pageSize: 10,
      search: "",
    },
  },
  list: {
    path: "data",
  },
  total: {
    path: "total",
  },
  option: {
    template: {
      label: "fullName",
      value: "id",
    },
  },
  loadMore: {
    type: LOAD_MORE_TYPE.SCROLL,
    threshold: 100,
    distance: 100,
    debounce: 100,
    afterFetch: async (data) => {
      console.log("afterFetch", data);
    },
  },
  search: {
    placement: SEARCH_PLACEMENT.MENU,
    inputSearchMenuProps: {
      placeholder: "Search user",
    },
  },
} satisfies AntdDynamicSelectConfig<
  (typeof MOCK_USER_LIST)[number],
  UserListResult,
  UserListParams
>;

function AntdUserSelect(
  props: AntdDynamicSelectProps<
    (typeof MOCK_USER_LIST)[number],
    UserListResult,
    UserListParams
  >,
) {
  return AntdDynamicSelect(props);
}

const meta = {
  title: "Ant Design/DynamicSelect",
  component: AntdUserSelect,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AntdUserSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Select a user",
    style: { width: 320 },
    allowClear: true,
    showSearch: true,
    dynamicConfig: userListConfig,
  },
};

export const Multiple: Story = {
  args: {
    placeholder: "Select users",
    style: { width: 320 },
    allowClear: true,
    showSearch: true,
    mode: "multiple",
    dynamicConfig: userListConfig,
  },
};

export const LoadedData: Story = {
  args: {
    placeholder: "Select a user",
    style: { width: 320 },
    allowClear: true,
    showSearch: true,
    dynamicConfig: {
      ...userListConfig,
      currentData: presetUser,
    },
    value: presetUser.id,
  },
};

export const LoadedDataMultiple: Story = {
  args: {
    placeholder: "Select users",
    style: { width: 320 },
    allowClear: true,
    showSearch: true,
    mode: "multiple",
    value: presetUsers.map((user) => user.id),
    dynamicConfig: {
      ...userListConfig,
      currentData: presetUsers,
    },
  },
};
