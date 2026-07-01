import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LOAD_MORE_TYPE, SEARCH_PLACEMENT } from "../../../src/lib/constants";
import type { MuiDynamicSelectConfig } from "../../../src/mui";
import { MuiDynamicSelect } from "../../../src/mui";
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
} satisfies MuiDynamicSelectConfig<UserModel, UserListResult, UserListParams>;

export type MuiHookFormStoryProps = {
  placeholder?: string;
  dynamicConfig?: MuiDynamicSelectConfig<
    UserModel,
    UserListResult,
    UserListParams
  >;
};

export function MuiHookFormStory({
  placeholder = "Select a user",
  dynamicConfig = defaultUserListConfig,
}: MuiHookFormStoryProps) {
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
          <MuiDynamicSelect
            placeholder={placeholder}
            sx={{ width: "100%" }}
            dynamicConfig={dynamicConfig}
            value={field.value}
            onChange={(_event, value) => {
              field.onChange(
                value == null || Array.isArray(value) ? null : value,
              );
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
