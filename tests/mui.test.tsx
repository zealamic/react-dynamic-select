import { afterEach, expect, test } from "@rstest/core";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { FETCH_TRIGGER, LOAD_MORE_TYPE } from "../src/lib/constants";
import type { MuiDynamicSelectConfig } from "../src/mui";
import { MuiDynamicSelect } from "../src/mui";

type MockItem = { id: number; name: string };
type MockParams = { page?: number; pageSize?: number; search?: string };
type MockResult = { data: MockItem[]; total: number };

const fetchCalls: MockParams[] = [];

const mockFetch = async ({
  page = 1,
  pageSize = 10,
  search = "",
}: MockParams): Promise<MockResult> => {
  fetchCalls.push({ page, pageSize, search });

  return {
    data: Array.from({ length: pageSize }, (_, index) => ({
      id: (page - 1) * pageSize + index + 1,
      name: `User ${(page - 1) * pageSize + index + 1} ${search}`.trim(),
    })),
    total: 25,
  };
};

const dynamicConfig = {
  api: {
    fetch: mockFetch,
    params: {
      page: 1,
      pageSize: 10,
      search: "",
    },
    trigger: FETCH_TRIGGER.OPEN,
  },
  list: { path: "data" },
  total: { path: "total" },
  option: {
    template: {
      label: "name",
      value: "id",
    },
  },
  loadMore: {
    type: LOAD_MORE_TYPE.CLICK,
  },
} satisfies MuiDynamicSelectConfig<MockItem, MockResult, MockParams>;

afterEach(() => {
  cleanup();
});

test("MuiDynamicSelect fetches options when dropdown opens", async () => {
  fetchCalls.length = 0;

  render(
    // @ts-expect-error
    <MuiDynamicSelect
      placeholder="Select user"
      dynamicConfig={dynamicConfig}
    />,
  );

  fireEvent.mouseDown(screen.getByRole("combobox"));

  await waitFor(() => {
    expect(fetchCalls[0]).toEqual(
      expect.objectContaining({
        page: 1,
        pageSize: 10,
        search: "",
      }),
    );
  });

  expect(await screen.findByText("User 1")).toBeInTheDocument();
});

test("MuiDynamicSelect shows currentData label before opening dropdown", () => {
  render(
    // @ts-expect-error
    <MuiDynamicSelect
      placeholder="Select user"
      value={15}
      dynamicConfig={{
        ...dynamicConfig,
        currentData: { id: 15, name: "User 15 preset" },
      }}
    />,
  );

  expect(screen.getByDisplayValue("User 15 preset")).toBeInTheDocument();
});

test("MuiDynamicSelect merges currentData for multiple mode", () => {
  render(
    // @ts-expect-error
    <MuiDynamicSelect
      multiple
      value={[4, 15]}
      dynamicConfig={{
        ...dynamicConfig,
        currentData: [
          { id: 4, name: "User 4 preset" },
          { id: 15, name: "User 15 preset" },
        ],
      }}
    />,
  );

  expect(screen.getByText("User 4 preset")).toBeInTheDocument();
  expect(screen.getByText("User 15 preset")).toBeInTheDocument();
});

test("MuiDynamicSelect keeps menu open when selecting multiple items", async () => {
  fetchCalls.length = 0;

  render(
    // @ts-expect-error
    <MuiDynamicSelect
      multiple
      placeholder="Select users"
      dynamicConfig={dynamicConfig}
    />,
  );

  fireEvent.mouseDown(screen.getByRole("combobox"));

  await screen.findByText("User 1");
  fireEvent.click(screen.getByText("User 1"));

  expect(screen.getByText("User 2")).toBeInTheDocument();
});

test("MuiDynamicSelect keeps menu open when focusing menu search input", async () => {
  fetchCalls.length = 0;

  render(
    // @ts-expect-error
    <MuiDynamicSelect
      placeholder="Select users"
      dynamicConfig={{
        ...dynamicConfig,
        search: {
          inputSearchMenuProps: {
            placeholder: "Search user",
          },
        },
      }}
    />,
  );

  fireEvent.mouseDown(screen.getByRole("combobox"));

  const searchInput = await screen.findByPlaceholderText("Search user");
  fireEvent.mouseDown(searchInput);

  expect(searchInput).toHaveFocus();
  expect(screen.getByText("User 1")).toBeInTheDocument();
});

test("MuiDynamicSelect reopens after closing menu", async () => {
  fetchCalls.length = 0;

  render(
    // @ts-expect-error
    <MuiDynamicSelect
      placeholder="Select users"
      dynamicConfig={{
        ...dynamicConfig,
        search: {
          inputSearchMenuProps: {
            placeholder: "Search user",
          },
        },
      }}
    />,
  );

  const combobox = screen.getByRole("combobox");

  fireEvent.mouseDown(combobox);
  await screen.findByPlaceholderText("Search user");

  fireEvent.keyDown(combobox, { key: "Escape" });

  await waitFor(() => {
    expect(screen.queryByPlaceholderText("Search user")).not.toBeInTheDocument();
  });

  fireEvent.mouseDown(combobox);
  expect(await screen.findByPlaceholderText("Search user")).toBeInTheDocument();
});

test("MuiDynamicSelect focuses search after loading completes", async () => {
  fetchCalls.length = 0;

  const slowFetch = async (params: MockParams) => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockFetch(params);
  };

  render(
    // @ts-expect-error
    <MuiDynamicSelect
      placeholder="Select users"
      dynamicConfig={{
        ...dynamicConfig,
        api: {
          ...dynamicConfig.api,
          fetch: slowFetch,
        },
        search: {
          inputSearchMenuProps: {
            placeholder: "Search user",
          },
        },
      }}
    />,
  );

  fireEvent.mouseDown(screen.getByRole("combobox"));

  const searchInput = await screen.findByPlaceholderText("Search user");

  await waitFor(() => {
    expect(screen.getByText("User 1")).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(searchInput).toHaveFocus();
  });
});
