import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface GoalItem {
  id: string;
  title: string;
  domain: 'Work' | 'Side Project' | 'School' | 'Personal';
  domainClass: string;
  category: string;
  progress: number; // 0 - 100
  targetValue: string;
  currentValue: string;
  deadline: string;
  status: 'on-track' | 'ahead' | 'behind' | 'completed';
  keyResults: { text: string; done: boolean }[];
}

@Component({
  selector: 'app-goals',
  imports: [CommonModule, FormsModule],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss'
})
export class GoalsComponent {
  readonly selectedDomain = signal<'All' | 'Work' | 'Side Project' | 'School' | 'Personal'>('All');

  // Modal
  isModalOpen = false;
  newGoalTitle = '';
  newGoalDomain: 'Work' | 'Side Project' | 'School' | 'Personal' = 'Work';
  newGoalCategory = 'Q3 2026';
  newGoalTarget = '100%';
  newGoalDeadline = 'Dec 31, 2026';

  goals = signal<GoalItem[]>([
    {
      id: 'g1',
      title: 'Launch FlowBoard Life OS & reach 1,000 Active Users',
      domain: 'Side Project',
      domainClass: 'domain-side-project',
      category: 'Q3 Product Objective',
      progress: 78,
      currentValue: '780 Users',
      targetValue: '1,000 Users',
      deadline: 'Sep 30, 2026',
      status: 'on-track',
      keyResults: [
        { text: 'Complete dark obsidian design system & components', done: true },
        { text: 'Ship multi-level Kanban & subprojects feature', done: true },
        { text: 'Deploy Nova AI Assistant engine', done: false }
      ]
    },
    {
      id: 'g2',
      title: 'Achieve Senior Lead Engineer Promotion',
      domain: 'Work',
      domainClass: 'domain-work',
      category: 'Career Growth',
      progress: 85,
      currentValue: 'Level 4.8',
      targetValue: 'Level 5.0 (Senior)',
      deadline: 'Nov 15, 2026',
      status: 'ahead',
      keyResults: [
        { text: 'Deliver core microservices architecture migration', done: true },
        { text: 'Mentor 2 junior frontend engineers', done: true },
        { text: 'Q3 cross-functional team feedback round', done: false }
      ]
    },
    {
      id: 'g3',
      title: 'Maintain 3.9+ GPA in Computer Science Masters',
      domain: 'School',
      domainClass: 'domain-school',
      category: 'Academic Target',
      progress: 92,
      currentValue: '3.94 GPA',
      targetValue: '3.90+ GPA',
      deadline: 'Dec 15, 2026',
      status: 'on-track',
      keyResults: [
        { text: 'Score A in Advanced Distributed Systems', done: true },
        { text: 'Publish paper on neural architecture search', done: false },
        { text: 'Complete final research thesis draft', done: true }
      ]
    },
    {
      id: 'g4',
      title: 'Hit 12% Body Fat & Run Half Marathon (21km)',
      domain: 'Personal',
      domainClass: 'domain-personal',
      category: 'Health & Vitality',
      progress: 60,
      currentValue: '14.2% BF / 14km',
      targetValue: '12% BF / 21km',
      deadline: 'Oct 31, 2026',
      status: 'behind',
      keyResults: [
        { text: '4x weekly strength training sessions', done: true },
        { text: 'Sunday long run progression up to 18km', done: false },
        { text: 'Daily calorie deficit tracking (-300 kcal)', done: true }
      ]
    }
  ]);

  readonly filteredGoals = computed(() => {
    return this.goals().filter(g => this.selectedDomain() === 'All' || g.domain === this.selectedDomain());
  });

  setDomain(domain: 'All' | 'Work' | 'Side Project' | 'School' | 'Personal'): void {
    this.selectedDomain.set(domain);
  }

  toggleKeyResult(goal: GoalItem, krIndex: number): void {
    goal.keyResults[krIndex].done = !goal.keyResults[krIndex].done;
    const completedCount = goal.keyResults.filter(k => k.done).length;
    goal.progress = Math.round((completedCount / goal.keyResults.length) * 100);
    if (goal.progress === 100) goal.status = 'completed';
  }

  openAddModal(): void {
    this.newGoalTitle = '';
    this.newGoalDomain = 'Work';
    this.newGoalCategory = 'Q3 2026';
    this.newGoalTarget = '100%';
    this.newGoalDeadline = 'Dec 31, 2026';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveGoal(): void {
    if (!this.newGoalTitle.trim()) return;

    const domainClasses: Record<string, string> = {
      'Work': 'domain-work',
      'Side Project': 'domain-side-project',
      'School': 'domain-school',
      'Personal': 'domain-personal'
    };

    const newG: GoalItem = {
      id: Date.now().toString(),
      title: this.newGoalTitle.trim(),
      domain: this.newGoalDomain,
      domainClass: domainClasses[this.newGoalDomain] || 'domain-work',
      category: this.newGoalCategory,
      progress: 0,
      currentValue: '0%',
      targetValue: this.newGoalTarget,
      deadline: this.newGoalDeadline,
      status: 'on-track',
      keyResults: [
        { text: 'Initial milestone planning and setup', done: false }
      ]
    };

    this.goals.update(list => [newG, ...list]);
    this.closeModal();
  }
}
