const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const date = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});

export function formatDate(dateString: string): string {
  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return date.format(parsedDate);
}

export function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) {
    return "Invalid amount";
  }

  return currency.format(amount);
}
