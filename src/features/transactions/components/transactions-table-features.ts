import {
  createSortedRowModel,
  rowSortingFeature,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table";

export const transactionTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    basic: sortFn_basic,
    text: sortFn_text,
  },
});
