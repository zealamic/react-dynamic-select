export function DefaultPlusIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <path d="M8 3.5v9M3.5 8h9" />
    </svg>
  );
}
