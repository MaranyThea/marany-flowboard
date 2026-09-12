import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface IdeaNote {
  id: string;
  title: string;
  content: string;
  tag: string;
  color: 'yellow' | 'coral' | 'cyan' | 'purple' | 'green';
  likes: number;
  createdDate: string;
}

@Component({
  selector: 'app-brainstorming',
  imports: [CommonModule, FormsModule],
  templateUrl: './brainstorming.component.html',
  styleUrl: './brainstorming.component.scss'
})
export class BrainstormingComponent {
  newTitle = '';
  newContent = '';
  newTag = 'Feature Idea';
  newColor: 'yellow' | 'coral' | 'cyan' | 'purple' | 'green' = 'cyan';

  ideas = signal<IdeaNote[]>([
    {
      id: '1',
      title: 'AI Agent Daily Briefing',
      content: 'Have Nova AI generate a 3-bullet synthesis of morning calendar + top 3 high-impact tasks automatically at 8:00 AM.',
      tag: 'AI Feature',
      color: 'cyan',
      likes: 12,
      createdDate: 'Sep 9, 2026'
    },
    {
      id: '2',
      title: 'Canvas Mind Map Node Connections',
      content: 'Allow drag-and-drop connectors between project milestones and life goals in the Graph view.',
      tag: 'UI/UX',
      color: 'purple',
      likes: 8,
      createdDate: 'Sep 8, 2026'
    },
    {
      id: '3',
      title: 'Offline Sync & LocalStorage PWA',
      content: 'Cache whole FlowBoard workspace locally using IndexedDB for instant load speeds with zero latency.',
      tag: 'Performance',
      color: 'green',
      likes: 15,
      createdDate: 'Sep 5, 2026'
    },
    {
      id: '4',
      title: 'Voice-to-Task Quick Capture',
      content: 'Hold spacebar in search ⌘K to dictate a quick note or task that gets transcribed and categorized by LLM.',
      tag: 'Productivity',
      color: 'yellow',
      likes: 9,
      createdDate: 'Sep 4, 2026'
    }
  ]);

  addIdea(): void {
    if (!this.newTitle.trim() && !this.newContent.trim()) return;

    this.ideas.update(list => [
      {
        id: Date.now().toString(),
        title: this.newTitle.trim() || 'Untitled Idea',
        content: this.newContent.trim(),
        tag: this.newTag,
        color: this.newColor,
        likes: 1,
        createdDate: 'Just now'
      },
      ...list
    ]);

    this.newTitle = '';
    this.newContent = '';
  }

  likeIdea(idea: IdeaNote): void {
    idea.likes++;
  }

  deleteIdea(id: string): void {
    this.ideas.update(list => list.filter(i => i.id !== id));
  }
}
