import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ProjectService } from './services/project.service';
import { Milestone, Project, ProjectDomain, ProjectStatus, ProjectTask, SubProjectItem, TaskActivity } from './models/project';

export interface DomainGroup {
  id: ProjectDomain;
  label: string;
  dotColor: string;
  count: number;
  projects: Project[];
}

@Component({
  selector: 'app-projects',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly fb = inject(FormBuilder);

  projects = signal<Project[]>([]);
  selectedProjectId = signal<number | null>(null);
  selectedSubProjectId = signal<number | null>(null);

  searchQuery = signal<string>('');
  selectedDomain = signal<string>('all');
  activeTab = signal<'active' | 'archived'>('active');
  sortBy = signal<'due-soonest' | 'alphabetical' | 'recent' | 'progress'>('due-soonest');

  // Project Modal State
  showForm = false;
  editingProjectId: number | null = null;
  sortDropdownOpen = false;

  // Task Edit Modal State
  showTaskModal = false;
  editingTaskId: number | null = null;
  currentTaskActivity: TaskActivity[] = [];

  // Milestone input form state
  newMilestoneTitle = '';
  newMilestoneDue = '';

  // Task inline add state
  addingTaskToStatus: 'todo' | 'in-progress' | 'done' | null = null;
  newTaskTitle = '';

  readonly domainConfig: { id: ProjectDomain; label: string; dotColor: string }[] = [
    { id: 'work', label: 'WORK', dotColor: '#4ade80' },
    { id: 'side-project', label: 'SIDE PROJECT', dotColor: '#fb923c' },
    { id: 'school', label: 'SCHOOL', dotColor: '#f43f5e' },
    { id: 'personal', label: 'PERSONAL', dotColor: '#38bdf8' }
  ];

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    domain: ['side-project' as ProjectDomain, [Validators.required]],
    parentProject: ['' as string | number],
    due: [''],
    notes: [''],
    idleDays: [null as number | null],
    goal: [''],
    tags: [''],
    repeats: ['never'],
    status: ['on-track' as ProjectStatus]
  });

  taskForm = this.fb.group({
    title: ['', [Validators.required]],
    status: ['todo' as 'todo' | 'in-progress' | 'done', [Validators.required]],
    description: [''],
    due: [''],
    highPriority: [false],
    assignee: [''],
    notes: ['']
  });

  // Selected Project
  selectedProject = computed<Project | null>(() => {
    const id = this.selectedProjectId();
    if (id === null) return null;
    return this.projects().find(p => p.id === id) || null;
  });

  // Selected SubProject
  selectedSubProject = computed<SubProjectItem | null>(() => {
    const p = this.selectedProject();
    const subId = this.selectedSubProjectId();
    if (!p || !subId || !p.subProjects) return null;
    return p.subProjects.find(s => s.id === subId) || null;
  });

  // Current active item (either sub-project or project)
  activeItem = computed(() => {
    const sub = this.selectedSubProject();
    if (sub) {
      const parent = this.selectedProject();
      return {
        id: sub.id,
        name: sub.name,
        domain: sub.domain || parent?.domain || 'side-project',
        status: sub.status || 'on-track',
        progress: sub.progress || 0,
        due: undefined,
        totalTasks: sub.totalTasks || sub.tasks?.length || 0,
        openTasks: sub.openTasks || 0,
        tasksSummary: sub.tasksSummary || { todo: 0, inProgress: 0, done: 0 },
        tasks: sub.tasks || [],
        milestones: sub.milestones || [],
        subProjects: sub.subProjects || [],
        isSubProject: true,
        parentName: parent?.name
      };
    }

    const p = this.selectedProject();
    if (p) {
      return {
        id: p.id,
        name: p.name,
        domain: p.domain,
        status: p.status,
        progress: p.progress || 0,
        due: p.due,
        totalTasks: p.totalTasks || 4,
        openTasks: p.openTasks || 0,
        tasksSummary: p.tasksSummary || { todo: 0, inProgress: 0, done: 0 },
        tasks: p.tasks || [],
        milestones: p.milestones || [],
        subProjects: p.subProjects || [],
        isSubProject: false,
        parentName: undefined
      };
    }

    return null;
  });

  // KPI Computations
  activeProjectsCount = computed(() =>
    this.projects().filter(p => !p.isArchived).length
  );

  archivedProjectsCount = computed(() =>
    this.projects().filter(p => !!p.isArchived).length
  );

  atRiskCount = computed(() =>
    this.projects().filter(p => !p.isArchived && p.status === 'at-risk').length
  );

  dueWithin7dCount = computed(() => 0);

  avgProgress = computed(() => {
    const active = this.projects().filter(p => !p.isArchived);
    if (active.length === 0) return 0;
    const total = active.reduce((sum, p) => sum + (p.progress || 0), 0);
    return Math.round(total / active.length);
  });

  getDomainCount(domainId: string): number {
    if (domainId === 'all') {
      return this.activeProjectsCount();
    }
    return this.projects().filter(p => !p.isArchived && p.domain === domainId).length;
  }

  // Filtered & Grouped Projects
  groupedProjects = computed<DomainGroup[]>(() => {
    const list = this.projects();
    const query = this.searchQuery().toLowerCase().trim();
    const domainFilter = this.selectedDomain();
    const isArchivedTab = this.activeTab() === 'archived';
    const sort = this.sortBy();

    let filtered = list.filter(p => (isArchivedTab ? !!p.isArchived : !p.isArchived));

    if (query) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.nextTask && p.nextTask.toLowerCase().includes(query)) ||
        (p.subProjects && p.subProjects.some(s => s.name.toLowerCase().includes(query)))
      );
    }

    if (domainFilter !== 'all') {
      filtered = filtered.filter(p => p.domain === domainFilter);
    }

    filtered = [...filtered].sort((a, b) => {
      if (sort === 'alphabetical') {
        return a.name.localeCompare(b.name);
      } else if (sort === 'progress') {
        return (b.progress || 0) - (a.progress || 0);
      } else if (sort === 'recent') {
        return (b.id || 0) - (a.id || 0);
      } else {
        if (a.due && !b.due) return -1;
        if (!a.due && b.due) return 1;
        return 0;
      }
    });

    const groups: DomainGroup[] = [];

    for (const conf of this.domainConfig) {
      if (domainFilter !== 'all' && domainFilter !== conf.id) {
        continue;
      }

      const domainProjects = filtered.filter(p => p.domain === conf.id);
      if (domainProjects.length > 0 || (domainFilter === conf.id && domainProjects.length === 0)) {
        groups.push({
          id: conf.id,
          label: conf.label,
          dotColor: conf.dotColor,
          count: domainProjects.length,
          projects: domainProjects
        });
      }
    }

    return groups;
  });

  ngOnInit(): void {
    this.projectService.projects$.subscribe(projects => {
      this.projects.set(projects);
    });
  }

  // Navigation handlers
  openProjectDetails(project: Project, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedProjectId.set(project.id);
    this.selectedSubProjectId.set(null);
  }

  openSubProjectDetails(sub: SubProjectItem, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedSubProjectId.set(sub.id);
  }

  backToParentProject(): void {
    this.selectedSubProjectId.set(null);
  }

  backToProjectList(): void {
    this.selectedProjectId.set(null);
    this.selectedSubProjectId.set(null);
  }

  setDomain(domain: string): void {
    this.selectedDomain.set(domain);
  }

  setTab(tab: 'active' | 'archived'): void {
    this.activeTab.set(tab);
  }

  setSort(sort: 'due-soonest' | 'alphabetical' | 'recent' | 'progress'): void {
    this.sortBy.set(sort);
    this.sortDropdownOpen = false;
  }

  toggleSortDropdown(): void {
    this.sortDropdownOpen = !this.sortDropdownOpen;
  }

  openCreateForm(defaultParentId?: number, defaultDomain?: ProjectDomain): void {
    this.editingProjectId = null;
    this.projectForm.reset({
      name: '',
      domain: defaultDomain || 'side-project',
      parentProject: defaultParentId ? defaultParentId.toString() : '',
      due: '',
      notes: '',
      idleDays: null,
      goal: '',
      tags: '',
      repeats: 'never',
      status: 'on-track'
    });
    this.showForm = true;
  }

  openEditForm(project: Project, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.editingProjectId = project.id;
    this.projectForm.setValue({
      name: project.name,
      domain: project.domain,
      parentProject: project.parentId ? project.parentId.toString() : '',
      due: project.due || '',
      notes: project.notes || '',
      idleDays: project.idleDays || null,
      goal: project.goal || '',
      tags: project.tags ? project.tags.join(', ') : '',
      repeats: project.repeats || 'never',
      status: project.status || 'on-track'
    });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingProjectId = null;
  }

  saveProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const formValue = this.projectForm.getRawValue();
    const parentId = formValue.parentProject ? Number(formValue.parentProject) : null;

    if (this.editingProjectId === null) {
      if (parentId) {
        this.projectService.addSubProject(parentId, formValue.name!);
      } else {
        const newProject: Project = {
          id: Date.now(),
          name: formValue.name!,
          domain: formValue.domain as ProjectDomain,
          status: (formValue.status as ProjectStatus) || 'on-track',
          due: formValue.due || '',
          progress: 0,
          openTasks: 0,
          totalTasks: 0,
          tasksSummary: { todo: 0, inProgress: 0, done: 0 },
          tasks: [],
          subProjects: [],
          milestones: [],
          notes: formValue.notes || '',
          idleDays: formValue.idleDays,
          goal: formValue.goal || '',
          tags: formValue.tags ? formValue.tags.split(',').map(t => t.trim()) : [],
          repeats: formValue.repeats || 'never',
          isArchived: false,
          createdAt: new Date().toISOString().split('T')[0]
        };
        this.projectService.addProject(newProject);
      }
    } else {
      const existing = this.projects().find(p => p.id === this.editingProjectId);
      if (!existing) return;

      const updated: Project = {
        ...existing,
        name: formValue.name!,
        domain: formValue.domain as ProjectDomain,
        status: (formValue.status as ProjectStatus) || existing.status,
        due: formValue.due || '',
        notes: formValue.notes || '',
        idleDays: formValue.idleDays,
        goal: formValue.goal || '',
        tags: formValue.tags ? formValue.tags.split(',').map(t => t.trim()) : [],
        repeats: formValue.repeats || 'never'
      };
      this.projectService.updateProject(updated);
    }

    this.closeForm();
  }

  // Task Edit Modal Handlers
  openEditTaskModal(task: ProjectTask, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.editingTaskId = task.id;
    this.currentTaskActivity = task.activity && task.activity.length > 0
      ? task.activity
      : [{ action: 'Created', timestamp: 'Sep 9, 10:43 PM' }];

    this.taskForm.setValue({
      title: task.title,
      status: task.status || 'todo',
      description: task.description || '',
      due: task.due || '',
      highPriority: task.priority === 'high',
      assignee: task.assignee || '',
      notes: task.notes || ''
    });

    this.showTaskModal = true;
  }

  closeEditTaskModal(): void {
    this.showTaskModal = false;
    this.editingTaskId = null;
  }

  saveTaskModal(): void {
    if (this.taskForm.invalid || !this.editingTaskId) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const proj = this.selectedProject();
    if (!proj) return;

    const formValue = this.taskForm.getRawValue();
    const updatedTask: ProjectTask = {
      id: this.editingTaskId,
      title: formValue.title!,
      status: formValue.status as 'todo' | 'in-progress' | 'done',
      description: formValue.description || '',
      due: formValue.due || '',
      priority: formValue.highPriority ? 'high' : 'medium',
      assignee: formValue.assignee || '',
      notes: formValue.notes || '',
      activity: this.currentTaskActivity
    };

    this.projectService.updateTaskDetails(proj.id, this.selectedSubProjectId(), updatedTask);
    this.closeEditTaskModal();
  }

  deleteCurrentTaskModal(): void {
    const proj = this.selectedProject();
    if (proj && this.editingTaskId) {
      this.projectService.deleteTask(proj.id, this.selectedSubProjectId(), this.editingTaskId);
    }
    this.closeEditTaskModal();
  }

  toggleComplete(project: Project | { id: number }, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.projectService.toggleComplete(project.id);
  }

  toggleArchive(project: Project, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.projectService.toggleArchive(project.id);
  }

  // Milestones handling
  addMilestone(): void {
    const proj = this.selectedProject();
    if (!proj || !this.newMilestoneTitle.trim()) return;

    this.projectService.addMilestone(proj.id, this.selectedSubProjectId(), this.newMilestoneTitle.trim(), this.newMilestoneDue.trim());
    this.newMilestoneTitle = '';
    this.newMilestoneDue = '';
  }

  toggleMilestone(milestoneId: number): void {
    const proj = this.selectedProject();
    if (proj) {
      this.projectService.toggleMilestone(proj.id, this.selectedSubProjectId(), milestoneId);
    }
  }

  deleteMilestone(milestoneId: number, event?: Event): void {
    if (event) event.stopPropagation();
    const proj = this.selectedProject();
    if (proj) {
      this.projectService.deleteMilestone(proj.id, this.selectedSubProjectId(), milestoneId);
    }
  }

  // Tasks column handlers
  getActiveTasksByStatus(status: 'todo' | 'in-progress' | 'done'): ProjectTask[] {
    const item = this.activeItem();
    if (!item || !item.tasks) return [];
    return item.tasks.filter(t => t.status === status);
  }

  getActiveTasksTotalCount(): number {
    const item = this.activeItem();
    return item?.tasks?.length || 0;
  }

  openAddTask(status: 'todo' | 'in-progress' | 'done' = 'todo'): void {
    this.addingTaskToStatus = status;
    this.newTaskTitle = '';
  }

  closeAddTask(): void {
    this.addingTaskToStatus = null;
    this.newTaskTitle = '';
  }

  submitNewTask(status: 'todo' | 'in-progress' | 'done'): void {
    const proj = this.selectedProject();
    if (!proj || !this.newTaskTitle.trim()) return;

    this.projectService.addTask(proj.id, this.selectedSubProjectId(), this.newTaskTitle.trim(), status);
    this.closeAddTask();
  }

  updateTaskStatus(taskId: number, newStatus: 'todo' | 'in-progress' | 'done'): void {
    const proj = this.selectedProject();
    if (proj) {
      this.projectService.updateTaskStatus(proj.id, this.selectedSubProjectId(), taskId, newStatus);
    }
  }

  deleteTask(taskId: number, event?: Event): void {
    if (event) event.stopPropagation();
    const proj = this.selectedProject();
    if (proj) {
      this.projectService.deleteTask(proj.id, this.selectedSubProjectId(), taskId);
    }
  }

  getDomainDotColor(domain: ProjectDomain): string {
    const match = this.domainConfig.find(d => d.id === domain);
    return match ? match.dotColor : '#38bdf8';
  }

  getDomainLabel(domain: ProjectDomain): string {
    switch (domain) {
      case 'work': return 'Work';
      case 'side-project': return 'Side Project';
      case 'school': return 'School';
      case 'personal': return 'Personal';
      default: return 'Side Project';
    }
  }

  getSortLabel(): string {
    switch (this.sortBy()) {
      case 'due-soonest': return 'Due soonest';
      case 'alphabetical': return 'Alphabetical';
      case 'recent': return 'Recently added';
      case 'progress': return 'Highest progress';
      default: return 'Due soonest';
    }
  }
}
