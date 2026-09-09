export function isSelectSearchDisabled({
  disabled,
  loading,
  isLoadingMore,
}: {
  disabled?: boolean;
  loading?: boolean;
  isLoadingMore?: boolean;
} = {}): boolean {
  return Boolean(disabled || loading || isLoadingMore);
}
