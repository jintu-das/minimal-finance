import { PageHeader } from "@/components/common/page-header";

// Shared by the page and its skeleton, so the text never changes on load.
export function TransactionsPageHeader() {
  return (
    <PageHeader
      title="Transactions"
      description="Track and manage your income and expenses."
    />
  );
}
