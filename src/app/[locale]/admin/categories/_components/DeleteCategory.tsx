"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteCategory } from "../_actions/category";
import Loader from "@/components/ui/loader";

type StateType = {
  isLoading: boolean;
  message: string;
  status: number | null;
};

function DeleteCategory({ id }: { id: string }) {
  const [state, setState] = useState<StateType>({
    isLoading: false,
    message: "",
    status: null,
  });

  const handleDelete = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const res = await deleteCategory(id);
      setState((prev) => ({ ...prev, message: res.message, status: res.status }));
    } catch (error) {
      console.log(error);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-10 rounded-xl border-border/80 bg-card text-muted-foreground shadow-none hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
      disabled={state.isLoading}
      onClick={handleDelete}
    >
      {state.isLoading ? <Loader /> : <Trash2 className="size-4" />}
    </Button>
  );
}

export default DeleteCategory;
