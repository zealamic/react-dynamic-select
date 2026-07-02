type ClassNameProp<State = unknown> =
  | string
  | ((state: State) => string | undefined)
  | undefined;

export function joinClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function mergeClassName<State>(
  moduleClass: string,
  className?: ClassNameProp<State>,
): string | ((state: State) => string) {
  if (typeof className === "function") {
    return (state: State) => joinClassNames(moduleClass, className(state));
  }

  return joinClassNames(moduleClass, className);
}
