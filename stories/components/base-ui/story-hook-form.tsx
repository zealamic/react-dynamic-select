import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { BaseUiDynamicSelectConfig } from "../../../src/base-ui";
import { BaseUiDynamicSelect } from "../../../src/base-ui";
import type { ResolvedOption } from "../../../src/general-types";
import {
  FETCH_TRIGGER,
  LOAD_MORE_TYPE,
  SEARCH_PLACEMENT,
} from "../../../src/lib/constants";
import { getUserList } from "../../mocks/user";
import styles from "./base-ui.module.css";

type UserListParams = Parameters<typeof getUserList>[0];
type UserListResult = Awaited<ReturnType<typeof getUserList>>;
type UserModel = UserListResult["data"][number];

type HookFormValues = {
  user: ResolvedOption | null;
};

const defaultUserListConfig = {
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

export type BaseUiHookFormStoryProps = {
  placeholder?: string;
  dynamicConfig?: BaseUiDynamicSelectConfig<
    UserModel,
    UserListResult,
    UserListParams
  >;
};

export function BaseUiHookFormStory({
  placeholder = "Select a user",
  dynamicConfig = defaultUserListConfig,
}: BaseUiHookFormStoryProps) {
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
          <BaseUiDynamicSelect
            placeholder={placeholder}
            dynamicConfig={dynamicConfig}
            listHeight={200}
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
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
