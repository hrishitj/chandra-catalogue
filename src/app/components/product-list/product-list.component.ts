import { CommonModule } from '@angular/common';
import { Component, OnInit, OnChanges, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute } from '@angular/router';

interface Product {
  index: number;
  code: string;
  category: string;
  shape: string;
  images: string[];
  currentImageIndex?: number;
  ctw?: number; // total carat weight
  mw?: { tenKt: number, fourteenKt: number };  // metal weight
  prices: { [karat: string]: number };
  quantities: { [key: string]: number }; // e.g., 'W_10K': 2, 'Y_14K': 1
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit, OnChanges {

  products: Product[] = [];
  filteredProducts = signal<Product[]>([]);
  public selectedCategory = signal<string>('');

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
        this.selectedCategory.set(rawCategory.replace(/-/g, ' '));
        this.products = this.getProducts();
        this.syncQuantitiesFromCart();
        this.filterProducts();
      } else {
        this.filteredProducts.set(this.products); // Show all if no filter
      }
    });
  }

  ngOnChanges(): void {
    this.filterProducts();
  }

  filterProducts() {
    this.filteredProducts.set(this.products.filter(p => p.category === this.selectedCategory()));
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


  // getProducts(): Product[] {
  //   return [
  //     {
  //       code: 'B10390',
  //       category: 'Tennis Bracelet',
  //       images: ['assets/bracelets/B10390.PNG'],
  //       description: '1 CT',
  //       prices: { '10K': 399, '14K': 549 },
  //       ctw: 1,
  //       quantities: {}
  //     },
  //     {
  //       code: 'B10048',
  //       category: 'Tennis Bracelet',
  //       images: ['assets/bracelets/B10048.PNG'],
  //       description: '2 CT',
  //       prices: { '10K': 449, '14K': 599 },
  //       ctw: 2,
  //       quantities: {}
  //     },
  //     {
  //       code: 'B10049',
  //       category: 'Tennis Bracelet',
  //       images: ['assets/bracelets/B10049.PNG'],
  //       description: '3 CT',
  //       prices: { '10K': 499, '14K': 649 },
  //       ctw: 3,
  //       quantities: {}
  //     },
  //     {
  //       code: 'B10236',
  //       category: 'Tennis Bracelet',
  //       images: ['assets/bracelets/B10236.PNG'],
  //       description: '4 CT',
  //       prices: { '10K': 799, '14K': 1049 },
  //       ctw: 4,
  //       quantities: {}
  //     },
  //     {
  //       code: 'B10237',
  //       category: 'Tennis Bracelet',
  //       images: ['assets/bracelets/B10237.PNG'],
  //       description: '5 CT',
  //       prices: { '10K': 849, '14K': 1099 },
  //       ctw: 5,
  //       quantities: {}
  //     },
  //     {
  //       code: 'B10379',
  //       category: 'Tennis Bracelet',
  //       images: ['assets/bracelets/B10379.PNG'],
  //       description: '6 CT',
  //       prices: { '10K': 1149, '14K': 1449 },
  //       ctw: 6,
  //       quantities: {}
  //     },
  //     {
  //       code: 'B10378',
  //       category: 'Tennis Bracelet',
  //       images: ['assets/bracelets/B10378.PNG'],
  //       description: '7 CT',
  //       prices: { '10K': 1299, '14K': 1599 },
  //       ctw: 7,
  //       quantities: {}
  //     },
  //     {
  //       code: 'B10381',
  //       category: 'Tennis Bracelet',
  //       images: ['assets/bracelets/B10381.PNG'],
  //       description: '8 CT',
  //       prices: { '10K': 1549, '14K': 1949 },
  //       ctw: 8,
  //       quantities: {}
  //     },
  //     {
  //       code: 'B10389',
  //       category: 'Tennis Bracelet',
  //       images: ['assets/bracelets/B10389.PNG'],
  //       description: '9 CT',
  //       prices: { '10K': 1649, '14K': 2049 },
  //       ctw: 9,
  //       quantities: {}
  //     },
  //     {
  //       code: 'B10385',
  //       category: 'Tennis Bracelet',
  //       images: ['assets/bracelets/B10385.PNG'],
  //       description: '10 CT',
  //       prices: { '10K': 1799, '14K': 2199 },
  //       ctw: 10,
  //       quantities: {}
  //     },
  //     {
  //       code: 'E10120',
  //       category: 'Earrings',
  //       images: ['assets/hoops/E10120.png'],
  //       description: '3.36 CT Emerald',
  //       prices: { '10K': 849, '14K': 1099 },
  //       quantities: {}
  //     },
  //     {
  //       code: 'E10121',
  //       category: 'Earrings',
  //       images: ['assets/hoops/E10121.png'],
  //       description: '3.60 CT Oval',
  //       prices: { '10K': 899, '14K': 1099 },
  //       quantities: {}
  //     },
  //     {
  //       code: 'E10591',
  //       category: 'Earrings',
  //       images: ['assets/hoops/E10591.png'],
  //       description: '8.40 CT Emerald',
  //       prices: { '10K': 1549, '14K': 1799 },
  //       quantities: {}
  //     },
  //     {
  //       code: 'E10592',
  //       category: 'Earrings',
  //       images: ['assets/hoops/E10592.png'],
  //       description: '9.52 CT Oval',
  //       prices: { '10K': 1799, '14K': 2149 },
  //       quantities: {}
  //     },
  //     {
  //       code: 'N10175',
  //       category: 'Necklaces',
  //       images: ['assets/fancyNecklaces/N10175.png'],
  //       description: '19.25 CT',
  //       prices: { '10K': 3299, '14K': 3599 },
  //       quantities: {}
  //     },
  //     {
  //       code: 'N10273',
  //       category: 'Necklaces',
  //       images: ['assets/fancyNecklaces/N10273.png'],
  //       description: '30.10 CT',
  //       prices: { '10K': 4849, '14K': 5299 },
  //       quantities: {}
  //     },
  //     {
  //       code: 'N10275',
  //       category: 'Necklaces',
  //       images: ['assets/fancyNecklaces/N10275.png'],
  //       description: '20.08 CT',
  //       prices: { '10K': 4899, '14K': 5449 },
  //       quantities: {}
  //     },
  //     {
  //       code: 'N10248',
  //       category: 'Necklaces',
  //       images: ['assets/fancyNecklaces/N10248.png'],
  //       description: '9.11 CT Emerald',
  //       prices: { '10K': 1999, '14K': 2399 },
  //       quantities: {}
  //     },
  //     {
  //       code: 'N10281',
  //       category: 'Necklaces',
  //       images: ['assets/fancyNecklaces/N10281.png'],
  //       description: '10.26 CT Round',
  //       prices: { '10K': 2049, '14K': 2499 },
  //       quantities: {}
  //     },
  //     {
  //       code: 'N10282',
  //       category: 'Necklaces',
  //       images: ['assets/fancyNecklaces/N10282.png'],
  //       description: '9.64 CT Asscher',
  //       prices: { '10K': 2249, '14K': 2649 },
  //       quantities: {}
  //     },
  //     {
  //       code: 'N10141',
  //       category: 'Necklaces',
  //       images: ['assets/roundNecklaces/N10141.jpeg'],
  //       description: '3 CT',
  //       prices: { '10K': 699, '14K': 949 },
  //       quantities: {}
  //     },
  //     {
  //       code: 'N10130',
  //       category: 'Necklaces',
  //       images: ['assets/roundNecklaces/N10130.jpeg'],
  //       description: '5 CT',
  //       prices: { '10K': 1299, '14K': 1799 },
  //       quantities: {}
  //     },
  //     {
  //       code: 'N10252',
  //       category: 'Necklaces',
  //       images: ['assets/roundNecklaces/N10252.jpeg'],
  //       description: '7 CT',
  //       prices: { '10K': 1399, '14K': 1899 },
  //       quantities: {}
  //     },
  //   ];
  // }

  getProducts(): Product[] {
    return [
      {
        index: 1,
        code: 'E10120',
        category: 'Earrings',
        shape: 'Emerald',
        images: [
          'assets/earrings/E10120.png'
        ],
        ctw: 3.36,
        mw: {
          tenKt: 7.82,
          fourteenKt: 9.03
        },
        prices: {
          '14K': 1320.0,
          '10K': 1050.0
        },
        quantities: {}
      },
      {
        index: 2,
        code: 'E10121',
        category: 'Earrings',
        shape: 'Oval',
        images: [
          'assets/earrings/E10121.png'
        ],
        ctw: 3.6,
        mw: {
          tenKt: 7.768,
          fourteenKt: 8.97
        },
        prices: {
          '14K': 1350.0,
          '10K': 1080.0
        },
        quantities: {

        }
      },
      {
        index: 3,
        code: 'E10591',
        category: 'Earrings',
        shape: 'Emerald',
        images: [
          'assets/earrings/E10591.png'
        ],
        ctw: 8.4,
        mw: {
          tenKt: 8.41,
          fourteenKt: 9.711
        },
        prices: {
          '14K': 2130.0,
          '10K': 1800.0
        },
        quantities: {

        }
      },
      {
        index: 4,
        code: 'E10592',
        category: 'Earrings',
        shape: 'Oval',
        images: [
          'assets/earrings/E10592.png'
        ],
        ctw: 9.52,
        mw: {
          tenKt: 11.0,
          fourteenKt: 12.702
        },
        prices: {
          '14K': 2550.0,
          '10K': 2160.0
        },
        quantities: {

        }
      },
      {
        index: 5,
        code: 'R10955',
        category: 'Bands',
        shape: 'Emerald',
        images: [
          'assets/bands/R10955.png'
        ],
        ctw: 3.6,
        mw: {
          tenKt: 4.763,
          fourteenKt: 5.5
        },
        prices: {
          '14K': 1050.0,
          '10K': 870.0
        },
        quantities: {

        }
      },
      {
        index: 6,
        code: 'R10956',
        category: 'Bands',
        shape: 'Oval',
        images: [
          'assets/bands/R10956.png'
        ],
        ctw: 3.6,
        mw: {
          tenKt: 6.062,
          fourteenKt: 7.0
        },
        prices: {
          '14K': 1170.0,
          '10K': 960.0
        },
        quantities: {

        }
      },
      {
        index: 7,
        code: 'R11246',
        category: 'Bands',
        shape: 'Oval',
        images: [
          'assets/bands/R11246.png'
        ],
        ctw: 4.154,
        mw: {
          tenKt: 6.183,
          fourteenKt: 7.14
        },
        prices: {
          '14K': 1290.0,
          '10K': 1050.0
        },
        quantities: {

        }
      },
      {
        index: 8,
        code: 'R11254',
        category: 'Bands',
        shape: 'Emerald',
        images: [
          'assets/bands/R11254.png'
        ],
        ctw: 4.028,
        mw: {
          tenKt: 4.33,
          fourteenKt: 5.0
        },
        prices: {
          '14K': 1080.0,
          '10K': 900.0
        },
        quantities: {

        }
      },
      {
        index: 9,
        code: 'R11192',
        category: 'Rings',
        shape: 'Emerald',
        images: [
          'assets/rings/R11192.png'
        ],
        ctw: 5.5,
        mw: {
          tenKt: 4.867,
          fourteenKt: 5.62
        },
        prices: {
          '14K': 1320.0,
          '10K': 1140.0
        },
        quantities: {

        }
      },
      {
        index: 10,
        code: 'B10267',
        category: 'Bracelets',
        shape: 'Emerald',
        images: [
          'assets/bracelets/B10267.PNG'
        ],
        ctw: 7.0,
        mw: {
          tenKt: 9.338,
          fourteenKt: 10.79
        },
        prices: {
          '14K': 2010.0,
          '10K': 1680.0
        },
        quantities: {

        }
      },
      {
        index: 11,
        code: 'B10144',
        category: 'Bracelets',
        shape: 'Emerald',
        images: [
          'assets/bracelets/B10144.PNG'
        ],
        ctw: 10.05,
        mw: {
          tenKt: 8.827,
          fourteenKt: 10.2
        },
        prices: {
          '14K': 2400.0,
          '10K': 2070.0
        },
        quantities: {

        }
      },
      {
        index: 12,
        code: 'B10274',
        category: 'Bracelets',
        shape: 'Emerald',
        images: [
          'assets/bracelets/B10274.PNG'
        ],
        ctw: 9.28,
        mw: {
          tenKt: 9.856,
          fourteenKt: 11.388
        },
        prices: {
          '14K': 2400.0,
          '10K': 2040.0
        },
        quantities: {

        }
      },
      {
        index: 13,
        code: 'B10161',
        category: 'Bracelets',
        shape: 'Oval',
        images: [
          'assets/bracelets/B10161.PNG'
        ],
        ctw: 9.8,
        mw: {
          tenKt: 10.429,
          fourteenKt: 12.05
        },
        prices: {
          '14K': 2550.0,
          '10K': 2160.0
        },
        quantities: {

        }
      },
      {
        index: 14,
        code: 'B10162',
        category: 'Bracelets',
        shape: 'Oval',
        images: [
          'assets/bracelets/B10162.PNG'
        ],
        ctw: 11.52,
        mw: {
          tenKt: 12.767,
          fourteenKt: 14.75
        },
        prices: {
          '14K': 3030.0,
          '10K': 2580.0
        },
        quantities: {

        }
      },
      {
        index: 15,
        code: 'B10163',
        category: 'Bracelets',
        shape: 'Oval',
        images: [
          'assets/bracelets/B10163.PNG'
        ],
        ctw: 17.1,
        mw: {
          tenKt: 14.586,
          fourteenKt: 16.85
        },
        prices: {
          '14K': 4050.0,
          '10K': 3510.0
        },
        quantities: {

        }
      },
      {
        index: 16,
        code: 'B10200',
        category: 'Bracelets',
        shape: 'Oval',
        images: [
          'assets/bracelets/B10200.PNG'
        ],
        ctw: 8.25,
        mw: {
          tenKt: 7.51,
          fourteenKt: 8.679
        },
        prices: {
          '14K': 2010.0,
          '10K': 1740.0
        },
        quantities: {

        }
      },
      {
        index: 17,
        code: 'B10421',
        category: 'Bracelets',
        shape: 'Emerald',
        images: [
          'assets/bracelets/B10421.PNG'
        ],
        ctw: 6,
        mw: {
          tenKt: 6.236,
          fourteenKt: 7.208
        },
        prices: {
          '14K': 1590.0,
          '10K': 1350.0
        },
        quantities: {

        }
      },
      {
        index: 18,
        code: 'B10403',
        category: 'Bracelets',
        shape: 'Pear',
        images: [
          'assets/bracelets/B10403.PNG'
        ],
        ctw: 6.0,
        mw: {
          tenKt: 6.359,
          fourteenKt: 7.35
        },
        prices: {
          '14K': 1560.0,
          '10K': 1320.0
        },
        quantities: {

        }
      },
      {
        index: 19,
        code: 'B10228',
        category: 'Bracelets',
        shape: 'Marquise',
        images: [
          'assets/bracelets/B10228.PNG'
        ],
        ctw: 4.26006,
        mw: {
          tenKt: 4.627,
          fourteenKt: 5.35
        },
        prices: {
          '14K': 1110.0,
          '10K': 960.0
        },
        quantities: {

        }
      },
      {
        index: 20,
        code: 'B10227',
        category: 'Bracelets',
        shape: 'Marquise',
        images: [
          'assets/bracelets/B10227.PNG'
        ],
        ctw: 3.75,
        mw: {
          tenKt: 4.436,
          fourteenKt: 5.13
        },
        prices: {
          '14K': 1020.0,
          '10K': 870.0
        },
        quantities: {

        }
      },
      {
        index: 21,
        code: 'B10226',
        category: 'Bracelets',
        shape: 'Marquise',
        images: [
          'assets/bracelets/B10226.PNG'
        ],
        ctw: 3.36,
        mw: {
          tenKt: 4.107,
          fourteenKt: 4.75
        },
        prices: {
          '14K': 930.0,
          '10K': 780.0
        },
        quantities: {

        }
      },
      {
        index: 22,
        code: 'B10369',
        category: 'Bracelets',
        shape: 'Oval',
        images: [
          'assets/bracelets/B10369.PNG'
        ],
        ctw: 12.12,
        mw: {
          tenKt: 15.797,
          fourteenKt: 18.248
        },
        prices: {
          '14K': 3330.0,
          '10K': 2760.0
        },
        quantities: {

        }
      },
      {
        index: 23,
        code: 'B10427',
        category: 'Bracelets',
        shape: 'Emerald',
        images: [
          'assets/bracelets/B10427.PNG'
        ],
        ctw: 9.309999999999999,
        mw: {
          tenKt: 11.381,
          fourteenKt: 13.149
        },
        prices: {
          '14K': 2580.0,
          '10K': 2160.0
        },
        quantities: {

        }
      },
      {
        index: 24,
        code: 'B10156',
        category: 'Bracelets',
        shape: 'Pear',
        images: [
          'assets/bracelets/B10156.PNG'
        ],
        ctw: 2.8,
        mw: {
          tenKt: 6.653,
          fourteenKt: 7.69
        },
        prices: {
          '14K': 1110.0,
          '10K': 870.0
        },
        quantities: {

        }
      },
      {
        index: 25,
        code: 'B10158',
        category: 'Bracelets',
        shape: 'Oval',
        images: [
          'assets/bracelets/B10158.PNG'
        ],
        ctw: 7.05,
        mw: {
          tenKt: 6.402,
          fourteenKt: 7.4
        },
        prices: {
          '14K': 1710.0,
          '10K': 1470.0
        },
        quantities: {

        }
      },
      {
        index: 26,
        code: 'B10159',
        category: 'Bracelets',
        shape: 'Pc',
        images: [
          'assets/bracelets/B10159.PNG'
        ],
        ctw: 7.92,
        mw: {
          tenKt: 9.96,
          fourteenKt: 11.508
        },
        prices: {
          '14K': 2220.0,
          '10K': 1860.0
        },
        quantities: {

        }
      },
      {
        index: 27,
        code: 'B10331',
        category: 'Bracelets',
        shape: 'Emerald',
        images: [
          'assets/bracelets/B10331.PNG'
        ],
        ctw: 8.09,
        mw: {
          tenKt: 4.401,
          fourteenKt: 5.089
        },
        prices: {
          '14K': 1650.0,
          '10K': 1500.0
        },
        quantities: {

        }
      },
      {
        index: 28,
        code: 'N10175',
        category: 'Necklaces',
        shape: 'Heart',
        images: [
          'assets/necklaces/N10175.png'
        ],
        ctw: 19.25,
        mw: {
          tenKt: 12.341,
          fourteenKt: 14.25
        },
        prices: {
          '14K': 4320.0,
          '10K': 3840.0
        },
        quantities: {

        }
      },
      {
        index: 29,
        code: 'N10273',
        category: 'Necklaces',
        shape: 'Emerald',
        images: [
          'assets/necklaces/N10273.png'
        ],
        ctw: 30.1,
        mw: {
          tenKt: 16.193,
          fourteenKt: 18.698
        },
        prices: {
          '14K': 6300.0,
          '10K': 5700.0
        },
        quantities: {

        }
      },
      {
        index: 30,
        code: 'N10275',
        category: 'Necklaces',
        shape: 'Heart',
        images: [
          'assets/necklaces/N10275.png'
        ],
        ctw: 20.079,
        mw: {
          tenKt: 19.265,
          fourteenKt: 22.249
        },
        prices: {
          '14K': 6510.0,
          '10K': 5790.0
        },
        quantities: {

        }
      },
      {
        index: 31,
        code: 'N10248',
        category: 'Necklaces',
        shape: 'Emerald',
        images: [
          'assets/necklaces/N10248.png'
        ],
        ctw: 9.11,
        mw: {
          tenKt: 14.137,
          fourteenKt: 16.33
        },
        prices: {
          '14K': 2910.0,
          '10K': 2370.0
        },
        quantities: {

        }
      },
      {
        index: 32,
        code: 'N10281',
        category: 'Necklaces',
        shape: 'Round',
        images: [
          'assets/necklaces/N10281.png'
        ],
        ctw: 10.26,
        mw: {
          tenKt: 15.651,
          fourteenKt: 18.078
        },
        prices: {
          '14K': 3030.0,
          '10K': 2460.0
        },
        quantities: {

        }
      },
      {
        index: 33,
        code: 'N10282',
        category: 'Necklaces',
        shape: 'Asscher',
        images: [
          'assets/necklaces/N10282.png'
        ],
        ctw: 9.64,
        mw: {
          tenKt: 14.57,
          fourteenKt: 16.83
        },
        prices: {
          '14K': 3210.0,
          '10K': 2670.0
        },
        quantities: {

        }
      },
      {
        index: 34,
        code: 'R20401',
        category: 'Bands',
        shape: 'Emerald',
        images: [
          'assets/bands/R20401.png'
        ],
        ctw: 7.2,
        mw: {
          tenKt: 2.139,
          fourteenKt: 2.47
        },
        prices: {
          '14K': 1290.0,
          '10K': 1200.0
        },
        quantities: {

        }
      },
      {
        index: 35,
        code: 'R10965',
        category: 'Bands',
        shape: 'Asscher',
        images: [
          'assets/bands/R10965.jpeg'
        ],
        ctw: 8.25,
        mw: {
          tenKt: 2.918,
          fourteenKt: 3.369
        },
        prices: {
          '14K': 1710.0,
          '10K': 1620.0
        },
        quantities: {

        }
      },
      {
        index: 36,
        code: 'R11190',
        category: 'Bands',
        shape: 'Oval',
        images: [
          'assets/bands/R11190.jpeg'
        ],
        ctw: 7.2,
        mw: {
          tenKt: 4.919,
          fourteenKt: 5.68
        },
        prices: {
          '14K': 1590.0,
          '10K': 1410.0
        },
        quantities: {

        }
      },
      {
        index: 37,
        code: 'R10429/EM',
        category: 'Rings',
        shape: 'Emerald',
        images: [
          'assets/rings/R10429/EM.PNG'
        ],
        ctw: 2.8,
        mw: {
          tenKt: 4.33,
          fourteenKt: 5.0
        },
        prices: {
          '14K': 870.0,
          '10K': 720.0
        },
        quantities: {

        }
      },
      {
        index: 38,
        code: 'R10434/EM',
        category: 'Rings',
        shape: 'Emerald',
        images: [
          'assets/rings/R10434/EM.PNG'
        ],
        ctw: 3.75,
        mw: {
          tenKt: 4.33,
          fourteenKt: 5.0
        },
        prices: {
          '14K': 1020.0,
          '10K': 840.0
        },
        quantities: {

        }
      },
      {
        index: 39,
        code: 'R10430/EM',
        category: 'Rings',
        shape: 'Emerald',
        images: [
          'assets/rings/R10430/EM.PNG'
        ],
        ctw: 4.8,
        mw: {
          tenKt: 5.109,
          fourteenKt: 5.9
        },
        prices: {
          '14K': 1260.0,
          '10K': 1050.0
        },
        quantities: {

        }
      },
      {
        index: 40,
        code: 'R10429/OV',
        category: 'Rings',
        shape: 'Oval',
        images: [
          'assets/rings/R10429/OV.PNG'
        ],
        ctw: 2.5,
        mw: {
          tenKt: 3.377,
          fourteenKt: 3.9
        },
        prices: {
          '14K': 720.0,
          '10K': 600.0
        },
        quantities: {

        }
      },
      {
        index: 41,
        code: 'R10434/OV',
        category: 'Rings',
        shape: 'Oval',
        images: [
          'assets/rings/R10434/OV.PNG'
        ],
        ctw: 3.15,
        mw: {
          tenKt: 4.062,
          fourteenKt: 4.69
        },
        prices: {
          '14K': 900.0,
          '10K': 750.0
        },
        quantities: {

        }
      },
      {
        index: 42,
        code: 'R10430/OV',
        category: 'Rings',
        shape: 'Oval',
        images: [
          'assets/rings/R10430/OV.PNG'
        ],
        ctw: 4.2,
        mw: {
          tenKt: 4.753,
          fourteenKt: 5.488
        },
        prices: {
          '14K': 1110.0,
          '10K': 960.0
        },
        quantities: {

        }
      },
            {
        index: 46,
        code: 'E10006',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10006.png'
        ],
        ctw: 1,
        mw: {
          tenKt: 1.063,
          fourteenKt: 1.25
        },
        prices: {
          '14K': 270.0,
          '10K': 210.0
        },
        quantities: {

        }
      },
      {
        index: 47,
        code: 'E10007',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10007.png'
        ],
        ctw: 2,
        mw: {
          tenKt: 1.366,
          fourteenKt: 1.6
        },
        prices: {
          '14K': 540.0,
          '10K': 480.0
        },
        quantities: {

        }
      },
      {
        index: 43,
        code: 'E10008',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10008.PNG'
        ],
        ctw: 1,
        mw: {
          tenKt: 1.063,
          fourteenKt: 1.25
        },
        prices: {
          '14K': 270.0,
          '10K': 210.0
        },
        quantities: {

        }
      },
      {
        index: 44,
        code: 'E10009',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10009.PNG'
        ],
        ctw: 2,
        mw: {
          tenKt: 1.366,
          fourteenKt: 1.6
        },
        prices: {
          '14K': 540.0,
          '10K': 480.0
        },
        quantities: {

        }
      },
      {
        index: 45,
        code: 'E10010',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10010.png'
        ],
        ctw: 4,
        mw: {
          tenKt: 2.145,
          fourteenKt: 2.499
        },
        prices: {
          '14K': 1020.0,
          '10K': 930.0
        },
        quantities: {

        }
      },
      {
        index: 48,
        code: 'E10018',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10018.PNG'
        ],
        ctw: 4,
        mw: {
          tenKt: 2.145,
          fourteenKt: 2.499
        },
        prices: {
          '14K': 1020.0,
          '10K': 930.0
        },
        quantities: {

        }
      },
      {
        index: 49,
        code: 'E10479',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10479.png'
        ],
        ctw: 2,
        mw: {
          tenKt: 1.158,
          fourteenKt: 1.36
        },
        prices: {
          '14K': 510.0,
          '10K': 450.0
        },
        quantities: {

        }
      },
      {
        index: 50,
        code: 'E10480',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10480.PNG'
        ],
        ctw: 3,
        mw: {
          tenKt: 1.487,
          fourteenKt: 1.74
        },
        prices: {
          '14K': 750.0,
          '10K': 690.0
        },
        quantities: {

        }
      },
      {
        index: 51,
        code: 'E10481',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10481.jpeg'
        ],
        ctw: 4,
        mw: {
          tenKt: 1.851,
          fourteenKt: 2.16
        },
        prices: {
          '14K': 990.0,
          '10K': 900.0
        },
        quantities: {

        }
      },
      {
        index: 52,
        code: 'E10482',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10482.jpeg'
        ],
        ctw: 5,
        mw: {
          tenKt: 2.145,
          fourteenKt: 2.499
        },
        prices: {
          '14K': 1230.0,
          '10K': 1140.0
        },
        quantities: {

        }
      },
      {
        index: 53,
        code: 'E10483',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10483.jpeg'
        ],
        ctw: 6,
        mw: {
          tenKt: 2.371,
          fourteenKt: 2.76
        },
        prices: {
          '14K': 1560.0,
          '10K': 1470.0
        },
        quantities: {

        }
      },
      {
        index: 54,
        code: 'E10011',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10011.jpg'
        ],
        ctw: 1,
        mw: {
          tenKt: 1.002,
          fourteenKt: 1.18
        },
        prices: {
          '14K': 240.0,
          '10K': 210.0
        },
        quantities: {

        }
      },
      {
        index: 55,
        code: 'E10012',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10012.png'
        ],
        ctw: 2,
        mw: {
          tenKt: 1.453,
          fourteenKt: 1.7
        },
        prices: {
          '14K': 540.0,
          '10K': 480.0
        },
        quantities: {

        }
      },
      {
        index: 56,
        code: 'E10013',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10013.jpg'
        ],
        ctw: 4,
        mw: {
          tenKt: 2.145,
          fourteenKt: 2.499
        },
        prices: {
          '14K': 1020.0,
          '10K': 930.0
        },
        quantities: {

        }
      },
      {
        index: 57,
        code: 'E10586',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10586.jpeg'
        ],
        ctw: 1.192,
        mw: {
          tenKt: 1.279,
          fourteenKt: 1.5
        },
        prices: {
          '14K': 330.0,
          '10K': 270.0
        },
        quantities: {

        }
      },
      {
        index: 59,
        code: 'E10587',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10587.jpeg'
        ],
        ctw: 2.264,
        mw: {
          tenKt: 1.453,
          fourteenKt: 1.7
        },
        prices: {
          '14K': 600.0,
          '10K': 540.0
        },
        quantities: {

        }
      },
      {
        index: 58,
        code: 'E10588',
        category: 'Earrings',
        shape: 'Round',
        images: [
          'assets/earrings/E10588.jpeg'
        ],
        ctw: 3.352,
        mw: {
          tenKt: 1.712,
          fourteenKt: 1.999
        },
        prices: {
          '14K': 840.0,
          '10K': 780.0
        },
        quantities: {

        }
      },
      {
        index: 60,
        code: 'E10444',
        category: 'Earrings',
        shape: 'Princess',
        images: [
          'assets/earrings/E10444.png'
        ],
        ctw: 6,
        mw: {
          tenKt: 2.319,
          fourteenKt: 2.7
        },
        prices: {
          '14K': 1590.0,
          '10K': 1500.0
        },
        quantities: {

        }
      },
      {
        index: 61,
        code: 'E10478',
        category: 'Earrings',
        shape: 'Ascher',
        images: [
          'assets/earrings/E10478.png'
        ],
        ctw: 6,
        mw: {
          tenKt: 1.756,
          fourteenKt: 2.05
        },
        prices: {
          '14K': 1530.0,
          '10K': 1470.0
        },
        quantities: {

        }
      },
      {
        index: 62,
        code: 'P10005',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10005.png'
        ],
        ctw: 0.5,
        mw: {
          tenKt: 2.387,
          fourteenKt: 2.761
        },
        prices: {
          '14K': 360.0,
          '10K': 270.0
        },
        quantities: {

        }
      },
      {
        index: 63,
        code: 'P10006',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10006.png'
        ],
        ctw: 1,
        mw: {
          tenKt: 2.655,
          fourteenKt: 3.07
        },
        prices: {
          '14K': 510.0,
          '10K': 390.0
        },
        quantities: {

        }
      },
      {
        index: 64,
        code: 'P10007',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10007.png'
        ],
        ctw: 2,
        mw: {
          tenKt: 3.036,
          fourteenKt: 3.51
        },
        prices: {
          '14K': 750.0,
          '10K': 630.0
        },
        quantities: {

        }
      },
      {
        index: 65,
        code: 'P10580',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10580.PNG'
        ],
        ctw: 3,
        mw: {
          tenKt: 2.628,
          fourteenKt: 3.04
        },
        prices: {
          '14K': 960.0,
          '10K': 840.0
        },
        quantities: {

        }
      },
      {
        index: 66,
        code: 'P10009',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10009.PNG'
        ],
        ctw: 0.5,
        mw: {
          tenKt: 2.387,
          fourteenKt: 2.761
        },
        prices: {
          '14K': 360.0,
          '10K': 270.0
        },
        quantities: {

        }
      },
      {
        index: 67,
        code: 'P10010',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10010.PNG'
        ],
        ctw: 1,
        mw: {
          tenKt: 2.655,
          fourteenKt: 3.07
        },
        prices: {
          '14K': 510.0,
          '10K': 390.0
        },
        quantities: {

        }
      },
      {
        index: 68,
        code: 'P10011',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10011.PNG'
        ],
        ctw: 2,
        mw: {
          tenKt: 3.036,
          fourteenKt: 3.51
        },
        prices: {
          '14K': 750.0,
          '10K': 630.0
        },
        quantities: {

        }
      },
      {
        index: 69,
        code: 'P10012',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10012.PNG'
        ],
        ctw: 3,
        mw: {
          tenKt: 3.819,
          fourteenKt: 4.414
        },
        prices: {
          '14K': 1080.0,
          '10K': 930.0
        },
        quantities: {

        }
      },
      {
        index: 70,
        code: 'P10559',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10559.PNG'
        ],
        ctw: 1.25,
        mw: {
          tenKt: 0.303,
          fourteenKt: 0.35
        },
        prices: {
          '14K': 270.0,
          '10K': 270.0
        },
        quantities: {

        }
      },
      {
        index: 71,
        code: 'P10499',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10499.PNG'
        ],
        ctw: 1.177,
        mw: {
          tenKt: 2.113,
          fourteenKt: 2.44
        },
        prices: {
          '14K': 480.0,
          '10K': 390.0
        },
        quantities: {

        }
      },
      {
        index: 72,
        code: 'P10272',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10272.PNG'
        ],
        ctw: 2.2,
        mw: {
          tenKt: 2.234,
          fourteenKt: 2.58
        },
        prices: {
          '14K': 690.0,
          '10K': 600.0
        },
        quantities: {

        }
      },
      {
        index: 73,
        code: 'P10273',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10273.PNG'
        ],
        ctw: 3,
        mw: {
          tenKt: 2.113,
          fourteenKt: 4.414
        },
        prices: {
          '14K': 930.0,
          '10K': 840.0
        },
        quantities: {

        }
      },
      {
        index: 74,
        code: 'P10411',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10411.PNG'
        ],
        ctw: 2,
        mw: {
          tenKt: 2.632,
          fourteenKt: 3.039
        },
        prices: {
          '14K': 690.0,
          '10K': 570.0
        },
        quantities: {

        }
      },
      {
        index: 75,
        code: 'P10410',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10410.PNG'
        ],
        ctw: 1,
        mw: {
          tenKt: 2.234,
          fourteenKt: 2.58
        },
        prices: {
          '14K': 450.0,
          '10K': 360.0
        },
        quantities: {

        }
      },
      {
        index: 76,
        code: 'P10334',
        category: 'Pendants',
        shape: 'Round',
        images: [
          'assets/pendants/P10334.PNG'
        ],
        ctw: 0.597,
        mw: {
          tenKt: 4.025,
          fourteenKt: 4.65
        },
        prices: {
          '14K': 540.0,
          '10K': 390.0
        },
        quantities: {

        }
      },
      {
        index: 77,
        code: 'P10412',
        category: 'Pendants',
        shape: 'Emerald',
        images: [
          'assets/pendants/P10412.PNG'
        ],
        ctw: 1,
        mw: {
          tenKt: 2.156,
          fourteenKt: 2.49
        },
        prices: {
          '14K': 420.0,
          '10K': 330.0
        },
        quantities: {

        }
      },
      {
        index: 78,
        code: 'P10413',
        category: 'Pendants',
        shape: 'Emerald',
        images: [
          'assets/pendants/P10413.PNG'
        ],
        ctw: 2,
        mw: {
          tenKt: 2.459,
          fourteenKt: 2.84
        },
        prices: {
          '14K': 660.0,
          '10K': 570.0
        },
        quantities: {

        }
      },
      {
        index: 79,
        code: 'P10414',
        category: 'Pendants',
        shape: 'Pear',
        images: [
          'assets/pendants/P10414.PNG'
        ],
        ctw: 1,
        mw: {
          tenKt: 2.243,
          fourteenKt: 2.59
        },
        prices: {
          '14K': 420.0,
          '10K': 330.0
        },
        quantities: {

        }
      },
      {
        index: 80,
        code: 'P10415',
        category: 'Pendants',
        shape: 'Pear',
        images: [
          'assets/pendants/P10415.PNG'
        ],
        ctw: 2,
        mw: {
          tenKt: 2.546,
          fourteenKt: 2.94
        },
        prices: {
          '14K': 720.0,
          '10K': 600.0
        },
        quantities: {

        }
      },
      {
        index: 81,
        code: 'B10390',
        category: 'Bracelets',
        shape: 'Round',
        images: [
          'assets/bracelets/B10390.PNG'
        ],
        ctw: 1.16,
        mw: {
          tenKt: 4.973,
          fourteenKt: 5.75
        },
        prices: {
          '14K': 660.0,
          '10K': 480.0
        },
        quantities: {

        }
      },
      {
        index: 82,
        code: 'B10048',
        category: 'Bracelets',
        shape: 'Round',
        images: [
          'assets/bracelets/B10048.PNG'
        ],
        ctw: 2.025,
        mw: {
          tenKt: 5.146,
          fourteenKt: 5.95
        },
        prices: {
          '14K': 720.0,
          '10K': 540.0
        },
        quantities: {

        }
      },
      {
        index: 83,
        code: 'B10049',
        category: 'Bracelets',
        shape: 'Round',
        images: [
          'assets/bracelets/B10049.PNG'
        ],
        ctw: 3.0959999999999996,
        mw: {
          tenKt: 5.146,
          fourteenKt: 5.95
        },
        prices: {
          '14K': 810.0,
          '10K': 630.0
        },
        quantities: {

        }
      },
      {
        index: 84,
        code: 'B10236',
        category: 'Bracelets',
        shape: 'Round',
        images: [
          'assets/bracelets/B10236.PNG'
        ],
        ctw: 4.03,
        mw: {
          tenKt: 8.801,
          fourteenKt: 10.17
        },
        prices: {
          '14K': 1260.0,
          '10K': 930.0
        },
        quantities: {

        }
      },
      {
        index: 85,
        code: 'B10237',
        category: 'Bracelets',
        shape: 'Round',
        images: [
          'assets/bracelets/B10237.PNG'
        ],
        ctw: 4.96,
        mw: {
          tenKt: 8.853,
          fourteenKt: 10.23
        },
        prices: {
          '14K': 1380.0,
          '10K': 1050.0
        },
        quantities: {

        }
      },
      {
        index: 86,
        code: 'B10379',
        category: 'Bracelets',
        shape: 'Round',
        images: [
          'assets/bracelets/B10379.PNG'
        ],
        ctw: 6.16,
        mw: {
          tenKt: 11.484,
          fourteenKt: 13.268
        },
        prices: {
          '14K': 1800.0,
          '10K': 1380.0
        },
        quantities: {

        }
      },
      {
        index: 87,
        code: 'B10378',
        category: 'Bracelets',
        shape: 'Round',
        images: [
          'assets/bracelets/B10378.PNG'
        ],
        ctw: 7.28,
        mw: {
          tenKt: 11.823,
          fourteenKt: 13.66
        },
        prices: {
          '14K': 1980.0,
          '10K': 1530.0
        },
        quantities: {

        }
      },
      {
        index: 88,
        code: 'B10381',
        category: 'Bracelets',
        shape: 'Round',
        images: [
          'assets/bracelets/B10381.PNG'
        ],
        ctw: 7.92,
        mw: {
          tenKt: 14.905,
          fourteenKt: 17.218
        },
        prices: {
          '14K': 2400.0,
          '10K': 1860.0
        },
        quantities: {

        }
      },
      {
        index: 89,
        code: 'B10389',
        category: 'Bracelets',
        shape: 'Round',
        images: [
          'assets/bracelets/B10389.PNG'
        ],
        ctw: 9.02,
        mw: {
          tenKt: 12.939,
          fourteenKt: 14.948
        },
        prices: {
          '14K': 2460.0,
          '10K': 1980.0
        },
        quantities: {

        }
      },
      {
        index: 90,
        code: 'B10385',
        category: 'Bracelets',
        shape: 'Round',
        images: [
          'assets/bracelets/B10385.PNG'
        ],
        ctw: 10.0,
        mw: {
          tenKt: 13.72,
          fourteenKt: 15.85
        },
        prices: {
          '14K': 2670.0,
          '10K': 2160.0
        },
        quantities: {

        }
      },
      {
        index: 91,
        code: 'N10130',
        category: 'Necklaces',
        shape: 'Round',
        images: [
          'assets/necklaces/N10130.jpeg'
        ],
        ctw: 4.78,
        mw: {
          tenKt: 17.529,
          fourteenKt: 20.248
        },
        prices: {
          '14K': 2250.0,
          '10K': 1590.0
        },
        quantities: {

        }
      },
      {
        index: 92,
        code: 'N10141',
        category: 'Necklaces',
        shape: 'Round',
        images: [
          'assets/necklaces/N10141.jpeg'
        ],
        ctw: 2.0,
        mw: {
          tenKt: 8.827,
          fourteenKt: 10.2
        },
        prices: {
          '14K': 1170.0,
          '10K': 840.0
        },
        quantities: {

        }
      },
      {
        index: 93,
        code: 'N10252',
        category: 'Necklaces',
        shape: 'Round',
        images: [
          'assets/necklaces/N10252.jpeg'
        ],
        ctw: 7.52,
        mw: {
          tenKt: 16.23,
          fourteenKt: 18.748
        },
        prices: {
          '14K': 2320.0,
          '10K': 1740.0
        },
        quantities: {

        }
      },
      {
        index: 94,
        code: 'R11052',
        category: 'Rings',
        shape: 'Emerald',
        images: [
          'assets/rings/R11052.PNG'
        ],
        ctw: 4.724,
        mw: {
          tenKt: 3.854,
          fourteenKt: 4.45
        },
        prices: {
          '14K': 1320.0,
          '10K': 1170.0
        },
        quantities: {

        }
      },
      {
        index: 95,
        code: 'R11053',
        category: 'Rings',
        shape: 'Oval',
        images: [
          'assets/rings/R11053.PNG'
        ],
        ctw: 5.456,
        mw: {
          tenKt: 3.637,
          fourteenKt: 4.2
        },
        prices: {
          '14K': 1440.0,
          '10K': 1320.0
        },
        quantities: {

        }
      },
      {
        index: 96,
        code: 'R11054',
        category: 'Rings',
        shape: 'Asscher',
        images: [
          'assets/rings/R11054.PNG'
        ],
        ctw: 13,
        mw: {
          tenKt: 10.288,
          fourteenKt: 11.88
        },
        prices: {
          '14K': 3450.0,
          '10K': 3060.0
        },
        quantities: {

        }
      },
      {
        index: 97,
        code: 'R11055',
        category: 'Rings',
        shape: 'Oval',
        images: [
          'assets/rings/R11055.PNG'
        ],
        ctw: 7.66,
        mw: {
          tenKt: 11.379,
          fourteenKt: 13.14
        },
        prices: {
          '14K': 2580.0,
          '10K': 2160.0
        },
        quantities: {

        }
      },
      {
        index: 98,
        code: 'R11056',
        category: 'Rings',
        shape: 'Hm',
        images: [
          'assets/rings/R11056.PNG'
        ],
        ctw: 4.486,
        mw: {
          tenKt: 3.377,
          fourteenKt: 3.899
        },
        prices: {
          '14K': 1290.0,
          '10K': 1170.0
        },
        quantities: {

        }
      },
      {
        index: 99,
        code: 'R11123',
        category: 'Rings',
        shape: 'Hm',
        images: [
          'assets/rings/R11123.PNG'
        ],
        ctw: 5,
        mw: {
          tenKt: 3.291,
          fourteenKt: 3.8
        },
        prices: {
          '14K': 1350.0,
          '10K': 1230.0
        },
        quantities: {

        }
      },
      {
        index: 100,
        code: 'R11057',
        category: 'Rings',
        shape: 'Rad',
        images: [
          'assets/rings/R11057.PNG'
        ],
        ctw: 5.372,
        mw: {
          tenKt: 3.81,
          fourteenKt: 4.399
        },
        prices: {
          '14K': 1400.0,
          '10K': 1260.0
        },
        quantities: {

        }
      },
      {
        index: 101,
        code: 'R11058',
        category: 'Rings',
        shape: 'Oval',
        images: [
          'assets/rings/R11058.PNG'
        ],
        ctw: 4.1,
        mw: {
          tenKt: 3.291,
          fourteenKt: 3.8
        },
        prices: {
          '14K': 1230.0,
          '10K': 1110.0
        },
        quantities: {

        }
      },
      {
        index: 102,
        code: 'R11059',
        category: 'Rings',
        shape: 'Emerald',
        images: [
          'assets/rings/R11059.PNG'
        ],
        ctw: 4.718,
        mw: {
          tenKt: 3.594,
          fourteenKt: 4.15
        },
        prices: {
          '14K': 1260.0,
          '10K': 1140.0
        },
        quantities: {

        }
      },
      {
        index: 103,
        code: 'R11062',
        category: 'Rings',
        shape: 'Asscher',
        images: [
          'assets/rings/R11062.PNG'
        ],
        ctw: 18.234,
        mw: {
          tenKt: 10.392,
          fourteenKt: 12.0
        },
        prices: {
          '14K': 3900.0,
          '10K': 3510.0
        },
        quantities: {

        }
      },
      {
        index: 104,
        code: 'R11061',
        category: 'Rings',
        shape: 'Round',
        images: [
          'assets/rings/R11061.PNG'
        ],
        ctw: 4.242,
        mw: {
          tenKt: 3.377,
          fourteenKt: 3.9
        },
        prices: {
          '14K': 1170.0,
          '10K': 1050.0
        },
        quantities: {

        }
      },
      {
        index: 105,
        code: 'R11072',
        category: 'Rings',
        shape: 'Ecu',
        images: [
          'assets/rings/R11072.PNG'
        ],
        ctw: 4.142,
        mw: {
          tenKt: 3.854,
          fourteenKt: 4.45
        },
        prices: {
          '14K': 1260.0,
          '10K': 1110.0
        },
        quantities: {

        }
      },
      {
        index: 106,
        code: 'R11237',
        category: 'Rings',
        shape: 'Emerald',
        images: [
          'assets/rings/R11237.PNG'
        ],
        ctw: 8.273,
        mw: {
          tenKt: 3.984,
          fourteenKt: 4.6
        },
        prices: {
          '14K': 2040.0,
          '10K': 1890.0
        },
        quantities: {

        }
      },
      {
        index: 107,
        code: 'R11232',
        category: 'Rings',
        shape: 'Oval',
        images: [
          'assets/rings/R11232.PNG'
        ],
        ctw: 8.2,
        mw: {
          tenKt: 5.716,
          fourteenKt: 6.6
        },
        prices: {
          '14K': 2550.0,
          '10K': 2340.0
        },
        quantities: {

        }
      },
      {
        index: 108,
        code: 'R11234',
        category: 'Rings',
        shape: 'Oval',
        images: [
          'assets/rings/R11234.PNG'
        ],
        ctw: 6,
        mw: {
          tenKt: 4.157,
          fourteenKt: 4.8
        },
        prices: {
          '14K': 1650.0,
          '10K': 1500.0
        },
        quantities: {

        }
      },
      {
        index: 109,
        code: 'R11240',
        category: 'Rings',
        shape: 'Emerald',
        images: [
          'assets/rings/R11240.PNG'
        ],
        ctw: 8,
        mw: {
          tenKt: 3.464,
          fourteenKt: 4.0
        },
        prices: {
          '14K': 1980.0,
          '10K': 1860.0
        },
        quantities: {

        }
      },
      {
        index: 110,
        code: 'R11231',
        category: 'Rings',
        shape: 'Ecu',
        images: [
          'assets/rings/R11231.PNG'
        ],
        ctw: 5.85,
        mw: {
          tenKt: 3.724,
          fourteenKt: 4.3
        },
        prices: {
          '14K': 1680.0,
          '10K': 1530.0
        },
        quantities: {

        }
      },
      {
        index: 111,
        code: 'R11255',
        category: 'Rings',
        shape: 'Pear',
        images: [
          'assets/rings/R11255.PNG'
        ],
        ctw: 6,
        mw: {
          tenKt: 3.412,
          fourteenKt: 3.94
        },
        prices: {
          '14K': 1650.0,
          '10K': 1530.0
        },
        quantities: {

        }
      },
      {
        index: 112,
        code: 'R11230',
        category: 'Rings',
        shape: 'Marquise',
        images: [
          'assets/rings/R11230.PNG'
        ],
        ctw: 6,
        mw: {
          tenKt: 3.681,
          fourteenKt: 4.25
        },
        prices: {
          '14K': 1530.0,
          '10K': 1410.0
        },
        quantities: {

        }
      },
      {
        index: 113,
        code: 'R11253',
        category: 'Unknown',
        shape: 'Ecu',
        images: [
          'assets/unknown/R11253.PNG'
        ],
        ctw: 5.630904,
        mw: {
          tenKt: 3.265,
          fourteenKt: 3.77
        },
        prices: {
          '14K': 1620.0,
          '10K': 1500.0
        },
        quantities: {

        }
      },
      {
        index: 114,
        code: 'R11229',
        category: 'Unknown',
        shape: 'Cushion',
        images: [
          'assets/unknown/R11229.PNG'
        ],
        ctw: 5.920963999999999,
        mw: {
          tenKt: 3.499,
          fourteenKt: 4.04
        },
        prices: {
          '14K': 1680.0,
          '10K': 1560.0
        },
        quantities: {

        }
      },
      {
        index: 115,
        code: 'R10308',
        category: 'Bands',
        shape: 'Round',
        images: [
          'assets/bands/R10308.PNG'
        ],
        ctw: 2.0,
        mw: {
          tenKt: 3.204,
          fourteenKt: 3.7
        },
        prices: {
          '14K': 600.0,
          '10K': 480.0
        },
        quantities: {

        }
      },
      {
        index: 116,
        code: 'B10155',
        category: 'Bracelets',
        shape: 'Round',
        images: [
          'assets/bracelets/B10155.PNG'
        ],
        ctw: 46.8,
        mw: {
          tenKt: 60.586,
          fourteenKt: 69.959
        },
        prices: {
          '14K': 10440.0,
          '10K': 8220.0
        },
        quantities: {

        }
      },
      {
        index: 117,
        code: 'B10408',
        category: 'Bracelets',
        shape: 'Emerald',
        images: [
          'assets/bracelets/B10408.PNG'
        ],
        ctw: 25.0,
        mw: {
          tenKt: 21.831,
          fourteenKt: 25.208
        },
        prices: {
          '14K': 5970.0,
          '10K': 5160.0
        },
        quantities: {

        }
      },
      {
        index: 118,
        code: 'NK230410',
        category: 'Necklaces',
        shape: 'Round',
        images: [
          'assets/necklaces/NK230410.PNG'
        ],
        ctw: 10,
        mw: {
          tenKt: 17,
          fourteenKt: 19.97
        },
        prices: {
          '14K': 2640.0,
          '10K': 2010.0
        },
        quantities: {

        }
      },
      {
        index: 119,
        code: 'P10347',
        category: 'Pendants',
        shape: 'Pear',
        images: [
          'assets/pendants/P10347.PNG'
        ],
        ctw: 2,
        mw: {
          tenKt: 2.678,
          fourteenKt: 3.08
        },
        prices: {
          '14K': 750.0,
          '10K': 630.0
        },
        quantities: {

        }
      }
    ]
  }

  syncQuantitiesFromCart() {
    const cartItems = this.cartService.getCartItems() || [];

    for (const product of this.products) {
      // Reset existing quantities
      product.quantities = {};

      const matchedCartItem = cartItems.find(item => item.code === product.code);
      if (matchedCartItem) {
        for (const combo of matchedCartItem.combinations) {
          const key = `${combo.metal}_${combo.karat}`;
          product.quantities[key] = combo.quantity;
        }
      }
    }
  }

  addToCart(product: Product) {
    if (!product.quantities) return;

    const selectedCombinations = Object.entries(product.quantities)
      .filter(([_, qty]) => qty && qty > 0)
      .map(([key, quantity]) => {
        const [metal, karat] = key.split('_');
        return {
          metal,
          karat,
          quantity,
          price: product.prices[karat]
        };
      });

    if (selectedCombinations.length === 0) {
      alert('Please enter quantity for at least one metal and karat.');
      return;
    }

    const item = {
      code: product.code,
      image: product.images[0],
      weight: product.ctw + " " + product.shape,
      combinations: selectedCombinations, // List of selected metal-karat-qty-price
    };

    this.cartService.addToCart(item);
    alert('Added to cart!');
  }

}