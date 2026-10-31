"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Languages } from "@/constants/enums";
import { Translations } from "@/types/translations";
import { Category } from "@prisma/client";
import { EditIcon } from "lucide-react";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { useParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { updateCategory } from "../_actions/category";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";

type InitialStateType = {
  message?: string;
  error?: ValidationError;
  status?: number | null;
};

const initialState: InitialStateType = {
  message: "",
  error: {},
  status: null,
};

function EditCategory({
  translations,
  category,
}: {
  translations: Translations;
  category: Category;
}) {
  const { locale } = useParams();
  const [state, action, pending] = useActionState(
    updateCategory.bind(null, category.id),
    initialState,
  );

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.message,
        className: state.status === 200 ? "text-green-400" : "text-destructive",
      });
    }
  }, [state.message, state.status]);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label={translations.admin.categories.form.editName}
            className="size-10 rounded-xl border-border/80 bg-card text-muted-foreground shadow-none hover:border-primary/25 hover:bg-primary/5 hover:text-primary"
          >
            <EditIcon className="size-4" />
          </Button>
        }
      />
      <DialogContent className="rounded-3xl border-border/80 p-6 sm:max-w-lg sm:p-8">
        <DialogHeader>
          <DialogTitle
            className={`text-lg font-extrabold ${
              locale === Languages.ARABIC ? "text-right" : "text-left"
            }`}
          >
            {translations.admin.categories.form.editName}
          </DialogTitle>
        </DialogHeader>
        <form action={action} className="pt-4">
          <div className="grid gap-3">
            <Label htmlFor="categoryName" className="text-sm font-bold text-foreground">
              {translations.admin.categories.form.name.label}
            </Label>
            <div className="grid gap-2">
              <Input
                type="text"
                id="categoryName"
                name="categoryName"
                defaultValue={category.name}
                placeholder={translations.admin.categories.form.name.placeholder}
                className="h-12 rounded-xl bg-background/80 px-4"
              />
              {state.error?.categoryName && (
                <p className="text-sm font-medium text-destructive">
                  {state.error.categoryName}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-7">
            <Button type="submit" disabled={pending} className="h-11 rounded-xl px-7 font-extrabold">
              {pending ? <Loader /> : translations.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditCategory;
