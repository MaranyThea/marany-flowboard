import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface DomainHub {
  id: string;
  name: 'Work' | 'Side Project' | 'School' | 'Personal';
  domainClass: string;
  colorHex: string;
  tagline: string;
  healthScore: number; // 0-100
  activeProjects: number;
  openTasks: number;
  completedTasks: number;
  hoursAllocated: number;
  weeklyTargetHours: number;
  topObjectives: string[];
}

@Component({
  selector: 'app-domains',
  imports: [CommonModule, RouterLink],
  templateUrl: './domains.component.html',
  styleUrl: './domains.component.scss'
})
export class DomainsComponent {
  domains = signal<DomainHub[]>([
    {
      id: 'd1',
      name: 'Work',
      domainClass: 'domain-work',
      colorHex: '#4ade80',
      tagline: 'Professional career, software engineering deliverables, team mentorship & leadership.',
      healthScore: 92,
      activeProjects: 1,
      openTasks: 3,
      completedTasks: 14,
      hoursAllocated: 38,
      weeklyTargetHours: 40,
      topObjectives: ['Lead distributed microservices migration', 'Q3 promotion deck', 'Engineering mentorship']
    },
    {
      id: 'd2',
      name: 'Side Project',
      domainClass: 'domain-side-project',
      colorHex: '#fb923c',
      tagline: 'SaaS product development, FlowBoard Life OS, indie hacking, open-source repositories.',
      healthScore: 95,
      activeProjects: 2,
      openTasks: 6,
      completedTasks: 28,
      hoursAllocated: 18,
      weeklyTargetHours: 15,
      topObjectives: ['Launch FlowBoard v1.0 beta', 'Dark obsidian theme', 'Nova AI Assistant drawer']
    },
    {
      id: 'd3',
      name: 'School',
      domainClass: 'domain-school',
      colorHex: '#f43f5e',
      tagline: 'Computer Science Masters degree, distributed algorithms research, paper submissions.',
      healthScore: 88,
      activeProjects: 1,
      openTasks: 4,
      completedTasks: 12,
      hoursAllocated: 12,
      weeklyTargetHours: 14,
      topObjectives: ['Maintain 3.9+ GPA', 'Distributed Systems lab assignment', 'Thesis literature review']
    },
    {
      id: 'd4',
      name: 'Personal',
      domainClass: 'domain-personal',
      colorHex: '#38bdf8',
      tagline: 'Health, marathon training, reading, finances, relationships, and mindfulness.',
      healthScore: 90,
      activeProjects: 1,
      openTasks: 2,
      completedTasks: 19,
      hoursAllocated: 14,
      weeklyTargetHours: 12,
      topObjectives: ['Half marathon race readiness', '3L daily water intake', 'Monthly cashflow tracking']
    }
  ]);
}
