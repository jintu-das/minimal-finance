import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createCategoryFormSchema } from "../schema";
import type { z } from "zod";
import { useCreateCategory } from "../api/create-category.api";
import { Spinner } from "@/components/ui/spinner";

type CreateCategoryFormProps = {
  onSuccess?: () => void;
};

export function CreateCategoryForm({ onSuccess }: CreateCategoryFormProps) {
  const createCategory = useCreateCategory();
  const form = useForm<
    z.input<typeof createCategoryFormSchema>,
    unknown,
    z.output<typeof createCategoryFormSchema>
  >({
    resolver: zodResolver(createCategoryFormSchema),
    defaultValues: {
      label: "",
      budget: "",
      type: "expense",
    },
  });

  function onSubmit(data: z.output<typeof createCategoryFormSchema>) {
    console.log("Category submitted:", data);
    createCategory.mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  }

  return (
    <>
      <form id="create-category-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Tabs
                  onBlur={field.onBlur}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="expense">Expense</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                  </TabsList>
                </Tabs>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="label"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category-label">Label</FieldLabel>
                <Input
                  {...field}
                  id="category-label"
                  placeholder="e.g. Groceries"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="budget"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category-budget">Budget</FieldLabel>
                <InputGroup aria-invalid={fieldState.invalid}>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>₹</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    type="number"
                    placeholder="0.00"
                    aria-invalid={fieldState.invalid}
                  />
                </InputGroup>
                <FieldDescription>
                  Monthly spending limit for this category.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button
          type="submit"
          form="create-category-form"
          disabled={createCategory.isPending}
        >
          {createCategory.isPending && <Spinner data-icon="inline-start" />}
          Create Category
        </Button>
      </DialogFooter>
    </>
  );
}
