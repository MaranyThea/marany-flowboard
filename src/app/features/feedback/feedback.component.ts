import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  category: 'Feature' | 'Bug' | 'Performance' | 'UI/UX';
  status: 'In Progress' | 'Planned' | 'Under Review' | 'Completed';
  votes: number;
  hasVoted: boolean;
}

@Component({
  selector: 'app-feedback',
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  newTitle = '';
  newDesc = '';
  newCategory: 'Feature' | 'Bug' | 'Performance' | 'UI/UX' = 'Feature';

  feedbacks = signal<FeedbackItem[]>([
    {
      id: '1',
      title: 'Obsidian Canvas integration & Bi-directional linking',
      description: 'Ability to link [[Project]] tags inside notes and view backlinks.',
      category: 'Feature',
      status: 'In Progress',
      votes: 48,
      hasVoted: true
    },
    {
      id: '2',
      title: 'Mobile Companion PWA & Offline Sync',
      description: 'Smooth iOS & Android PWA with offline action queue and push reminders.',
      category: 'Performance',
      status: 'Planned',
      votes: 36,
      hasVoted: false
    },
    {
      id: '3',
      title: 'Custom Domain Color Palette Themes',
      description: 'Support custom hex color pickers for Work, Side Project, School, Personal.',
      category: 'UI/UX',
      status: 'Under Review',
      votes: 24,
      hasVoted: false
    },
    {
      id: '4',
      title: 'Multi-level Kanban subprojects & Task rollups',
      description: 'Complete subproject hierarchies with recursive task statistics calculation.',
      category: 'Feature',
      status: 'Completed',
      votes: 62,
      hasVoted: true
    }
  ]);

  upvote(item: FeedbackItem): void {
    if (item.hasVoted) {
      item.votes--;
      item.hasVoted = false;
    } else {
      item.votes++;
      item.hasVoted = true;
    }
  }

  submitFeedback(): void {
    if (!this.newTitle.trim()) return;

    this.feedbacks.update(list => [
      {
        id: Date.now().toString(),
        title: this.newTitle.trim(),
        description: this.newDesc.trim(),
        category: this.newCategory,
        status: 'Under Review',
        votes: 1,
        hasVoted: true
      },
      ...list
    ]);

    this.newTitle = '';
    this.newDesc = '';
  }
}
