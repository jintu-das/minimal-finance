import { useId } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Field,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoriesQueryOptions } from "@/features/categories/api/fetch-categories.api";
import { useCreateTransaction } from "../api/create-transaction.api";
import { useUpdateTransaction } from "../api/update-transaction.api";
import {
  createTransactionFormSchema,
  type CreateTransactionFormInput,
  type CreateTransactionFormValues,
} from "../schema";
import type { Transaction } from "../types";

type TransactionFormProps = {
  /** When provided, the form edits this transaction instead of creating one. */
  transaction?: Transaction;
  onSuccess?: () => void;
};

// Local calendar date (YYYY-MM-DD) for a native date input.
function toDateInputValue(date: Date) {
  const local = new Date(date);
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().slice(0, 10);
}

function getDefaultValues(
  transaction?: Transaction,
): CreateTransactionFormInput {
  if (!transaction) {
    return {
      title: "",
      amount: "",
      type: "expense",
      categoryId: "",
      date: toDateInputValue(new Date()),
    };
  }
  return {
    title: transaction.title,
    amount: String(transaction.amount),
    type: transaction.type,
    categoryId: transaction.categoryId,
    date: toDateInputValue(new Date(transaction.date)),
  };
}

export function TransactionForm({
  transaction,
  onSuccess,
}: TransactionFormProps) {
  const formId = useId();
  const isEdit = Boolean(transaction);
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const isPending = createTransaction.isPending || updateTransaction.isPending;
  const categoriesQuery = useQuery(categoriesQueryOptions());
  const form = useForm<
    CreateTransactionFormInput,
    unknown,
    CreateTransactionFormValues
  >({
    resolver: zodResolver(createTransactionFormSchema),
    defaultValues: getDefaultValues(transaction),
  });

  const type = useWatch({ control: form.control, name: "type" });
  const categories = (categoriesQuery.data ?? []).filter(
    (category) => category.type === type,
  );

  function onSubmit(data: CreateTransactionFormValues) {
    if (transaction) {
      updateTransaction.mutate(
        { id: transaction.id, values: data },
        { onSuccess: () => onSuccess?.() },
      );
      return;
    }
    createTransaction.mutate(data, {
      onSuccess: () => {
        form.reset(getDefaultValues());
        onSuccess?.();
      },
    });
  }

  return (
    <>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="type"
            control={form.control}
            render={({ field }) => (
              <Field>
                <Tabs
                  onBlur={field.onBlur}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("categoryId", "");
                  }}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="expense">Expense</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                  </TabsList>
                </Tabs>
              </Field>
            )}
          />

          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="transaction-title">Title</FieldLabel>
                <Input
                  {...field}
                  id="transaction-title"
                  placeholder="e.g. Weekly groceries"
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
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="transaction-amount">Amount</FieldLabel>
                <InputGroup aria-invalid={fieldState.invalid}>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>₹</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="transaction-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    aria-invalid={fieldState.invalid}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="transaction-category">Category</FieldLabel>
                <Select
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(value ?? "")}
                  items={categories.map((category) => ({
                    value: category.id,
                    label: category.label,
                  }))}
                >
                  <SelectTrigger
                    id="transaction-category"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                    onBlur={field.onBlur}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="transaction-date">Date</FieldLabel>
                <Input
                  {...field}
                  id="transaction-date"
                  type="date"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <DialogFooter className="mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset(getDefaultValues(transaction))}
        >
          Reset
        </Button>
        <Button type="submit" form={formId} disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isEdit ? "Save Changes" : "Create Transaction"}
        </Button>
      </DialogFooter>
    </>
  );
}
