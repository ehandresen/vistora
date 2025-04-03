"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { CartItem } from '@/types';
import { Prisma } from '@prisma/client';

import {
    convertToPlainObject, formatError, formatNumberWithDecimal, roundToTwoDecimals
} from '../utils';
import { cartItemSchema, insertCartSchema } from '../validators';

// calculate cart prices
function calcPrice(items: CartItem[]) {
  const itemsPrice = roundToTwoDecimals(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = roundToTwoDecimals(itemsPrice > 100 ? 0 : 10),
    taxPrice = roundToTwoDecimals(0.15 * itemsPrice),
    totalPrice = roundToTwoDecimals(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: formatNumberWithDecimal(itemsPrice),
    shippingPrice: formatNumberWithDecimal(shippingPrice),
    taxPrice: formatNumberWithDecimal(taxPrice),
    totalPrice: formatNumberWithDecimal(totalPrice),
  };
}

export async function addItemToCart(data: CartItem) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Cart session not found");

    // get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get cart
    const cart = await getMyCart();

    // parse and validate item
    const item = cartItemSchema.parse(data);

    // find product in database
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
      },
    });
    if (!product) throw new Error("Product not found");

    if (!cart) {
      // create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // add to database
      await prisma.cart.create({
        data: newCart,
      });

      // revalidate product page to update any product-related info (e.g. stock, in-cart info)
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // check if item is already in cart
      const itemInCart = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (itemInCart) {
        // check stock
        if (product.stock < itemInCart.qty + 1) {
          throw new Error("Not enough stock");
        }

        // increase quantity
        itemInCart.qty += 1;
      } else {
        // if item does not exist in cart
        // check stock
        if (product.stock < 1) throw new Error("Not enough stock");

        // add item to cart.item
        cart.items.push(item);
      }

      // save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          itemInCart ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  // check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  // get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
