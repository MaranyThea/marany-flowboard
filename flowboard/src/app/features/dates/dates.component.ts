import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DateMilestone {
  id: string;
  title: string;
  targetDate: string; // YYYY-MM-DD
  daysLeft: number;
  category: 'Milestone' | 'Deadline' | 'Event' | 'Anniversary';
  domain: 'Work' | 'Side Project' | 'School' | 'Personal';
  domainClass: string;
  notes?: string;
}

@Component({
  selector: 'app-dates',
  imports: [CommonModule, FormsModule],
  templateUrl: './dates.component.html',
  styleUrl: './dates.component.scss'
})
export class DatesComponent {
  // Modal
  isModalOpen = false;
  newDateTitle = '';
  newDateTarget = '2026-09-30';
  newDateCategory: 'Milestone' | 'Deadline' | 'Event' | 'Anniversary' = 'Deadline';
  newDateDomain: 'Work' | 'Side Project' | 'School' | 'Personal' = 'Work';

  milestones = signal<DateMilestone[]>([
    { id: '1', title: 'FlowBoard Beta Release v1.0', targetDate: '2026-09-15', daysLeft: 5, category: 'Milestone', domain: 'Side Project', domainClass: 'domain-side-project', notes: 'Complete testing across all browsers and publish launch changelog.' },
    { id: '2', title: 'Q3 Product Strategy Presentation', targetDate: '2026-09-18', daysLeft: 8, category: 'Deadline', domain: 'Work', domainClass: 'domain-work', notes: 'Executive leadership alignment meeting on roadmap.' },
    { id: '3', title: 'Distributed Systems Midterm Exam', targetDate: '2026-09-22', daysLeft: 12, category: 'Event', domain: 'School', domainClass: 'domain-school', notes: 'Review consensus protocols, 2PC, and vector clocks.' },
    { id: '4', title: 'Half Marathon Race Day (21km)', targetDate: '2026-10-31', daysLeft: 51, category: 'Milestone', domain: 'Personal', domainClass: 'domain-personal', notes: 'Pacing goal: 5:15 min/km for sub 1:55 finish.' },
    { id: '5', title: 'Annual Domain Portfolio Audit', targetDate: '2026-12-31', daysLeft: 112, category: 'Milestone', domain: 'Personal', domainClass: 'domain-personal', notes: 'Review net worth, year-end goals, and 2027 life architecture.' }
  ]);

  openAddModal(): void {
    this.newDateTitle = '';
    this.newDateTarget = '2026-09-30';
    this.newDateCategory = 'Deadline';
    this.newDateDomain = 'Work';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveDate(): void {
    if (!this.newDateTitle.trim()) return;

    const domainClasses: Record<string, string> = {
      'Work': 'domain-work',
      'Side Project': 'domain-side-project',
      'School': 'domain-school',
      'Personal': 'domain-personal'
    };

    const newM: DateMilestone = {
      id: Date.now().toString(),
      title: this.newDateTitle.trim(),
      targetDate: this.newDateTarget,
      daysLeft: 18,
      category: this.newDateCategory,
      domain: this.newDateDomain,
      domainClass: domainClasses[this.newDateDomain] || 'domain-work'
    };

    this.milestones.update(list => [...list, newM]);
    this.closeModal();
  }

  deleteDate(id: string): void {
    this.milestones.update(list => list.filter(m => m.id !== id));
  }
}
