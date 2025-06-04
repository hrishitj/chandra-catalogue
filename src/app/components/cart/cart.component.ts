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
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfoq2e-8mmxDBoeD2-_omrmSkSIWM1cyZ_boOUXCy0AkEGamg/formResponse';
  
    const products = this.cartItems.map((item, index) => {
      let itemInfo = `#${index + 1} - ${item.code}\nWt: ${item.weight}\n`;
  
      item.combinations.forEach((combo: any, i: number) => {
        itemInfo += `  Combo ${i + 1}: ${combo.metal}-${combo.karat}, Qty: ${combo.quantity}, Price: $${combo.price}\n`;
      });
  
      return itemInfo;
    }).join('\n');
  
    const formData = new FormData();
    formData.append('entry.1401848244', this.name);      // replace with actual ID for "Name"
    formData.append('entry.901778223', this.email);     // replace with actual ID for "Email"
    formData.append('entry.1943096883', products);       // replace with actual ID for "Products"
  
    fetch(formUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    }).then(() => {
      alert('Enquiry submitted!');
      this.cartService.clearCart();
    }).catch((err) => {
      alert('Failed to send enquiry.');
      console.error(err);
    });
  }
  

  getItemTotal(item: any): number {
    if (item.combinations?.length) {
      return item.combinations.reduce((sum: number, c: any) => {
        return sum + (c.quantity * c.price);
      }, 0);
    }
    return 0;
  }
  
  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.cartService.setCartItems(this.cartItems); // if using persistence
  }
}