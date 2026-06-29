export function isScrolledToBottom(target: HTMLDivElement, distance = 0) {
  const { scrollTop, scrollHeight, clientHeight } = target;
  return scrollHeight - scrollTop - clientHeight <= distance;
}
