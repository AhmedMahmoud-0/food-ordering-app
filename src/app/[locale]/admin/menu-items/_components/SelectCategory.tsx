"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@prisma/client";
import { Translations } from "@/types/translations";
import { Label } from "@/components/ui/label";
import { Languages } from "@/constants/enums";
import { useParams } from "next/navigation";

function SelectCategory({
  categories,
  categoryId,
  setCategoryId,
  translations,
}: {
  categories: Category[];
  categoryId: string;
  translations: Translations;
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const currentItem = categories.find((item) => item.id === categoryId);
  const { locale } = useParams();
  return (
    <>
      <Label htmlFor="categoryId" className="mb-2 block text-sm font-bold text-foreground">
        {translations.category}
      </Label>
      <Select
        name="categoryId"
        onValueChange={(value) => {
          if (value !== null) {
            setCategoryId(value);
          }
        }}
        defaultValue={categoryId}
      >
        <SelectTrigger
          className={`h-11 w-full max-w-sm rounded-xl border-border/80 bg-background/80 focus:ring-0 ${
            locale === Languages.ARABIC ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <SelectValue>{currentItem?.name}</SelectValue>
        </SelectTrigger>
        <SelectContent className="z-50 rounded-xl border-border/80 bg-card">
          <SelectGroup className="z-50 bg-card text-foreground">
            {categories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id}
                className="bg-transparent! text-foreground! hover:bg-primary! hover:text-white!"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
export default SelectCategory;
