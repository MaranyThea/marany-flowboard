import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  duration: string;
  domain: 'Work' | 'Side Project' | 'School' | 'Personal';
  domainClass: string;
  location?: string;
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  readonly currentMonth = signal(8); // 0-indexed, 8 = September
  readonly currentYear = signal(2026);
  readonly selectedView = signal<'month' | 'week' | 'agenda'>('month');
  readonly selectedDomain = signal<'All' | 'Work' | 'Side Project' | 'School' | 'Personal'>('All');

  // Modal
  isModalOpen = false;
  newEventTitle = '';
  newEventDate = '2026-09-10';
  newEventTime = '10:00 AM';
  newEventDuration = '1h';
  newEventDomain: 'Work' | 'Side Project' | 'School' | 'Personal' = 'Work';

  events = signal<CalendarEvent[]>([
    { id: '1', title: 'FlowBoard Architecture Review', date: '2026-09-10', time: '09:00 AM', duration: '1h 30m', domain: 'Side Project', domainClass: 'domain-side-project' },
    { id: '2', title: 'Core Eng Sprint Planning', date: '2026-09-10', time: '11:30 AM', duration: '1h', domain: 'Work', domainClass: 'domain-work' },
    { id: '3', title: 'Deep Work: Knowledge Graph UI', date: '2026-09-10', time: '02:00 PM', duration: '2h', domain: 'Side Project', domainClass: 'domain-side-project' },
    { id: '4', title: 'Machine Learning Study Group', date: '2026-09-11', time: '04:00 PM', duration: '1h 30m', domain: 'School', domainClass: 'domain-school' },
    { id: '5', title: 'Gym Workout - Leg Day', date: '2026-09-11', time: '06:30 PM', duration: '1h 15m', domain: 'Personal', domainClass: 'domain-personal' },
    { id: '6', title: 'FlowBoard Beta Release v1.0', date: '2026-09-15', time: '10:00 AM', duration: '2h', domain: 'Side Project', domainClass: 'domain-side-project' },
    { id: '7', title: 'Q3 Financial Audit & Strategy', date: '2026-09-18', time: '03:00 PM', duration: '1h', domain: 'Personal', domainClass: 'domain-personal' },
    { id: '8', title: 'Distributed Systems Exam', date: '2026-09-22', time: '09:00 AM', duration: '3h', domain: 'School', domainClass: 'domain-school' }
  ]);

  readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  readonly currentMonthName = computed(() => this.monthNames[this.currentMonth()]);

  readonly daysInMonth = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: { dayNumber: number | null; dateStr: string; isToday: boolean; events: CalendarEvent[] }[] = [];

    // Empty offset slots
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, dateStr: '', isToday: false, events: [] });
    }

    // Days of month
    for (let d = 1; d <= totalDays; d++) {
      const monthFormatted = (month + 1).toString().padStart(2, '0');
      const dayFormatted = d.toString().padStart(2, '0');
      const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;
      const isToday = (year === 2026 && month === 8 && d === 10);

      const dayEvents = this.events().filter(e => {
        const matchesDate = e.date === dateStr;
        const matchesDomain = this.selectedDomain() === 'All' || e.domain === this.selectedDomain();
        return matchesDate && matchesDomain;
      });

      days.push({ dayNumber: d, dateStr, isToday, events: dayEvents });
    }

    return days;
  });

  readonly upcomingAgenda = computed(() => {
    return this.events()
      .filter(e => this.selectedDomain() === 'All' || e.domain === this.selectedDomain())
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  prevMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.update(y => y - 1);
    } else {
      this.currentMonth.update(m => m - 1);
    }
  }

  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.update(y => y + 1);
    } else {
      this.currentMonth.update(m => m + 1);
    }
  }

  goToToday(): void {
    this.currentMonth.set(8);
    this.currentYear.set(2026);
  }

  setView(view: 'month' | 'week' | 'agenda'): void {
    this.selectedView.set(view);
  }

  setDomain(domain: 'All' | 'Work' | 'Side Project' | 'School' | 'Personal'): void {
    this.selectedDomain.set(domain);
  }

  openAddModal(dateStr?: string): void {
    this.newEventTitle = '';
    this.newEventDate = dateStr || '2026-09-10';
    this.newEventTime = '10:00 AM';
    this.newEventDuration = '1h';
    this.newEventDomain = 'Work';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveEvent(): void {
    if (!this.newEventTitle.trim()) return;

    const domainClasses: Record<string, string> = {
      'Work': 'domain-work',
      'Side Project': 'domain-side-project',
      'School': 'domain-school',
      'Personal': 'domain-personal'
    };

    const newEv: CalendarEvent = {
      id: Date.now().toString(),
      title: this.newEventTitle.trim(),
      date: this.newEventDate,
      time: this.newEventTime,
      duration: this.newEventDuration,
      domain: this.newEventDomain,
      domainClass: domainClasses[this.newEventDomain] || 'domain-work'
    };

    this.events.update(list => [...list, newEv]);
    this.closeModal();
  }

  deleteEvent(id: string): void {
    this.events.update(list => list.filter(e => e.id !== id));
  }
}
