import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  icon: string;
  model: string;
  status: 'active' | 'paused' | 'running';
  trigger: string;
  lastRun: string;
  successRate: number;
  description: string;
  executionsCount: number;
}

@Component({
  selector: 'app-agents',
  imports: [CommonModule, FormsModule],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss'
})
export class AgentsComponent {
  agents = signal<AIAgent[]>([
    {
      id: 'a1',
      name: 'Nova Daily Briefing Agent',
      role: 'Executive AI Chief of Staff',
      icon: '✦',
      model: 'Gemini 2.0 Flash / Pro',
      status: 'active',
      trigger: 'Every morning at 08:00 AM',
      lastRun: 'Today at 08:00 AM',
      successRate: 99,
      description: 'Synthesizes calendar appointments, urgent tasks, and life domain milestones into a 2-minute actionable morning brief.',
      executionsCount: 142
    },
    {
      id: 'a2',
      name: 'Eisenhower Task Prioritizer',
      role: 'Action & Backlog Optimizer',
      icon: '⚡',
      model: 'Claude 3.5 Sonnet',
      status: 'active',
      trigger: 'On task creation or domain update',
      lastRun: '1 hour ago',
      successRate: 98,
      description: 'Analyzes task title and urgency context to automatically assign priority matrices, domains, and estimated timeblocks.',
      executionsCount: 389
    },
    {
      id: 'a3',
      name: 'Deep Work Session Guardian',
      role: 'Focus & Distraction Blocker',
      icon: '🛡️',
      model: 'Local On-Device Engine',
      status: 'active',
      trigger: 'When Focus Timer starts',
      lastRun: 'Yesterday at 02:00 PM',
      successRate: 100,
      description: 'Mutes non-critical notifications, activates ambient soundscapes, and tracks focus duration against weekly goals.',
      executionsCount: 64
    },
    {
      id: 'a4',
      name: 'Evening Reflection & Gratitude Agent',
      role: 'Mindfulness & Journal Coach',
      icon: '📖',
      model: 'Gemini 2.0 Pro',
      status: 'paused',
      trigger: 'Every evening at 09:30 PM',
      lastRun: '2 days ago',
      successRate: 95,
      description: 'Asks 3 personalized reflective prompts based on tasks checked off during the day and records entry in your Journal.',
      executionsCount: 52
    }
  ]);

  toggleAgentStatus(agent: AIAgent): void {
    agent.status = agent.status === 'active' ? 'paused' : 'active';
  }

  runAgent(agent: AIAgent): void {
    agent.status = 'running';
    setTimeout(() => {
      agent.status = 'active';
      agent.lastRun = 'Just now';
      agent.executionsCount++;
    }, 1200);
  }
}
