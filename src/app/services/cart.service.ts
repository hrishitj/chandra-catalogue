import { Injectable } from '@angular/core';

export interface CartCombination {
  metal: string;
  karat: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  code: string;
  image: string;
  weight: string;
  combinations: CartCombination[];
}

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cartItems: CartItem[] = [];

  constructor() {}

  addToCart(item: CartItem) {
    console.log('Adding to cart:', item);
    // Check if item already exists in cart
    const existingItemIndex = this.cartItems.findIndex(cartItem => cartItem.code === item.code);
    if (existingItemIndex !== -1) {
      // Update the existing item
      const existingItem = this.cartItems[existingItemIndex];
      existingItem.combinations = item.combinations;
    } else {
      // Add new item to cart
      // item.combinations.forEach((combo: any) => {
      //   combo.total = combo.price * combo.quantity;
      // });
      // Add the item to the cart
      this.cartItems.push(item);
    }
  }

  setCartItems(items: any[]) {
    this.cartItems = items;
  }

  getCartItems() {
    return this.cartItems;
  }

  clearCart() {
    this.cartItems = [];
  }
}