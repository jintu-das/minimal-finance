const categories = [
  {
    id: 1,
    label: "Groceries",
    records: 30,
  },
  {
    id: 2,
    label: "Dining",
    records: 20,
  },
  {
    id: 3,
    label: "Travel & Commute",
    records: 30,
  },
  {
    id: 4,
    label: "Wellness & Health",
    records: 5,
  },
  {
    id: 5,
    label: "Shopping",
    records: 20,
  },
];

export function CategoriesList() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2">
      {categories.map((category) => (
        <li key={category.id} className="py-3">
          <h3 className="text-base font-medium">{category.label}</h3>
          <p className="text-sm text-muted-foreground">
            {category.records} records
          </p>
        </li>
      ))}
    </ul>
  );
}
