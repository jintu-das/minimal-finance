import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "@/lib/api";
import { categoriesQueryOptions } from "./fetch-categories.api";
import type { Category } from "../types";

vi.mock("@/lib/api", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

const categories: Array<Category> = [
  {
    budget: 100,
    createdAt: "2026-01-01T00:00:00.000Z",
    id: "1",
    label: "Salary",
    type: "income",
    updatedAt: "2026-01-01T00:00:00.000Z",
    spent: 0,
    transactionCount: 0,
  },
];

const envelope = {
  data: {
    success: true,
    data: categories,
    meta: { timestamp: "2026-10-19T09:30:00.000Z", count: categories.length },
  },
};

describe("categoriesQueryOptions", () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset();
  });

  it("scopes the query key by filters", () => {
    expect(categoriesQueryOptions().queryKey).toEqual([
      "categories",
      "list",
      {},
    ]);
    expect(categoriesQueryOptions({ search: "food" }).queryKey).toEqual([
      "categories",
      "list",
      { search: "food" },
    ]);
  });

  it("fetches /categories and unwraps the axios response", async () => {
    vi.mocked(api.get).mockResolvedValue(envelope);
    const queryClient = new QueryClient();
    const options = categoriesQueryOptions();

    const data = await queryClient.ensureQueryData(options);

    expect(api.get).toHaveBeenCalledWith("/categories", {
      params: { search: undefined },
    });
    expect(data).toEqual(categories);
  });

  it("sends the search term as a query param", async () => {
    vi.mocked(api.get).mockResolvedValue(envelope);
    const queryClient = new QueryClient();

    await queryClient.ensureQueryData(
      categoriesQueryOptions({ search: "sal" }),
    );

    expect(api.get).toHaveBeenCalledWith("/categories", {
      params: { search: "sal" },
    });
  });
});
