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
import { getCartItem } from "@/lib/cart";
import { Translations } from "@/types/translations";

function AddToCartButton({
  item,
  translations,
}: {
  item: ProductWithRelations;
  translations: Translations;
}) {
  const cart = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();

  const defaultSize =
    item.sizes.find((size) => size.name === ProductSizes.SMALL) ??
    item.sizes[0];

  const [selectedSize, setSelectedSize] = useState<Size>(defaultSize!);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [open, setOpen] = useState(false);

  const currentCartItem = getCartItem(
    item.id,
    selectedSize.id,
    selectedExtras.map((extra) => extra.id),
    cart,
  );

  const quantity = currentCartItem?.quantity ?? 0;

  let totalPrice = item.basePrice;

  if (selectedSize) {
    totalPrice += selectedSize.price;
  }

  if (selectedExtras.length > 0) {
    for (const extra of selectedExtras) {
      totalPrice += extra.price;
    }
  }

  const resetSelection = () => {
    setSelectedSize(defaultSize!);
    setSelectedExtras([]);
  };

  const handleAddToCart = () => {
    dispatch(
      addCartItem({
        id: item.id,
        productId: item.id,
        basePrice: item.basePrice,
        image: item.image,
        name: item.name,
        size: selectedSize,
        extras: selectedExtras,
      }),
    );

    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (value) {
          resetSelection();
        }
      }}
    >
      <form>
        <DialogTrigger
          render={
            <Button type="button" size="lg" className="product-add-button">
              <span>{translations.menuItem.addToCart}</span>
            </Button>
          }
        />

        <DialogContent className="menu-config-dialog">
          <DialogHeader className="menu-config-header">
            <div className="menu-config-image-wrap">
              <Image
                src={item.image}
                alt={translations.products.items[item.id]?.name ?? item.name}
                width={200}
                height={200}
                className="menu-config-image"
              />
            </div>

            <DialogTitle className="menu-config-title">
              {translations.products.items[item.id]?.name ?? item.name}
            </DialogTitle>

            <DialogDescription className="menu-config-description">
              {translations.products.items[item.id]?.description ??
                item.description}
            </DialogDescription>
          </DialogHeader>

          <div className="menu-config-options">
            <section className="menu-option-section">
              <Label htmlFor="pick-size" className="menu-option-title">
                {translations.menuItem.pickYourSize}
              </Label>

              <PickSize
                sizes={item.sizes}
                item={item}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                translations={translations}
              />
            </section>

            <section className="menu-option-section">
              <Label htmlFor="add-extras" className="menu-option-title">
                {translations.menuItem.anyExtras}
              </Label>

              <Extras
                extras={item.extras}
                selectedExtras={selectedExtras}
                setSelectedExtras={setSelectedExtras}
                translations={translations}
              />
            </section>
          </div>

          <DialogFooter className="menu-config-footer">
            {quantity === 0 ? (
              <Button
                type="button"
                onClick={handleAddToCart}
                className="menu-config-submit"
              >
                <span>{translations.menuItem.addToCart}</span>
                <span>{formatCurrency(totalPrice)}</span>
              </Button>
            ) : (
              <ChooseQuantity
                quantity={quantity}
                item={item}
                selectedSize={selectedSize}
                selectedExtras={selectedExtras}
                cartItemId={currentCartItem!.id}
                translations={translations}
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
  translations,
}: {
  sizes: Size[];
  selectedSize: Size;
  item: ProductWithRelations;
  translations: Translations;
  setSelectedSize: React.Dispatch<React.SetStateAction<Size>>;
}) {
  return (
    <RadioGroup
      value={selectedSize.id}
      onValueChange={(value) => {
        const size = sizes.find((size) => size.id === value);

        if (size) {
          setSelectedSize(size);
        }
      }}
      className="menu-size-list"
    >
      {sizes.map((size) => (
        <div
          key={size.id}
          className={`menu-size-option${selectedSize.id === size.id ? " is-selected" : ""}`}
        >
          <RadioGroupItem
            value={size.id}
            id={size.id}
            className="menu-size-radio"
          />

          <Label
            htmlFor={size.id}
            onClick={() => setSelectedSize(size)}
            className="menu-option-label"
          >
            <span className="capitalize">
              {translations.products.sizes[size.id] ?? size.name}
            </span>

            <span className="menu-option-price">
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
  translations,
}: {
  extras: Extra[];
  selectedExtras: Extra[];
  translations: Translations;
  setSelectedExtras: React.Dispatch<React.SetStateAction<Extra[]>>;
}) {
  const handleExtra = (extra: Extra) => {
    if (selectedExtras.find((e) => e.id === extra.id)) {
      setSelectedExtras((prev) => prev.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras((prev) => [...prev, extra]);
    }
  };

  return extras.map((extra) => {
    const isSelected = Boolean(selectedExtras.find((e) => e.id === extra.id));

    return (
      <div
        key={extra.id}
        className={`menu-extra-option${isSelected ? " is-selected" : ""}`}
      >
        <Checkbox
          id={extra.id}
          onCheckedChange={() => handleExtra(extra)}
          checked={isSelected}
          className="menu-extra-checkbox"
        />

        <Label
          onClick={() => handleExtra(extra)}
          className="menu-option-label"
        >
          <span className="capitalize">
            {translations.products.extras[extra.id] ?? extra.name}
          </span>

          <span className="menu-option-price">
            {formatCurrency(extra.price)}
          </span>
        </Label>
      </div>
    );
  });
}

const ChooseQuantity = ({
  quantity,
  item,
  selectedExtras,
  selectedSize,
  cartItemId,
  translations,
}: {
  quantity: number;
  selectedExtras: Extra[];
  selectedSize: Size;
  item: ProductWithRelations;
  cartItemId: string;
  translations: Translations;
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="menu-quantity-control">
      <div className="menu-quantity-row">
        <Button
          type="button"
          variant="outline"
          className="menu-quantity-button"
          onClick={() => dispatch(removeCartItem({ id: cartItemId }))}
        >
          -
        </Button>

        <span className="menu-quantity-value">
          {quantity} {translations.menuItem.inCart}
        </span>

        <Button
          type="button"
          variant="outline"
          className="menu-quantity-button"
          onClick={() =>
            dispatch(
              addCartItem({
                id: item.id,
                productId: item.id,
                basePrice: item.basePrice,
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
        type="button"
        size="sm"
        variant="ghost"
        className="menu-quantity-remove"
        onClick={() => dispatch(removeItemFromCart({ id: cartItemId }))}
      >
        {translations.menuItem.remove}
      </Button>
    </div>
  );
};
