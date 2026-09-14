import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface GraphNode {
  id: string;
  name: string;
  type: 'Domain' | 'Project' | 'Goal' | 'Habit' | 'Note';
  domain: 'Work' | 'Side Project' | 'School' | 'Personal';
  domainClass: string;
  colorHex: string;
  x: number;
  y: number;
  size: number;
  connections: string[];
}

@Component({
  selector: 'app-graph',
  imports: [CommonModule, FormsModule],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent {
  readonly selectedDomain = signal<'All' | 'Work' | 'Side Project' | 'School' | 'Personal'>('All');
  readonly hoveredNode = signal<GraphNode | null>(null);

  nodes = signal<GraphNode[]>([
    // Core Domain Hubs
    { id: 'd_work', name: 'Work Hub', type: 'Domain', domain: 'Work', domainClass: 'domain-work', colorHex: '#4ade80', x: 260, y: 160, size: 28, connections: ['p_core', 'g_lead', 'h_prs'] },
    { id: 'd_side', name: 'Side Project Hub', type: 'Domain', domain: 'Side Project', domainClass: 'domain-side-project', colorHex: '#fb923c', x: 620, y: 180, size: 30, connections: ['p_flow', 'g_flow', 'h_deep', 'n_ai'] },
    { id: 'd_school', name: 'School Hub', type: 'Domain', domain: 'School', domainClass: 'domain-school', colorHex: '#f43f5e', x: 240, y: 440, size: 26, connections: ['p_thesis', 'g_gpa', 'n_ddia'] },
    { id: 'd_pers', name: 'Personal Hub', type: 'Domain', domain: 'Personal', domainClass: 'domain-personal', colorHex: '#38bdf8', x: 640, y: 450, size: 28, connections: ['g_run', 'h_water', 'h_run'] },

    // Projects
    { id: 'p_flow', name: 'FlowBoard Life OS', type: 'Project', domain: 'Side Project', domainClass: 'domain-side-project', colorHex: '#fb923c', x: 480, y: 100, size: 22, connections: ['d_side', 'g_flow'] },
    { id: 'p_core', name: 'Core Eng Architecture', type: 'Project', domain: 'Work', domainClass: 'domain-work', colorHex: '#4ade80', x: 120, y: 110, size: 20, connections: ['d_work'] },
    { id: 'p_thesis', name: 'Distributed Consensus Thesis', type: 'Project', domain: 'School', domainClass: 'domain-school', colorHex: '#f43f5e', x: 100, y: 480, size: 20, connections: ['d_school', 'n_ddia'] },

    // Goals
    { id: 'g_flow', name: 'Reach 1,000 FlowBoard Users', type: 'Goal', domain: 'Side Project', domainClass: 'domain-side-project', colorHex: '#fb923c', x: 760, y: 110, size: 18, connections: ['p_flow'] },
    { id: 'g_lead', name: 'Senior Lead Promotion', type: 'Goal', domain: 'Work', domainClass: 'domain-work', colorHex: '#4ade80', x: 380, y: 80, size: 18, connections: ['d_work'] },
    { id: 'g_gpa', name: 'Maintain 3.9+ GPA', type: 'Goal', domain: 'School', domainClass: 'domain-school', colorHex: '#f43f5e', x: 360, y: 520, size: 18, connections: ['d_school'] },
    { id: 'g_run', name: 'Sub 1:55 Half Marathon', type: 'Goal', domain: 'Personal', domainClass: 'domain-personal', colorHex: '#38bdf8', x: 790, y: 420, size: 18, connections: ['d_pers', 'h_run'] },

    // Habits
    { id: 'h_deep', name: 'Deep Work 90m', type: 'Habit', domain: 'Side Project', domainClass: 'domain-side-project', colorHex: '#fb923c', x: 500, y: 280, size: 16, connections: ['d_side'] },
    { id: 'h_prs', name: 'PR Triage', type: 'Habit', domain: 'Work', domainClass: 'domain-work', colorHex: '#4ade80', x: 180, y: 260, size: 16, connections: ['d_work'] },
    { id: 'h_run', name: 'Morning 5km', type: 'Habit', domain: 'Personal', domainClass: 'domain-personal', colorHex: '#38bdf8', x: 720, y: 540, size: 16, connections: ['d_pers'] },
    { id: 'h_water', name: 'Hydrate 3L', type: 'Habit', domain: 'Personal', domainClass: 'domain-personal', colorHex: '#38bdf8', x: 520, y: 480, size: 16, connections: ['d_pers'] },

    // Notes
    { id: 'n_ddia', name: 'DDIA Book Highlights', type: 'Note', domain: 'School', domainClass: 'domain-school', colorHex: '#f43f5e', x: 190, y: 560, size: 14, connections: ['d_school'] },
    { id: 'n_ai', name: 'Nova AI Agent Prompt Engine', type: 'Note', domain: 'Side Project', domainClass: 'domain-side-project', colorHex: '#fb923c', x: 740, y: 250, size: 14, connections: ['d_side'] }
  ]);

  readonly filteredNodes = computed(() => {
    return this.nodes().filter(n => this.selectedDomain() === 'All' || n.domain === this.selectedDomain());
  });

  getLines(): { x1: number; y1: number; x2: number; y2: number; color: string }[] {
    const lines: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
    const all = this.nodes();

    this.filteredNodes().forEach(source => {
      source.connections.forEach(targetId => {
        const target = all.find(n => n.id === targetId);
        if (target && (this.selectedDomain() === 'All' || target.domain === this.selectedDomain())) {
          lines.push({
            x1: source.x,
            y1: source.y,
            x2: target.x,
            y2: target.y,
            color: source.colorHex
          });
        }
      });
    });

    return lines;
  }

  onHoverNode(node: GraphNode | null): void {
    this.hoveredNode.set(node);
  }
}
