import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { AntdDynamicSelectConfig } from "../../../src/antd";
import { AntdDynamicSelect } from "../../../src/antd";
import { LOAD_MORE_TYPE, SEARCH_PLACEMENT } from "../../../src/lib/constants";
import { getUserList } from "../../mocks/user";
import styles from "../base-ui/base-ui.module.css";

type UserListParams = Parameters<typeof getUserList>[0];
type UserListResult = Awaited<ReturnType<typeof getUserList>>;
type UserModel = UserListResult["data"][number];

type HookFormValues = {
  user: number | null;
};

const defaultUserListConfig = {
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
  },
  search: {
    placement: SEARCH_PLACEMENT.MENU,
    inputSearchMenuProps: {
      placeholder: "Search user",
    },
  },
} satisfies AntdDynamicSelectConfig<UserModel, UserListResult, UserListParams>;

export type AntdHookFormStoryProps = {
  placeholder?: string;
  dynamicConfig?: AntdDynamicSelectConfig<
    UserModel,
    UserListResult,
    UserListParams
  >;
};

export function AntdHookFormStory({
  placeholder = "Select a user",
  dynamicConfig = defaultUserListConfig,
}: AntdHookFormStoryProps) {
  const [submittedValue, setSubmittedValue] = useState<HookFormValues | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<HookFormValues>({
    defaultValues: {
      user: null,
    },
  });

  const onSubmit = handleSubmit((values) => {
    setSubmittedValue(values);
  });

  return (
    <form className={styles.HookForm} onSubmit={onSubmit}>
      <Controller
        name="user"
        control={control}
        rules={{ required: "Please select a user" }}
        render={({ field }) => (
          <AntdDynamicSelect
            placeholder={placeholder}
            style={{ width: "100%" }}
            allowClear
            showSearch
            dynamicConfig={dynamicConfig}
            value={field.value}
            onChange={(value) => {
              field.onChange(value ?? null);
            }}
          />
        )}
      />

      {errors.user?.message && (
        <p className={styles.HookFormError}>{errors.user.message}</p>
      )}

      <button type="submit" className={styles.HookFormSubmit}>
        Submit
      </button>

      <pre className={styles.HookFormPreview}>
        {JSON.stringify(
          {
            watch: watch(),
            submitted: submittedValue,
          },
          null,
          2,
        )}
      </pre>
    </form>
  );
}
