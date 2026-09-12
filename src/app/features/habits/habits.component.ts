import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface HabitItem {
  id: string;
  name: string;
  icon: string;
  domain: 'Work' | 'Side Project' | 'School' | 'Personal';
  domainClass: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
  frequency: string;
  streak: number;
  bestStreak: number;
  completionRate: number;
  weekDays: { day: string; date: string; completed: boolean }[];
}

@Component({
  selector: 'app-habits',
  imports: [CommonModule, FormsModule],
  templateUrl: './habits.component.html',
  styleUrl: './habits.component.scss'
})
export class HabitsComponent {
  readonly selectedDomain = signal<'All' | 'Work' | 'Side Project' | 'School' | 'Personal'>('All');

  // Modal
  isModalOpen = false;
  newHabitName = '';
  newHabitIcon = '⚡';
  newHabitDomain: 'Work' | 'Side Project' | 'School' | 'Personal' = 'Personal';
  newHabitTime: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime' = 'Morning';
  newHabitFrequency = 'Everyday';

  habits = signal<HabitItem[]>([
    {
      id: 'h1',
      name: 'Hydrate 3 Liters of Water',
      icon: '💧',
      domain: 'Personal',
      domainClass: 'domain-personal',
      timeOfDay: 'Anytime',
      frequency: 'Daily',
      streak: 18,
      bestStreak: 45,
      completionRate: 94,
      weekDays: [
        { day: 'M', date: 'Sep 7', completed: true },
        { day: 'T', date: 'Sep 8', completed: true },
        { day: 'W', date: 'Sep 9', completed: true },
        { day: 'T', date: 'Sep 10', completed: true },
        { day: 'F', date: 'Sep 11', completed: false },
        { day: 'S', date: 'Sep 12', completed: false },
        { day: 'S', date: 'Sep 13', completed: false }
      ]
    },
    {
      id: 'h2',
      name: 'Deep Work Session (90 Mins)',
      icon: '🧠',
      domain: 'Side Project',
      domainClass: 'domain-side-project',
      timeOfDay: 'Morning',
      frequency: '5x / week',
      streak: 12,
      bestStreak: 28,
      completionRate: 88,
      weekDays: [
        { day: 'M', date: 'Sep 7', completed: true },
        { day: 'T', date: 'Sep 8', completed: true },
        { day: 'W', date: 'Sep 9', completed: true },
        { day: 'T', date: 'Sep 10', completed: true },
        { day: 'F', date: 'Sep 11', completed: false },
        { day: 'S', date: 'Sep 12', completed: false },
        { day: 'S', date: 'Sep 13', completed: false }
      ]
    },
    {
      id: 'h3',
      name: 'Read 20 Mins Non-Fiction / CS',
      icon: '📖',
      domain: 'School',
      domainClass: 'domain-school',
      timeOfDay: 'Evening',
      frequency: 'Daily',
      streak: 24,
      bestStreak: 30,
      completionRate: 96,
      weekDays: [
        { day: 'M', date: 'Sep 7', completed: true },
        { day: 'T', date: 'Sep 8', completed: true },
        { day: 'W', date: 'Sep 9', completed: true },
        { day: 'T', date: 'Sep 10', completed: true },
        { day: 'F', date: 'Sep 11', completed: false },
        { day: 'S', date: 'Sep 12', completed: false },
        { day: 'S', date: 'Sep 13', completed: false }
      ]
    },
    {
      id: 'h4',
      name: 'Morning 5km Cardio / Mobility',
      icon: '🏃',
      domain: 'Personal',
      domainClass: 'domain-personal',
      timeOfDay: 'Morning',
      frequency: '4x / week',
      streak: 8,
      bestStreak: 21,
      completionRate: 75,
      weekDays: [
        { day: 'M', date: 'Sep 7', completed: true },
        { day: 'T', date: 'Sep 8', completed: false },
        { day: 'W', date: 'Sep 9', completed: true },
        { day: 'T', date: 'Sep 10', completed: true },
        { day: 'F', date: 'Sep 11', completed: false },
        { day: 'S', date: 'Sep 12', completed: false },
        { day: 'S', date: 'Sep 13', completed: false }
      ]
    },
    {
      id: 'h5',
      name: 'Code Review & Pull Requests Triage',
      icon: '⚡',
      domain: 'Work',
      domainClass: 'domain-work',
      timeOfDay: 'Morning',
      frequency: 'Weekdays',
      streak: 15,
      bestStreak: 35,
      completionRate: 92,
      weekDays: [
        { day: 'M', date: 'Sep 7', completed: true },
        { day: 'T', date: 'Sep 8', completed: true },
        { day: 'W', date: 'Sep 9', completed: true },
        { day: 'T', date: 'Sep 10', completed: true },
        { day: 'F', date: 'Sep 11', completed: false },
        { day: 'S', date: 'Sep 12', completed: false },
        { day: 'S', date: 'Sep 13', completed: false }
      ]
    }
  ]);

  readonly filteredHabits = computed(() => {
    return this.habits().filter(h => this.selectedDomain() === 'All' || h.domain === this.selectedDomain());
  });

  setDomain(domain: 'All' | 'Work' | 'Side Project' | 'School' | 'Personal'): void {
    this.selectedDomain.set(domain);
  }

  toggleDay(habit: HabitItem, dayIndex: number): void {
    habit.weekDays[dayIndex].completed = !habit.weekDays[dayIndex].completed;
    const completedCount = habit.weekDays.filter(d => d.completed).length;
    habit.completionRate = Math.round((completedCount / habit.weekDays.length) * 100);
  }

  openAddModal(): void {
    this.newHabitName = '';
    this.newHabitIcon = '⚡';
    this.newHabitDomain = 'Personal';
    this.newHabitTime = 'Morning';
    this.newHabitFrequency = 'Everyday';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveHabit(): void {
    if (!this.newHabitName.trim()) return;

    const domainClasses: Record<string, string> = {
      'Work': 'domain-work',
      'Side Project': 'domain-side-project',
      'School': 'domain-school',
      'Personal': 'domain-personal'
    };

    const newH: HabitItem = {
      id: Date.now().toString(),
      name: this.newHabitName.trim(),
      icon: this.newHabitIcon || '⚡',
      domain: this.newHabitDomain,
      domainClass: domainClasses[this.newHabitDomain] || 'domain-personal',
      timeOfDay: this.newHabitTime,
      frequency: this.newHabitFrequency,
      streak: 1,
      bestStreak: 1,
      completionRate: 100,
      weekDays: [
        { day: 'M', date: 'Sep 7', completed: true },
        { day: 'T', date: 'Sep 8', completed: false },
        { day: 'W', date: 'Sep 9', completed: false },
        { day: 'T', date: 'Sep 10', completed: false },
        { day: 'F', date: 'Sep 11', completed: false },
        { day: 'S', date: 'Sep 12', completed: false },
        { day: 'S', date: 'Sep 13', completed: false }
      ]
    };

    this.habits.update(list => [...list, newH]);
    this.closeModal();
  }
}
