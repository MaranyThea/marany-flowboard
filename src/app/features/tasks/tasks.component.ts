import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  domain: 'Work' | 'Side Project' | 'School' | 'Personal';
  domainClass: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  estimatedTime?: string;
  project?: string;
}

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
  readonly activeView = signal<'list' | 'kanban' | 'matrix'>('list');
  readonly selectedDomain = signal<'All' | 'Work' | 'Side Project' | 'School' | 'Personal'>('All');
  readonly selectedPriority = signal<'All' | 'urgent' | 'high' | 'medium' | 'low'>('All');
  readonly searchQuery = signal('');

  // Task creation
  isModalOpen = false;
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskDomain: 'Work' | 'Side Project' | 'School' | 'Personal' = 'Work';
  newTaskPriority: 'urgent' | 'high' | 'medium' | 'low' = 'high';
  newTaskStatus: 'todo' | 'in-progress' | 'done' = 'todo';
  newTaskDueDate = 'Today';
  newTaskProject = '';

  tasks = signal<TaskItem[]>([
    { id: '1', title: 'Refactor FlowBoard Life OS navigation & dark theme', description: 'Replicate Axis productivity structure and dark obsidian aesthetic', domain: 'Side Project', domainClass: 'domain-side-project', priority: 'urgent', status: 'done', dueDate: 'Today', estimatedTime: '2h', project: 'FlowBoard' },
    { id: '2', title: 'Prepare Q3 performance review deck', description: 'Compile metrics, sprint velocity, and team feedback', domain: 'Work', domainClass: 'domain-work', priority: 'high', status: 'done', dueDate: 'Today', estimatedTime: '1.5h', project: 'Core Eng' },
    { id: '3', title: 'Deep work: Design knowledge graph component', description: 'Canvas-based interactive node connections', domain: 'Side Project', domainClass: 'domain-side-project', priority: 'high', status: 'in-progress', dueDate: 'Today', estimatedTime: '3h', project: 'FlowBoard' },
    { id: '4', title: 'Read Machine Learning chapter 4 (Neural Nets)', description: 'Backpropagation and gradient descent proof', domain: 'School', domainClass: 'domain-school', priority: 'medium', status: 'todo', dueDate: 'Tomorrow', estimatedTime: '1h', project: 'CS-402' },
    { id: '5', title: 'Fix subproject Kanban drag & drop issues', description: 'Ensure status changes cascade correctly', domain: 'Side Project', domainClass: 'domain-side-project', priority: 'high', status: 'in-progress', dueDate: 'Tomorrow', estimatedTime: '45m', project: 'FlowBoard' },
    { id: '6', title: 'Review quarterly financial balance sheet', description: 'Check savings rate & subscription audits', domain: 'Personal', domainClass: 'domain-personal', priority: 'low', status: 'todo', dueDate: 'Sep 15', estimatedTime: '30m', project: 'Finance' },
    { id: '7', title: 'Implement Nova AI Assistant Drawer', description: 'Interactive AI companion with daily briefing', domain: 'Side Project', domainClass: 'domain-side-project', priority: 'urgent', status: 'in-progress', dueDate: 'Today', estimatedTime: '2h', project: 'FlowBoard' },
    { id: '8', title: 'Submit distributed systems lab assignment', description: 'Raft consensus algorithm validation', domain: 'School', domainClass: 'domain-school', priority: 'urgent', status: 'todo', dueDate: 'Sep 14', estimatedTime: '4h', project: 'CS-402' }
  ]);

  readonly filteredTasks = computed(() => {
    return this.tasks().filter(task => {
      const matchesDomain = this.selectedDomain() === 'All' || task.domain === this.selectedDomain();
      const matchesPriority = this.selectedPriority() === 'All' || task.priority === this.selectedPriority();
      const matchesSearch = !this.searchQuery().trim() || 
        task.title.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        task.project?.toLowerCase().includes(this.searchQuery().toLowerCase());
      return matchesDomain && matchesPriority && matchesSearch;
    });
  });

  readonly todoTasks = computed(() => this.filteredTasks().filter(t => t.status === 'todo'));
  readonly inProgressTasks = computed(() => this.filteredTasks().filter(t => t.status === 'in-progress'));
  readonly doneTasks = computed(() => this.filteredTasks().filter(t => t.status === 'done'));

  // Matrix quadrants
  readonly matrixQ1 = computed(() => this.filteredTasks().filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done')); // Urgent & Important
  readonly matrixQ2 = computed(() => this.filteredTasks().filter(t => t.priority === 'medium' && t.status !== 'done')); // Not Urgent & Important
  readonly matrixQ3 = computed(() => this.filteredTasks().filter(t => t.priority === 'low' && t.status !== 'done')); // Urgent & Not Important / Low
  readonly matrixQ4 = computed(() => this.filteredTasks().filter(t => t.status === 'done')); // Completed / Delegated

  setView(view: 'list' | 'kanban' | 'matrix'): void {
    this.activeView.set(view);
  }

  setDomain(domain: 'All' | 'Work' | 'Side Project' | 'School' | 'Personal'): void {
    this.selectedDomain.set(domain);
  }

  toggleTaskStatus(task: TaskItem): void {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    this.tasks.update(list => list.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
  }

  setTaskStatus(task: TaskItem, status: 'todo' | 'in-progress' | 'done'): void {
    this.tasks.update(list => list.map(t => t.id === task.id ? { ...t, status } : t));
  }

  deleteTask(taskId: string): void {
    this.tasks.update(list => list.filter(t => t.id !== taskId));
  }

  openNewTaskModal(): void {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskDomain = 'Work';
    this.newTaskPriority = 'high';
    this.newTaskStatus = 'todo';
    this.newTaskDueDate = 'Today';
    this.newTaskProject = '';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveTask(): void {
    if (!this.newTaskTitle.trim()) return;

    const domainClasses: Record<string, string> = {
      'Work': 'domain-work',
      'Side Project': 'domain-side-project',
      'School': 'domain-school',
      'Personal': 'domain-personal'
    };

    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: this.newTaskTitle.trim(),
      description: this.newTaskDescription.trim(),
      domain: this.newTaskDomain,
      domainClass: domainClasses[this.newTaskDomain] || 'domain-work',
      priority: this.newTaskPriority,
      status: this.newTaskStatus,
      dueDate: this.newTaskDueDate || 'Today',
      project: this.newTaskProject.trim() || undefined
    };

    this.tasks.update(list => [newTask, ...list]);
    this.closeModal();
  }
}
