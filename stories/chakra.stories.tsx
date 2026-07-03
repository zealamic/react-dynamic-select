import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import type {
  ChakraDynamicSelectConfig,
  ChakraDynamicSelectProps,
} from "../src/chakra";
import { ChakraDynamicSelect } from "../src/chakra";
import {
  ADD_PLACEMENT,
  LOAD_MORE_TYPE,
  SEARCH_PLACEMENT,
} from "../src/lib/constants";
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
} satisfies ChakraDynamicSelectConfig<
  (typeof MOCK_USER_LIST)[number],
  UserListResult,
  UserListParams
>;

function ChakraUserSelect(
  props: ChakraDynamicSelectProps<
    (typeof MOCK_USER_LIST)[number],
    UserListResult,
    UserListParams
  >,
) {
  return <ChakraDynamicSelect {...props} />;
}

const meta = {
  title: "Chakra/DynamicSelect",
  component: ChakraUserSelect,
  decorators: [
    (Story) => (
      <ChakraProvider value={defaultSystem}>
        <Story />
      </ChakraProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChakraUserSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Select a user",
    width: "320px",
    dynamicConfig: userListConfig,
  },
};

export const Multiple: Story = {
  args: {
    placeholder: "Select users",
    width: "320px",
    multiple: true,
    dynamicConfig: userListConfig,
  },
};

export const LoadedData: Story = {
  args: {
    placeholder: "Select a user",
    width: "320px",
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
    width: "320px",
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
    width: "320px",
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
    placeholder: "Select users",
    width: "320px",
    multiple: true,
    dynamicConfig: {
      ...userListConfig,
      search: {
        placement: SEARCH_PLACEMENT.INLINE,
        debounce: 300,
      },
    },
  },
};

export const LoadMoreClick: Story = {
  args: {
    placeholder: "Select a user",
    width: "320px",
    dynamicConfig: {
      ...userListConfig,
      loadMore: {
        type: LOAD_MORE_TYPE.CLICK,
      },
    },
  },
};

export const AddButtonStart: Story = {
  args: {
    placeholder: "Select a user",
    width: "320px",
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

export const AddButtonEnd: Story = {
  args: {
    placeholder: "Select a user",
    width: "320px",
    dynamicConfig: {
      ...userListConfig,
      add: {
        placement: ADD_PLACEMENT.END,
        onClick: () => {
          alert("add");
        },
      },
    },
  },
};

export const LabelNode: Story = {
  args: {
    placeholder: "Select a user",
    width: "320px",
    dynamicConfig: {
      ...userListConfig,
      option: {
        template: {
          label: ({ data }) => (
            <div>
              <div>{data.fullName}</div>
              <div style={{ fontSize: 12, color: "gray" }}>{data.email}</div>
            </div>
          ),
          value: "id",
        },
      },
    },
  },
};

export const LabelNodeMultiple: Story = {
  args: {
    placeholder: "Select users",
    width: "320px",
    multiple: true,
    dynamicConfig: {
      ...userListConfig,
      option: {
        template: {
          label: ({ data }) => (
            <div>
              <div>{data.fullName}</div>
              <div style={{ fontSize: 12, color: "gray" }}>{data.email}</div>
            </div>
          ),
          value: "id",
        },
      },
    },
  },
};
