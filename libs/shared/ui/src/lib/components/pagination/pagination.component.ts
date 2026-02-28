import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

import { getPageRange } from '@retail/shared/util';

@Component({
  selector: 'retail-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();

  pageChange = output<number>();

  pages = computed(() => getPageRange(this.currentPage(), this.totalPages()));

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }
}
