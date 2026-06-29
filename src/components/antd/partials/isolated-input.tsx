"use client";

import { Form, Input, type InputProps, type InputRef } from "antd";
import { type Ref, useId } from "react";

type AntdIsolatedInputProps = InputProps & {
  ref?: Ref<InputRef>;
};

export function AntdIsolatedInput({
  ref,
  value,
  onChange,
  ...rest
}: AntdIsolatedInputProps) {
  const [form] = Form.useForm();
  const id = useId();
  const isControlled = value !== undefined || onChange !== undefined;

  if (isControlled) {
    return <Input ref={ref} value={value} onChange={onChange} {...rest} />;
  }

  return (
    <Form form={form} component={false}>
      <Form.Item name={`isolatedField-${id}`} noStyle>
        <Input ref={ref} {...rest} />
      </Form.Item>
    </Form>
  );
}
