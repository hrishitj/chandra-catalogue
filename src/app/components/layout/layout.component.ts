import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [CommonModule, RouterModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  categories = ['Tennis Bracelet', 'Fancy Hoops', 'Fancy Necklaces', 'Round Necklaces'];
  selectedCategory: string = 'Tennis Bracelet';
  showSidebar = false;

  constructor(private router: Router, private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const rawCategory = params.get('category');
      if (rawCategory) {
        // Convert slug back to title case if needed
        this.selectedCategory = rawCategory.replace(/-/g, ' ');
      }
      else{
        this.selectedCategory = 'Tennis Bracelet';
      }
    });
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  getCategorySlug(category: string): string {
    return category.replace(/\s+/g, '-');
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    const categorySlug = this.getCategorySlug(category);
    this.router.navigate(['/products', categorySlug]);
    this.showSidebar = false; // Close mobile sidebar
  }
}
