import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-users',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  users: User[] = [];

  showForm = false;
  editingUserId: number | null = null;

  userForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['member' as User['role'], [Validators.required]],
    status: ['active' as User['status'], [Validators.required]],
  });

  ngOnInit(): void {
    this.userService.users$.subscribe((users) => {
      this.users = users;
    });
  }

  openCreateForm(): void {
    this.editingUserId = null;

    this.userForm.reset({
      name: '',
      email: '',
      role: 'member',
      status: 'active',
    });

    this.showForm = true;
  }

  openEditForm(user: User): void {
    this.editingUserId = user.id;

    this.userForm.setValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingUserId = null;

    this.userForm.reset({
      name: '',
      email: '',
      role: 'member',
      status: 'active',
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();

    // CREATE
    if (this.editingUserId === null) {
      const newUser: User = {
        id: Date.now(),
        name: formValue.name,
        email: formValue.email,
        role: formValue.role,
        status: formValue.status,
        createdAt: new Date().toISOString().split('T')[0],
      };

      this.userService.addUser(newUser);
    } else {
      // UPDATE
      const existingUser = this.users.find(
        (user) => user.id === this.editingUserId,
      );

      if (!existingUser) {
        return;
      }

      const updatedUser: User = {
        ...existingUser,
        name: formValue.name,
        email: formValue.email,
        role: formValue.role,
        status: formValue.status,
      };

      this.userService.updateUser(updatedUser);
    }

    this.closeForm();
  }

  deleteUser(id: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user?',
    );

    if (!confirmed) {
      return;
    }

    this.userService.deleteUser(id);
  }
}
