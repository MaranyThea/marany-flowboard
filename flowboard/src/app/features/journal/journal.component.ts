import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface JournalEntry {
  id: string;
  date: string;
  mood: '⚡ Energized' | '😊 Happy' | '🧘 Centered' | '🌧️ Tired';
  intentions: string;
  wins: string;
  gratitude: string;
}

@Component({
  selector: 'app-journal',
  imports: [CommonModule, FormsModule],
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.scss'
})
export class JournalComponent {
  selectedMood: '⚡ Energized' | '😊 Happy' | '🧘 Centered' | '🌧️ Tired' = '⚡ Energized';
  todayIntentions = 'Refactor FlowBoard design system into dark obsidian life OS aesthetic. Execute high-leverage deep work.';
  todayWins = 'Shipped Kanban subprojects and verified build with 0 compile errors. Hit all nutrition targets.';
  todayGratitude = 'Grateful for deep focus, good health, and momentum on software architecture craft.';

  entries = signal<JournalEntry[]>([
    {
      id: 'j1',
      date: 'Wednesday, Sep 9, 2026',
      mood: '⚡ Energized',
      intentions: 'Establish domain color hierarchy and build multi-level project Kanban.',
      wins: 'Finished the recursive project service rollup and breadcrumb navigation.',
      gratitude: 'Supportive team members and smooth TypeScript signals reactivity.'
    },
    {
      id: 'j2',
      date: 'Tuesday, Sep 8, 2026',
      mood: '🧘 Centered',
      intentions: 'Review distributed systems research paper and run 5km.',
      wins: 'Read 25 pages of DDIA and completed morning run in 24 mins.',
      gratitude: 'Quiet morning deep work blocks without context switching.'
    }
  ]);

  saveTodayEntry(): void {
    const newE: JournalEntry = {
      id: Date.now().toString(),
      date: 'Thursday, Sep 10, 2026 (Today)',
      mood: this.selectedMood,
      intentions: this.todayIntentions,
      wins: this.todayWins,
      gratitude: this.todayGratitude
    };

    this.entries.update(list => [newE, ...list]);
  }
}
