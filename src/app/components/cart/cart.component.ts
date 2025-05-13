import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  imports: [CommonModule, FormsModule],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  name = '';
  email = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  sendEnquiry() {
    const subject = encodeURIComponent('Product Enquiry from ' + this.name);

    let body = `Name: ${this.name}\nEmail: ${this.email}\n\nProducts:\n`;

    this.cartItems.forEach((item, index) => {
      body += `\n#${index + 1} - ${item.code}\n`;
      body += `Wt: ${item.weight}\n`;

      item.combinations.forEach((combo: any, i: number) => {
        body += `  Combo ${i + 1}: ${combo.metal}-${combo.karat}, Qty: ${combo.quantity}, Price: $${combo.price}\n`;
      });

      body += '\n';
    });

    const mailtoLink = `mailto:hrishitjhaveri.work@gmail.com?cc=${this.email}&subject=${subject}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    // Optionally clear cart
    this.cartService.clearCart();
  }

  getItemTotal(item: any): number {
    if (item.combinations?.length) {
      return item.combinations.reduce((sum: number, c: any) => sum + (c.total || 0), 0);
    }
    return 0;
  }
  
  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.cartService.setCartItems(this.cartItems); // if using persistence
  }
}