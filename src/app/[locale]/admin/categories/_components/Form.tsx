"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import { Translations } from "@/types/translations";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { useActionState, useEffect } from "react";
import { addCategory } from "../_actions/category";

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

function Form({ translations }: { translations: Translations }) {
  const [state, action, pending] = useActionState(addCategory, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.message,
        className: state.status === 201 ? "text-green-400" : "text-destructive",
      });
    }
  }, [state.message, state.status]);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name" className="text-sm font-bold text-foreground">
          {translations.admin.categories.form.name.label}
        </Label>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder={translations.admin.categories.form.name.placeholder}
          className="h-12 rounded-xl bg-background/80 px-4"
        />
        {state.error?.name && (
          <p className="text-sm font-medium text-destructive">{state.error.name}</p>
        )}
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-12 w-full rounded-xl font-extrabold shadow-[0_8px_18px_rgba(200,59,48,0.15)]"
      >
        {pending ? <Loader /> : translations.create}
      </Button>
    </form>
  );
}

export default Form;
