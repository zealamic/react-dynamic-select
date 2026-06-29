import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type UseSearchOptions = {
  debounce?: number;
  onSearch: (search: string) => void | Promise<void>;
};

export function useSearch({ debounce = 300, onSearch }: UseSearchOptions) {
  const [searchValue, setSearchValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const triggerSearch = useCallback(
    (value: string) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        void onSearch(value);
      }, debounce);
    },
    [debounce, onSearch],
  );

  const handleInlineSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      triggerSearch(value);
    },
    [triggerSearch],
  );

  const handleMenuSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchValue(value);
      triggerSearch(value);
    },
    [triggerSearch],
  );

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
    };
  }, []);

  const resetSearch = useCallback(() => {
    clearTimeout(debounceRef.current);
    setSearchValue("");
  }, []);

  return {
    searchValue,
    handleInlineSearch,
    handleMenuSearchChange,
    resetSearch,
  };
}
