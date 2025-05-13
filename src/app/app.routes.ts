import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: ProductListComponent },
    { path: 'products/:category', component: ProductListComponent },
    { path: 'cart', component: CartComponent }
  ];
