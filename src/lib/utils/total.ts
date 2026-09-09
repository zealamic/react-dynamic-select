import type { DynamicSelectConfig } from "@/general-types";

type TotalConfig = NonNullable<DynamicSelectConfig["total"]>;
type AddConfig = NonNullable<DynamicSelectConfig["add"]>;

export function shouldShowTotalLabel(total?: TotalConfig | null): boolean {
  if (total?.hidden) {
    return false;
  }

  return Boolean(total?.path || total?.label);
}

export function shouldShowListFooter({
  isMenuFooterVisible = true,
  loadMoreConfig,
  total,
  add,
}: {
  isMenuFooterVisible?: boolean;
  loadMoreConfig?: unknown;
  total?: TotalConfig | null;
  add?: Pick<AddConfig, "placement"> | null;
}): boolean {
  if (isMenuFooterVisible === false) {
    return false;
  }

  return (
    loadMoreConfig != null ||
    shouldShowTotalLabel(total) ||
    add?.placement != null
  );
}

export function shouldShowLoadMoreStatusChip({
  isMenuFooterVisible,
  isLoadingMore,
}: {
  isMenuFooterVisible?: boolean;
  isLoadingMore?: boolean;
}): boolean {
  return isMenuFooterVisible === false && Boolean(isLoadingMore);
}
