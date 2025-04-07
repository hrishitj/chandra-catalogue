import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute } from '@angular/router';

interface Product {
  code: string;
  category: string;
  images: string[];
  description: string;
  prices: { [key: string]: number };
  selectedMetals: { [key: string]: boolean };
  selectedKarat: { [key: string]: boolean };
  quantity?: number;
  currentImageIndex?: number;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  imports: [CommonModule, FormsModule],
})
export class ProductListComponent implements OnInit, OnChanges {
  @Input() selectedCategory: string = '';

  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(private cartService: CartService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const rawCategory = params.get('category');
      console.log('Raw category from URL in product:', rawCategory);
      if (rawCategory) {
        // Convert slug back to title case if needed
        this.selectedCategory = rawCategory.replace(/-/g, ' ');
        this.products = this.getProducts(); 
        this.filterProducts();
      } else {
        this.filteredProducts = this.products; // Show all if no filter
      }
    });
  }

  ngOnChanges(): void {
    this.filterProducts();
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(p => p.category === this.selectedCategory);
  }

  nextImage(product: any) {
    if (!product.currentImageIndex) {
      product.currentImageIndex = 0;
    }
    if (product.currentImageIndex < product.images.length - 1) {
      product.currentImageIndex++;
    }
  }
  
  prevImage(product: any) {
    if (!product.currentImageIndex) {
      product.currentImageIndex = 0;
    }
    if (product.currentImageIndex > 0) {
      product.currentImageIndex--;
    }
  }
  

  getProducts(): Product[] {
    return [
      {
        code: 'B10390',
        category: 'Tennis Bracelet',
        images: ['assets/bracelets/B10390.PNG'],
        description: '1 CT',
        prices: { '10K': 399, '14K': 549 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'B10048',
        category: 'Tennis Bracelet',
        images: ['assets/bracelets/B10048.PNG'],
        description: '2 CT',
        prices: { '10K': 449, '14K': 599 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'B10049',
        category: 'Tennis Bracelet',
        images: ['assets/bracelets/B10049.PNG'],
        description: '3 CT',
        prices: { '10K': 499, '14K': 649 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'B10236',
        category: 'Tennis Bracelet',
        images: ['assets/bracelets/B10236.PNG'],
        description: '4 CT',
        prices: { '10K': 799, '14K': 1049 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'B10237',
        category: 'Tennis Bracelet',
        images: ['assets/bracelets/B10237.PNG'],
        description: '5 CT',
        prices: { '10K': 849, '14K': 1099 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'B10379',
        category: 'Tennis Bracelet',
        images: ['assets/bracelets/B10379.PNG'],
        description: '6 CT',
        prices: { '10K': 1149, '14K': 1449 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'B10378',
        category: 'Tennis Bracelet',
        images: ['assets/bracelets/B10378.PNG'],
        description: '7 CT',
        prices: { '10K': 1299, '14K': 1599 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'B10381',
        category: 'Tennis Bracelet',
        images: ['assets/bracelets/B10381.PNG'],
        description: '8 CT',
        prices: { '10K': 1549, '14K': 1949 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'B10389',
        category: 'Tennis Bracelet',
        images: ['assets/bracelets/B10389.PNG'],
        description: '9 CT',
        prices: { '10K': 1649, '14K': 2049 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'B10385',
        category: 'Tennis Bracelet',
        images: ['assets/bracelets/B10385.PNG'],
        description: '10 CT',
        prices: { '10K': 1799, '14K': 2199 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'E10120',
        category: 'Fancy Hoops',
        images: ['assets/hoops/E10120.png'],
        description: '3.36 CT Emerald',
        prices: { '10K': 849, '14K': 1099 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'E10121',
        category: 'Fancy Hoops',
        images: ['assets/hoops/E10121.png'],
        description: '3.60 CT Oval',
        prices: { '10K': 899, '14K': 1099 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'E10591',
        category: 'Fancy Hoops',
        images: ['assets/hoops/E10591.png'],
        description: '8.40 CT Emerald',
        prices: { '10K': 1549, '14K': 1799 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'E10592',
        category: 'Fancy Hoops',
        images: ['assets/hoops/E10592.png'],
        description: '9.52 CT Oval',
        prices: { '10K': 1799, '14K': 2149 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'N10175',
        category: 'Fancy Necklaces',
        images: ['assets/fancyNecklaces/N10175.png'],
        description: '19.25 CT',
        prices: { '10K': 3299, '14K': 3599 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'N10273',
        category: 'Fancy Necklaces',
        images: ['assets/fancyNecklaces/N10273.png'],
        description: '30.10 CT',
        prices: { '10K': 4849, '14K': 5299 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'N10275',
        category: 'Fancy Necklaces',
        images: ['assets/fancyNecklaces/N10275.png'],
        description: '20.08 CT',
        prices: { '10K': 4899, '14K': 5449 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'N10248',
        category: 'Fancy Necklaces',
        images: ['assets/fancyNecklaces/N10248.png'],
        description: '9.11 CT Emerald',
        prices: { '10K': 1999, '14K': 2399 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'N10281',
        category: 'Fancy Necklaces',
        images: ['assets/fancyNecklaces/N10281.png'],
        description: '10.26 CT Round',
        prices: { '10K': 2049, '14K': 2499 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'N10282',
        category: 'Fancy Necklaces',
        images: ['assets/fancyNecklaces/N10282.png'],
        description: '9.64 CT Asscher',
        prices: { '10K': 2249, '14K': 2649 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'N10141',
        category: 'Round Necklaces',
        images: ['assets/roundNecklaces/N10141.jpeg'],
        description: '3 CT',
        prices: { '10K': 699, '14K': 949 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'N10130',
        category: 'Round Necklaces',
        images: ['assets/roundNecklaces/N10130.jpeg'],
        description: '5 CT',
        prices: { '10K': 1299, '14K': 1799 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
      {
        code: 'N10252',
        category: 'Round Necklaces',
        images: ['assets/roundNecklaces/N10252.jpeg'],
        description: '7 CT',
        prices: { '10K': 1399, '14K': 1899 },
        selectedMetals: { W: false, Y: false, R: false },
        selectedKarat: { '10K': false, '14K': false },
      },
    ];
  }

  addToCart(product: any) {
    const item = {
      code: product.code,
      image: product.images[0],
      weight: product.description,
      metals: Object.keys(product.selectedMetals || {}).filter(k => product.selectedMetals[k]),
      karats: Object.keys(product.selectedKarat || {}).filter(k => product.selectedKarat[k]),
      quantity: product.quantity,
      price: product.prices,
    };

    this.cartService.addToCart(item);
    alert('Added to cart!');
  } 
  
}