import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: Task[] = [
    {
      id: 1,
      title: 'Complete Dashboard',
      description: 'Build the FlowBoard dashboard',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-08-20',
      createdAt: '2026-08-18'
    },
    {
      id: 2,
      title: 'Create Task Management',
      description: 'Build task creation and management features',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-08-22',
      createdAt: '2026-08-18'
    },
    {
      id: 3,
      title: 'Design Profile Page',
      description: 'Create the user profile interface',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-08-25',
      createdAt: '2026-08-18'
    },
    {
      id: 4,
      title: 'Setup Authentication',
      description: 'Implement login and route protection',
      status: 'completed',
      priority: 'high',
      dueDate: '2026-08-18',
      createdAt: '2026-08-17'
    },
    {
      id: 5,
      title: 'Setup Authentication',
      description: 'Implement login and route protection',
      status: 'completed',
      priority: 'high',
      dueDate: '2026-08-18',
      createdAt: '2026-08-17'
    }
  ];

  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  tasks$ = this.tasksSubject.asObservable();

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Task): void {
    this.tasks.push(task);
    this.tasksSubject.next(this.tasks);
  }

  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);

    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.tasksSubject.next(this.tasks);
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.tasksSubject.next(this.tasks);
  }
}
