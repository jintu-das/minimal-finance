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
  },
];

describe("categoriesQueryOptions", () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset();
  });

  it("uses the shared categories query key", () => {
    expect(categoriesQueryOptions.queryKey).toEqual(["categories"]);
  });

  it("fetches /categories and unwraps the axios response", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: categories });
    const queryClient = new QueryClient();

    const data = await queryClient.ensureQueryData(categoriesQueryOptions);

    expect(api.get).toHaveBeenCalledWith("/categories");
    expect(categoriesQueryOptions.select?.({ data: categories } as never)).toEqual(categories);
    expect(data).toBeDefined();
  });
});
