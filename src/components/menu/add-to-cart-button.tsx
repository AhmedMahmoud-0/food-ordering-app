"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/formatters";
import { ProductWithRelations } from "@/types/Product";
import { Extra, ProductSizes, Size } from "@prisma/client";
import { useState } from "react";
import {
  addCartItem,
  removeCartItem,
  removeItemFromCart,
  selectCartItems,
} from "@/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { gitItemQuantity } from "@/lib/cart";

function AddToCartButton({ item }: { item: ProductWithRelations }) {
  const cart = useAppSelector(selectCartItems);
  const quantity = gitItemQuantity(item.id, cart);
  const dispatch = useAppDispatch();
  const defaultSize =
    cart.find((element) => element.id === item.id)?.size ||
    item.sizes.find((size) => size.name === ProductSizes.SMALL);
  const defaultExtras =
    cart.find((element) => element.id === item.id)?.extras || [];
  const [selectedSize, setSelectedSize] = useState<Size>(defaultSize!);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>(defaultExtras);

  let totalPrice = item.basePrice;
  if (selectedSize) {
    totalPrice += selectedSize.price;
  }
  if (selectedExtras.length > 0) {
    for (const extra of selectedExtras) {
      totalPrice += extra.price;
    }
  }

  const handleAddToCart = () => {
    dispatch(
      addCartItem({
        basePrice: item.basePrice,
        id: item.id,
        image: item.image,
        name: item.name,
        size: selectedSize,
        extras: selectedExtras,
      }),
    );
  };
  return (
    <Dialog>
      <form>
        <DialogTrigger
          render={
            <Button
              type="button"
              size="lg"
              className="mt-4 text-white rounded-full px-8!"
            >
              <span>Add to cart</span>
            </Button>
          }
        />
        <DialogContent className="sm:max-w-[425px ] max-h-[80vh] overflow-y-auto ">
          <DialogHeader className="flex items-center">
            <Image src={item.image} alt={item.name} width={200} height={200} />
            <DialogTitle>{item.name}</DialogTitle>
            <DialogDescription className="text-center">
              {item.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-10">
            <div className="space-y-4 text-center">
              <Label htmlFor="pick-size" className="block">
                Pick Your Size
              </Label>
              <PickSize
                sizes={item.sizes}
                item={item}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />
            </div>
            <div className="space-y-4 text-center">
              <Label htmlFor="add-extras" className="block">
                Any extras?
              </Label>
              <Extras
                extras={item.extras}
                selectedExtras={selectedExtras}
                setSelectedExtras={setSelectedExtras}
              />
            </div>
          </div>
          <DialogFooter>
            {quantity === 0 ? (
              <Button
                type="submit"
                onClick={handleAddToCart}
                className="w-full h-10"
              >
                Add to cart{formatCurrency(totalPrice)}
              </Button>
            ) : (
              <ChooseQuantity
                quantity={quantity}
                item={item}
                selectedSize={selectedSize}
                selectedExtras={selectedExtras}
              />
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default AddToCartButton;

function PickSize({
  sizes,
  item,
  selectedSize,
  setSelectedSize,
}: {
  sizes: Size[];
  selectedSize: Size;
  item: ProductWithRelations;
  setSelectedSize: React.Dispatch<React.SetStateAction<Size>>;
}) {
  return (
    <RadioGroup
      value={selectedSize.id}
      onValueChange={(value) => {
        const size = sizes.find((size) => size.id === value);
        if (size) setSelectedSize(size);
      }}
      className="flex flex-col gap-3 w-full max-w-xs mx-auto"
    >
      {sizes.map((size) => (
        <div key={size.id} className="flex items-center gap-3 w-full">
          <RadioGroupItem
            value={size.id}
            id={size.id}
            className="border-primary text-primary focus-visible:ring-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
          />
          {/* 👇 تحويل الـ Label لـ flex وتوزيع الاسم والسعر على الأطراف بدقة */}
          <Label
            onClick={() => setSelectedSize(size)}
            className="flex-1 flex justify-between items-center cursor-pointer font-medium text-sm"
          >
            <span className="capitalize">{size.name}</span>
            <span className="text-muted-foreground">
              {formatCurrency(+size.price + +item.basePrice)}
            </span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

function Extras({
  extras,
  selectedExtras,
  setSelectedExtras,
}: {
  extras: Extra[];
  selectedExtras: Extra[];
  setSelectedExtras: React.Dispatch<React.SetStateAction<Extra[]>>;
}) {
  const handleExtra = (extra: Extra) => {
    if (selectedExtras.find((e) => e.id === extra.id)) {
      setSelectedExtras((prev) => prev.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras((prev) => [...prev, extra]);
    }
  };
  return extras.map((extra) => (
    <div
      key={extra.id}
      className="flex items-center gap-3 border border-gray-100 rounded-md p-4 w-full"
    >
      <Checkbox
        id={extra.id}
        onCheckedChange={() => handleExtra(extra)}
        checked={Boolean(selectedExtras.find((e) => e.id === extra.id))}
        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-primary h-4 w-4 rounded"
      />
      <Label
        onClick={() => handleExtra(extra)}
        className="flex-1 flex justify-between items-center text-base text-foreground font-semibold cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        <span className="capitalize">{extra.name}</span>
        <span className="text-muted-foreground text-sm font-medium">
          {formatCurrency(extra.price)}
        </span>
      </Label>
    </div>
  ));
}

const ChooseQuantity = ({
  quantity,
  item,
  selectedExtras,
  selectedSize,
}: {
  quantity: number;
  selectedExtras: Extra[];
  selectedSize: Size;
  item: ProductWithRelations;
}) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center flex-col gap-2 mt-4 w-full">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => dispatch(removeCartItem({ id: item.id }))}
        >
          -
        </Button>
        <div>
          <span className="text-black">{quantity} in cart</span>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            dispatch(
              addCartItem({
                basePrice: item.basePrice,
                id: item.id,
                image: item.image,
                name: item.name,
                size: selectedSize,
                extras: selectedExtras,
              }),
            )
          }
        >
          +
        </Button>
      </div>
      <Button
        size="sm"
        onClick={() => dispatch(removeItemFromCart({ id: item.id }))}
      >
        Remove
      </Button>
    </div>
  );
};
