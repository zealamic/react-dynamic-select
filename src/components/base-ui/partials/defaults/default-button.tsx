import type { BaseUiButtonSlotProps } from "../../types";

export function DefaultButton({
  type = "button",
  ...props
}: BaseUiButtonSlotProps) {
  return <button type={type} {...props} />;
}
