import type { Meta, StoryObj } from "@storybook/react";
import {
  ADD_PLACEMENT,
  LOAD_MORE_TYPE,
  SEARCH_PLACEMENT,
} from "../src/lib/constants";
import type { MuiDynamicSelectConfig, MuiDynamicSelectProps } from "../src/mui";
import { MuiDynamicSelect } from "../src/mui";
import { MuiHookFormStory } from "./components/mui/story-hook-form";
import { getUserList, MOCK_USER_LIST } from "./mocks/user";

type UserListParams = Parameters<typeof getUserList>[0];
type UserListResult = Awaited<ReturnType<typeof getUserList>>;

const presetUser = MOCK_USER_LIST[14];
const presetUsers = [MOCK_USER_LIST[14], MOCK_USER_LIST[15]];

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
} satisfies MuiDynamicSelectConfig<
  (typeof MOCK_USER_LIST)[number],
  UserListResult,
  UserListParams
>;

function MuiUserSelect(
  props: MuiDynamicSelectProps<
    (typeof MOCK_USER_LIST)[number],
    UserListResult,
    UserListParams
  >,
) {
  return MuiDynamicSelect(props);
}

const meta = {
  title: "MUI/DynamicSelect",
  component: MuiUserSelect,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MuiUserSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Select a user",
    sx: { width: 320 },
    dynamicConfig: userListConfig,
  },
};

export const Multiple: Story = {
  args: {
    placeholder: "Select users",
    sx: { width: 320 },
    multiple: true,
    dynamicConfig: userListConfig,
  },
};

export const LoadedData: Story = {
  args: {
    placeholder: "Select a user",
    sx: { width: 320 },
    dynamicConfig: {
      ...userListConfig,
      currentData: presetUser,
    },
    defaultValue: presetUser.id,
  },
};

export const LoadedDataMultiple: Story = {
  args: {
    placeholder: "Select users",
    sx: { width: 320 },
    multiple: true,
    defaultValue: presetUsers.map((user) => user.id),
    dynamicConfig: {
      ...userListConfig,
      currentData: presetUsers,
    },
  },
};

export const InlineSearch: Story = {
  args: {
    placeholder: "Select a user",
    sx: { width: 320 },
    dynamicConfig: {
      ...userListConfig,
      search: {
        placement: SEARCH_PLACEMENT.INLINE,
        debounce: 300,
      },
    },
  },
};

export const InlineSearchMultiple: Story = {
  args: {
    placeholder: "Select a user",
    sx: { width: 320 },
    dynamicConfig: {
      ...userListConfig,
      search: {
        placement: SEARCH_PLACEMENT.INLINE,
        debounce: 300,
      },
    },
    multiple: true,
  },
};

export const LoadMoreClick: Story = {
  args: {
    placeholder: "Select a user",
    sx: { width: 320 },
    dynamicConfig: {
      ...userListConfig,
      loadMore: {
        type: LOAD_MORE_TYPE.CLICK,
      },
    },
  },
};

export const AddButton: Story = {
  args: {
    placeholder: "Select a user",
    sx: { width: 320 },
    dynamicConfig: {
      ...userListConfig,
      add: {
        placement: ADD_PLACEMENT.START,
        onClick: () => {
          alert("add");
        },
      },
    },
  },
};

export const HookForm: Story = {
  render: () => <MuiHookFormStory />,
  parameters: {
    controls: { disable: true },
  },
};
