import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface LifeArea {
  id: string;
  name: string;
  score: number; // 1 - 10
  icon: string;
  domainClass: string;
  notes: string;
}

@Component({
  selector: 'app-where-im-at',
  imports: [CommonModule, FormsModule],
  templateUrl: './where-im-at.component.html',
  styleUrl: './where-im-at.component.scss'
})
export class WhereImAtComponent {
  lifeAreas = signal<LifeArea[]>([
    { id: '1', name: 'Career & Craft', score: 9, icon: '💼', domainClass: 'domain-work', notes: 'High engineering momentum, leading architectural projects, mentoring.' },
    { id: '2', name: 'Side Projects & SaaS', score: 9, icon: '🚀', domainClass: 'domain-side-project', notes: 'FlowBoard product velocity is strong, shipping daily features.' },
    { id: '3', name: 'Physical Health & Fitness', score: 8, icon: '🏃', domainClass: 'domain-personal', notes: 'Consistent 4x weekly workouts, half marathon training on schedule.' },
    { id: '4', name: 'Financial Runway', score: 8, icon: '💳', domainClass: 'domain-personal', notes: '60% savings rate, growing recurring SaaS MRR streams.' },
    { id: '5', name: 'Academic & Learning', score: 9, icon: '🎓', domainClass: 'domain-school', notes: 'On track for 3.9+ CS Masters GPA, engaging with distributed systems research.' },
    { id: '6', name: 'Relationships & Community', score: 7, icon: '👥', domainClass: 'domain-personal', notes: 'Maintaining key mentorships; need more casual social catchups.' },
    { id: '7', name: 'Mindfulness & Energy', score: 8, icon: '🧘', domainClass: 'domain-personal', notes: 'Deep sleep regular, morning routines stable, evening journal active.' }
  ]);

  readonly overallBalanceScore = computed(() => {
    const total = this.lifeAreas().reduce((sum, a) => sum + a.score, 0);
    return Math.round((total / (this.lifeAreas().length * 10)) * 100);
  });

  updateScore(area: LifeArea, val: number): void {
    area.score = val;
  }
}
