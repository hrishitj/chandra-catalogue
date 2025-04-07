import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  imports: [CommonModule, FormsModule],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
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
      body += `Metals: ${item.metals.join(', ')}\n`;
      body += `Karats: ${item.karats.join(', ')}\n`;
      body += `Qty: ${item.quantity}\n\n`;
    });
  
    const mailtoLink = `mailto:hrishitjhaveri.work@gmail.com?cc=${this.email}&subject=${subject}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    // Optionally clear cart
    this.cartService.clearCart();
  }
}
