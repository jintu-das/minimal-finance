import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import type { Category } from "../types";
import { DeleteCategoryButton } from "./delete-category-button";

export default function CategoryCard(category: Category) {
  const progress =
    category.budget > 0
      ? Math.min((category.spent / category.budget) * 100, 100)
      : 0;

  return (
    <li>
      <Card size="sm" className="shadow-none border">
        <CardHeader>
          <CardTitle>{category.label}</CardTitle>
          <CardDescription>
            {category.spent}/{category.budget}
          </CardDescription>
          <CardAction>
            <DeleteCategoryButton category={category} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Progress
            value={progress}
            className="*:data-[slot=progress-track]:h-0.5"
          >
            <div className="order-1 flex w-full justify-between text-sm">
              <ProgressLabel className="text-muted-foreground">
                {category.transactionCount} records
              </ProgressLabel>
              <ProgressValue />
            </div>
          </Progress>
        </CardContent>
      </Card>
    </li>
  );
}
