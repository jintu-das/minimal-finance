import { PageHeader } from "@/components/common/page-header";

// Shared by the page and its skeleton, so the text never changes on load.
export function CategoriesPageHeader() {
  return (
    <PageHeader
      title="Categories"
      description="Organise your spending and set monthly budgets."
    />
  );
}
