import { CartItem } from "@/redux/features/cart/cartSlice";

export const deliveryFee = 5;

export const gitCartQuantity = (cart: CartItem[]) => {
  return cart.reduce((quantity, item) => item.quantity! + quantity, 0);
};

export const gitItemQuantity = (id: string, cart: CartItem[]) => {
  return cart.find((item) => item.id === id)?.quantity || 0;
};

export const getCartItem = (
  productId: string,
  sizeId: string,
  extrasIds: string[],
  cart: CartItem[],
) => {
  const sortedExtrasIds = [...extrasIds].sort();

  return cart.find((item) => {
    if (item.productId !== productId) return false;

    if (item.size?.id !== sizeId) return false;

    const itemExtrasIds = (item.extras || []).map((extra) => extra.id).sort();

    if (itemExtrasIds.length !== sortedExtrasIds.length) return false;

    return itemExtrasIds.every((id, index) => id === sortedExtrasIds[index]);
  });
};

export const getSubTotal = (cart: CartItem[]) => {
  return cart.reduce((total, cartItem) => {
    const extrasTotal = cartItem.extras?.reduce(
      (sum, extra) => sum + (extra.price || 0),
      0,
    );

    const itemTotal =
      cartItem.basePrice + (extrasTotal || 0) + (cartItem.size?.price || 0);

    return total + itemTotal * cartItem.quantity!;
  }, 0);
};

export const getTotalAmount = (cart: CartItem[]) => {
  return getSubTotal(cart) + deliveryFee;
};
