import type { Meta, StoryObj } from "@storybook/react";
import { useMemo } from "react";
import type {
  BaseUiDynamicSelectConfig,
  BaseUiDynamicSelectProps,
} from "../src/base-ui";
import { BaseUiDynamicSelect } from "../src/base-ui";
import type { ResolvedOption } from "../src/general-types";
import {
  ADD_PLACEMENT,
  FETCH_TRIGGER,
  LOAD_MORE_TYPE,
  SEARCH_PLACEMENT,
} from "../src/lib/constants";
import { BaseUiHookFormStory } from "./components/base-ui/story-hook-form";
import { getUserList, MOCK_USER_LIST } from "./mocks/user";

type UserListParams = Parameters<typeof getUserList>[0];
type UserListResult = Awaited<ReturnType<typeof getUserList>>;
type UserModel = (typeof MOCK_USER_LIST)[number];

const presetUser = MOCK_USER_LIST[14];
const presetUsers = [MOCK_USER_LIST[14], MOCK_USER_LIST[15]];

const userListConfig = {
  api: {
    fetch: getUserList,
    trigger: FETCH_TRIGGER.OPEN,
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
} satisfies BaseUiDynamicSelectConfig<
  UserModel,
  UserListResult,
  UserListParams
>;

function resolveStoryDynamicConfig(
  dynamicConfig?: Partial<
    BaseUiDynamicSelectConfig<UserModel, UserListResult, UserListParams>
  >,
): BaseUiDynamicSelectConfig<UserModel, UserListResult, UserListParams> {
  return {
    ...userListConfig,
    ...dynamicConfig,
    api: {
      ...userListConfig.api,
      ...dynamicConfig?.api,
      fetch: getUserList,
      params: {
        ...userListConfig.api.params,
        ...dynamicConfig?.api?.params,
      },
    },
    list: { ...userListConfig.list, ...dynamicConfig?.list },
    total: { ...userListConfig.total, ...dynamicConfig?.total },
    option: {
      ...userListConfig.option,
      ...dynamicConfig?.option,
      template: {
        ...userListConfig.option?.template,
        ...dynamicConfig?.option?.template,
      },
    },
    search: {
      ...userListConfig.search,
      ...dynamicConfig?.search,
      inputSearchMenuProps: {
        ...userListConfig.search?.inputSearchMenuProps,
        ...dynamicConfig?.search?.inputSearchMenuProps,
      },
    },
    loadMore: dynamicConfig?.loadMore
      ? {
          ...(userListConfig.loadMore ?? {}),
          ...(dynamicConfig.loadMore as NonNullable<
            typeof userListConfig.loadMore
          >),
          afterFetch: userListConfig.loadMore?.afterFetch,
        }
      : userListConfig.loadMore,
    currentData: dynamicConfig?.currentData,
  };
}

function toResolvedOption(user: UserModel): ResolvedOption {
  return {
    label: user.fullName,
    value: user.id,
  };
}

type BaseUiUserSelectProps = Omit<
  BaseUiDynamicSelectProps<UserModel, UserListResult, UserListParams, boolean>,
  "dynamicConfig"
> & {
  dynamicConfig?: Partial<
    BaseUiDynamicSelectConfig<UserModel, UserListResult, UserListParams>
  >;
};

function BaseUiUserSelect({
  multiple = false,
  dynamicConfig,
  ...props
}: BaseUiUserSelectProps) {
  const resolvedDynamicConfig = useMemo(
    () => resolveStoryDynamicConfig(dynamicConfig),
    [dynamicConfig],
  );

  return (
    <BaseUiDynamicSelect
      {...props}
      multiple={multiple}
      dynamicConfig={resolvedDynamicConfig}
      listHeight={200}
    />
  );
}

const meta = {
  title: "Base UI/DynamicSelect",
  component: BaseUiUserSelect,
  parameters: {
    layout: "centered",
    controls: {
      exclude: ["dynamicConfig"],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BaseUiUserSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Select a user",
  },
};

export const Multiple: Story = {
  args: {
    placeholder: "Select users",
    multiple: true,
  },
};

export const LoadedData: Story = {
  args: {
    placeholder: "Select a user",
    dynamicConfig: {
      currentData: presetUser,
    },
    defaultValue: toResolvedOption(presetUser),
  },
};

export const LoadedDataMultiple: Story = {
  args: {
    placeholder: "Select users",
    multiple: true,
    defaultValue: presetUsers.map(toResolvedOption),
    dynamicConfig: {
      currentData: presetUsers,
    },
  },
};

export const InlineSearch: Story = {
  args: {
    placeholder: "Select a user",
    dynamicConfig: {
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
    multiple: true,
    dynamicConfig: {
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
    dynamicConfig: {
      loadMore: {
        type: LOAD_MORE_TYPE.CLICK,
      },
    },
  },
};

export const AddButton: Story = {
  args: {
    placeholder: "Select a user",
    dynamicConfig: {
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
  render: () => <BaseUiHookFormStory />,
  parameters: {
    controls: { disable: true },
  },
};
