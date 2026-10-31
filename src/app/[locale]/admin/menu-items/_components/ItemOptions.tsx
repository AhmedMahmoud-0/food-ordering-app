/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Translations } from "@/types/translations";
import { Extra, ExtraIngredients, ProductSizes, Size } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import { Languages } from "@/constants/enums";

export enum ItemOptionsKeys {
  SIZES,
  EXTRAS,
}

const sizesNames = [
  ProductSizes.SMALL,
  ProductSizes.MEDIUM,
  ProductSizes.LARGE,
];

const extrasNames = [
  ExtraIngredients.CHEESE,
  ExtraIngredients.BACON,
  ExtraIngredients.ONION,
  ExtraIngredients.PEPPER,
  ExtraIngredients.TOMATO,
];

function handleOptions(
  setState:
    | React.Dispatch<React.SetStateAction<Partial<Size>[]>>
    | React.Dispatch<React.SetStateAction<Partial<Extra>[]>>,
) {
  const addOption = () => {
    setState((prev: any) => {
      return [...prev, { name: "", price: 0 }];
    });
  };
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    fieldName: string,
  ) => {
    const newValue = e.target.value;
    setState((prev: any) => {
      const newSizes = [...prev];
      newSizes[index][fieldName] = newValue;
      return newSizes;
    });
  };
  const removeOption = (indexToRemove: number) => {
    setState((prev: any) => {
      return prev.filter((_: any, index: number) => index !== indexToRemove);
    });
  };
  return { addOption, onChange, removeOption };
}

function ItemOptions({
  state,
  setState,
  translations,
  optionKey,
}: {
  state: Partial<Size>[] | Partial<Extra>[];
  setState:
    | React.Dispatch<React.SetStateAction<Partial<Size>[]>>
    | React.Dispatch<React.SetStateAction<Partial<Extra>[]>>;
  translations: Translations;
  optionKey: ItemOptionsKeys;
}) {
  const { addOption, onChange, removeOption } = handleOptions(setState);

  const isThereAvailableOptions = () => {
    switch (optionKey) {
      case ItemOptionsKeys.SIZES:
        return sizesNames.length > state.length;
      case ItemOptionsKeys.EXTRAS:
        return extrasNames.length > state.length;
    }
  };
  return (
    <>
      {state.length > 0 && (
        <ul>
          {state.map((item, index) => {
            return (
              <li key={index} className="mb-3 grid gap-3 rounded-2xl border border-border/80 bg-background/70 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
                <div className="min-w-0 space-y-2">
                  <Label>{translations.admin["menu-items"].name}</Label>
                  <SelectName
                    item={item}
                    onChange={onChange}
                    index={index}
                    currentState={state}
                    optionKey={optionKey}
                    translations={translations}
                  />
                </div>
                <div className="min-w-0 space-y-2">
                  <Label>{translations.admin["menu-items"].extraPrice}</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    name="price"
                    value={item.price}
                    onChange={(e) => onChange(e, index, "price")}
                    onFocus={(e) => e.currentTarget.select()}
                    className="h-11 rounded-xl bg-card focus:ring-0!"
                  />
                </div>
                <div className="flex items-end sm:pb-0.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {isThereAvailableOptions() && (
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl border-dashed border-primary/30 bg-primary/5 font-bold text-primary hover:bg-primary/10"
          onClick={addOption}
        >
          <Plus />
          {optionKey === ItemOptionsKeys.SIZES
            ? translations.admin["menu-items"].addItemSize
            : translations.admin["menu-items"].addExtraItem}
        </Button>
      )}
    </>
  );
}

export default ItemOptions;

const SelectName = ({
  onChange,
  index,
  item,
  currentState,
  optionKey,
  translations,
}: {
  index: number;
  item: Partial<Size> | Partial<Extra>;
  currentState: Partial<Size>[] | Partial<Extra>[];
  optionKey: ItemOptionsKeys;
  translations: Translations;
  onChange: (e: any, index: any, fieldName: any) => void;
}) => {
  const { locale } = useParams();

  const getNames = () => {
    switch (optionKey) {
      case ItemOptionsKeys.SIZES:
        const filteredSizes = sizesNames.filter(
          (size) =>
            !currentState.some(
              (s, currentIndex) => currentIndex !== index && s.name === size,
            ),
        );
        return filteredSizes;
      case ItemOptionsKeys.EXTRAS:
        const filteredExtras = extrasNames.filter(
          (extra) =>
            !currentState.some(
              (e, currentIndex) => currentIndex !== index && e.name === extra,
            ),
        );
        return filteredExtras;
    }
  };

  const names = getNames();

  return (
    <Select
      onValueChange={(value) => {
        onChange({ target: { value } }, index, "name");
      }}
      defaultValue={
        item.name ? item.name : translations.admin["menu-items"].select
      }
    >
      <SelectTrigger
        className={`h-11 w-full rounded-xl border-border/80 bg-background/80 focus:ring-0 ${
          locale === Languages.ARABIC ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <SelectValue>
          {item.name ? item.name : translations.admin["menu-items"].select}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="z-50 rounded-xl border-border/80 bg-card">
        <SelectGroup className="z-50 bg-card text-foreground">
          {names.map((name, index) => (
            <SelectItem
              key={index}
              value={name}
              className="bg-transparent! text-foreground! hover:bg-primary! hover:text-white!"
            >
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
