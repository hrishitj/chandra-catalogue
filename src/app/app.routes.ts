import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
    {
      path: '',
      component: LayoutComponent,
      children: [
        { path: '', redirectTo: 'products', pathMatch: 'full' },
        { path: 'products', component: ProductListComponent },
        { path: 'products/:category', component: ProductListComponent },
        { path: 'cart', component: CartComponent }
      ]
    }
  ];
