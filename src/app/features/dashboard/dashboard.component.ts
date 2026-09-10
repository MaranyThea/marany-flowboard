import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../projects/services/project.service';
import { Project } from '../projects/models/project';

interface TodayTask {
  id: string;
  title: string;
  domain: 'Work' | 'Side Project' | 'School' | 'Personal';
  domainClass: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  time: string;
  completed: boolean;
}

interface ScheduleBlock {
  id: string;
  time: string;
  title: string;
  domain: string;
  domainClass: string;
  status: 'past' | 'current' | 'upcoming';
  duration: string;
}

interface DailyHabit {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  streak: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  readonly userName = signal('Marany');
  readonly currentDateStr = signal('');
  readonly dailyEnergy = signal<'high' | 'moderate' | 'chill'>('high');

  // Focus Timer
  readonly timerSeconds = signal(25 * 60);
  readonly timerRunning = signal(false);
  readonly timerMode = signal<'25' | '50' | '5'>('25');
  private timerInterval?: any;

  // Scratchpad
  dailyScratchpad = '';

  // Stats
  focusScore = 94;
  completedHabitsCount = 3;
  totalHabitsCount = 4;
  projectsCount = 0;

  todayTasks: TodayTask[] = [
    { id: '1', title: 'Refactor FlowBoard Life OS navigation & dark theme', domain: 'Side Project', domainClass: 'domain-side-project', priority: 'urgent', time: '9:00 AM', completed: true },
    { id: '2', title: 'Prepare Q3 performance review deck', domain: 'Work', domainClass: 'domain-work', priority: 'high', time: '11:30 AM', completed: true },
    { id: '3', title: 'Deep work: Design knowledge graph component', domain: 'Side Project', domainClass: 'domain-side-project', priority: 'high', time: '2:00 PM', completed: false },
    { id: '4', title: 'Read Machine Learning chapter 4 (Neural Nets)', domain: 'School', domainClass: 'domain-school', priority: 'medium', time: '4:30 PM', completed: false },
    { id: '5', title: 'Evening 5km run & stretching session', domain: 'Personal', domainClass: 'domain-personal', priority: 'low', time: '6:30 PM', completed: false }
  ];

  scheduleBlocks: ScheduleBlock[] = [
    { id: 's1', time: '09:00 - 10:30', title: 'Deep Work: FlowBoard Architecture', domain: 'Side Project', domainClass: 'domain-side-project', status: 'past', duration: '1h 30m' },
    { id: 's2', time: '11:00 - 12:00', title: 'Sprint Sync & Backlog Triage', domain: 'Work', domainClass: 'domain-work', status: 'past', duration: '1h' },
    { id: 's3', time: '13:30 - 15:30', title: 'Component Library & Design Tokens', domain: 'Side Project', domainClass: 'domain-side-project', status: 'current', duration: '2h' },
    { id: 's4', time: '16:00 - 17:00', title: 'Data Structures & Algorithms Study', domain: 'School', domainClass: 'domain-school', status: 'upcoming', duration: '1h' },
    { id: 's5', time: '18:00 - 19:30', title: 'Leg Day Workout & Recovery', domain: 'Personal', domainClass: 'domain-personal', status: 'upcoming', duration: '1h 30m' }
  ];

  dailyHabits: DailyHabit[] = [
    { id: 'h1', name: 'Hydrate 3L', icon: '💧', completed: true, streak: 18 },
    { id: 'h2', name: 'Morning Cardio', icon: '🏃', completed: true, streak: 14 },
    { id: 'h3', name: 'Read 20 Mins', icon: '📖', completed: true, streak: 22 },
    { id: 'h4', name: 'Evening Meditation', icon: '🧘', completed: false, streak: 9 }
  ];

  newQuickTaskTitle = '';
  newQuickTaskDomain: 'Work' | 'Side Project' | 'School' | 'Personal' = 'Work';

  ngOnInit(): void {
    const user = this.authService.user();
    if (user?.name) {
      this.userName.set(user.name);
    }

    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    this.currentDateStr.set(now.toLocaleDateString('en-US', options));

    // Load saved scratchpad
    const savedNote = localStorage.getItem('flowboard-today-scratchpad');
    if (savedNote) {
      this.dailyScratchpad = savedNote;
    }

    this.projectService.projects$.subscribe(projects => {
      this.projectsCount = projects.length;
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  toggleTask(task: TodayTask): void {
    task.completed = !task.completed;
  }

  addQuickTask(): void {
    if (!this.newQuickTaskTitle.trim()) return;

    const domainClasses: Record<string, string> = {
      'Work': 'domain-work',
      'Side Project': 'domain-side-project',
      'School': 'domain-school',
      'Personal': 'domain-personal'
    };

    this.todayTasks.unshift({
      id: Date.now().toString(),
      title: this.newQuickTaskTitle.trim(),
      domain: this.newQuickTaskDomain,
      domainClass: domainClasses[this.newQuickTaskDomain] || 'domain-work',
      priority: 'high',
      time: 'Today',
      completed: false
    });

    this.newQuickTaskTitle = '';
  }

  deleteTask(taskId: string): void {
    this.todayTasks = this.todayTasks.filter(t => t.id !== taskId);
  }

  toggleHabit(habit: DailyHabit): void {
    habit.completed = !habit.completed;
    if (habit.completed) habit.streak++;
    else if (habit.streak > 0) habit.streak--;
    this.completedHabitsCount = this.dailyHabits.filter(h => h.completed).length;
  }

  setEnergy(level: 'high' | 'moderate' | 'chill'): void {
    this.dailyEnergy.set(level);
  }

  // Timer Methods
  setTimerMode(mode: '25' | '50' | '5'): void {
    this.timerMode.set(mode);
    if (mode === '25') this.timerSeconds.set(25 * 60);
    else if (mode === '50') this.timerSeconds.set(50 * 60);
    else if (mode === '5') this.timerSeconds.set(5 * 60);
    this.pauseTimer();
  }

  toggleTimer(): void {
    if (this.timerRunning()) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer(): void {
    this.timerRunning.set(true);
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds() > 0) {
        this.timerSeconds.update(s => s - 1);
      } else {
        this.pauseTimer();
      }
    }, 1000);
  }

  pauseTimer(): void {
    this.timerRunning.set(false);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  resetTimer(): void {
    this.pauseTimer();
    this.setTimerMode(this.timerMode());
  }

  get formattedTimer(): string {
    const mins = Math.floor(this.timerSeconds() / 60);
    const secs = this.timerSeconds() % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  saveScratchpad(): void {
    localStorage.setItem('flowboard-today-scratchpad', this.dailyScratchpad);
  }
}
