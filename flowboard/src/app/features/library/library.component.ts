import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'reading' | 'want-to-read' | 'completed';
  currentPage: number;
  totalPages: number;
  rating?: number;
  summary: string;
  coverColor: string;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  domainTag: string;
  savedDate: string;
}

@Component({
  selector: 'app-library',
  imports: [CommonModule, FormsModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {
  readonly activeTab = signal<'books' | 'vault' | 'bookmarks'>('books');
  readonly selectedFilter = signal<'all' | 'reading' | 'completed'>('all');

  books = signal<BookItem[]>([
    {
      id: 'b1',
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      category: 'Software Engineering',
      status: 'reading',
      currentPage: 340,
      totalPages: 560,
      rating: 5,
      summary: 'The definitive guide to distributed systems, replication, partitioning, and transaction isolation levels.',
      coverColor: 'linear-gradient(135deg, #1e3a8a, #3b82f6)'
    },
    {
      id: 'b2',
      title: 'High Output Management',
      author: 'Andrew S. Grove',
      category: 'Leadership & Strategy',
      status: 'reading',
      currentPage: 160,
      totalPages: 272,
      rating: 5,
      summary: 'Principles of leverage, managerial output = the output of his organization + the output of the neighboring organizations under his influence.',
      coverColor: 'linear-gradient(135deg, #78350f, #f59e0b)'
    },
    {
      id: 'b3',
      title: 'Atomic Habits',
      author: 'James Clear',
      category: 'Psychology & Systems',
      status: 'completed',
      currentPage: 320,
      totalPages: 320,
      rating: 5,
      summary: 'Tiny changes, remarkable results. 1% better everyday compounds exponentially over years.',
      coverColor: 'linear-gradient(135deg, #065f46, #10b981)'
    },
    {
      id: 'b4',
      title: 'Deep Work: Rules for Focused Success',
      author: 'Cal Newport',
      category: 'Productivity',
      status: 'completed',
      currentPage: 296,
      totalPages: 296,
      rating: 5,
      summary: 'The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy.',
      coverColor: 'linear-gradient(135deg, #4c1d95, #8b5cf6)'
    }
  ]);

  bookmarks = signal<BookmarkItem[]>([
    { id: 'bm1', title: 'Angular 19 Signals & Reactivity Deep Dive', url: 'https://angular.dev/guide/signals', domainTag: 'Side Project', savedDate: 'Sep 8, 2026' },
    { id: 'bm2', title: 'MIT 6.824 Distributed Systems Course Notes', url: 'https://pdos.csail.mit.edu/6.824/', domainTag: 'School', savedDate: 'Sep 6, 2026' },
    { id: 'bm3', title: 'System Design Interview Roadmap', url: 'https://github.com/donnemartin/system-design-primer', domainTag: 'Work', savedDate: 'Aug 29, 2026' }
  ]);

  readonly filteredBooks = computed(() => {
    if (this.selectedFilter() === 'all') return this.books();
    return this.books().filter(b => b.status === this.selectedFilter());
  });

  updateProgress(book: BookItem, pages: number): void {
    book.currentPage = Math.min(book.totalPages, Math.max(0, pages));
    if (book.currentPage >= book.totalPages) {
      book.status = 'completed';
    }
  }
}
