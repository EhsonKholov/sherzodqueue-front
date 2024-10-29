import {Component, EventEmitter, Input, OnChanges, OnInit, Output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() total_pages: number = 0
  @Output() pageChange = new EventEmitter<any>()

  page_size_options: number[] = [10, 25, 50, 100]
  page_size = this.page_size_options[0]
  maxSize = signal<number>(7);
  paginationRange = Math.max(this.maxSize(), 5);
  pages: any[] = [];
  pagination = {
    last: 1,
    current: 1
  };
  numberRegex = /^\d+$/;


  ngOnInit() {
    this.generatePagination()
    //this.changePageSize()
  }

  ngOnChanges(): void {
    this.generatePagination()
  }

  changePageSize() {
    this.pagination.current = 1
    this.pageChange.emit({
      page_number: this.pagination.current,
      page_size: this.page_size
    })
  }

  setCurrent(num: number) {
    num = parseInt(String(num), 10);
    this.setCurrentPage(num);
  };

  setCurrentPage(num: number) {
    this.pagination.current = num
  }

  goToPage(num: number) {
    if (this.isValidPageNumber(num) && this.pagination.current != num) {
      this.pages = this.generatePagesArray(num, this.paginationRange);
      this.pagination.current = num;

      this.pageChange.emit({
        page_number: num,
        page_size: this.page_size
      })
    }
  }

  generatePagesArray(currentPage: number, paginationRange: number) {
    let pages: any[] = [];
    let totalPages = this.total_pages
    let halfWay = Math.ceil(paginationRange / 2);
    let position;

    if (currentPage <= halfWay) {
      position = 'start';
    } else if (totalPages - halfWay < currentPage) {
      position = 'end';
    } else {
      position = 'middle';
    }

    let ellipsesNeeded = paginationRange < totalPages;
    let i = 1;
    while (i <= totalPages && i <= paginationRange) {
      let pageNumber = this.calculatePageNumber(i, currentPage, paginationRange, totalPages);

      let openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
      let closingEllipsesNeeded = (i === paginationRange - 1 && (position === 'middle' || position === 'start'));
      if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
        pages.push('...');
      } else {
        pages.push(pageNumber);
      }
      i ++;
    }
    return pages;
  }

  calculatePageNumber(i: number, currentPage: number, paginationRange: number, totalPages: number) {
    let halfWay = Math.ceil(paginationRange/2);
    if (i === paginationRange) {
      return totalPages;
    } else if (i === 1) {
      return i;
    } else if (paginationRange < totalPages) {
      if (totalPages - halfWay < currentPage) {
        return totalPages - paginationRange + i;
      } else if (halfWay < currentPage) {
        return currentPage - halfWay + i;
      } else {
        return i;
      }
    } else {
      return i;
    }
  }

  generatePagination() {
    let page = parseInt(String(this.pagination.current)) || 1;
    this.pages = this.generatePagesArray(page, this.paginationRange);
    this.pagination.current = page;
    this.pagination.last = this.pages[this.pages.length - 1];
    if (this.pagination.last < this.pagination.current) {
      this.setCurrent(this.pagination.last);
    }
  }

  isValidPageNumber(num: number) {
    return (this.numberRegex.test(String(num)) && (0 < num && num <= this.pagination.last));
  }

}
