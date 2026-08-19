import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [
    {
      id: 1,
      name: 'Marany Thea',
      email: 'marany@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2026-08-01',
    },
    {
      id: 2,
      name: 'Sopheak Chan',
      email: 'sopheak@example.com',
      role: 'manager',
      status: 'active',
      createdAt: '2026-08-05',
    },
    {
      id: 3,
      name: 'Dara Kim',
      email: 'dara@example.com',
      role: 'member',
      status: 'active',
      createdAt: '2026-08-10',
    },
    {
      id: 4,
      name: 'Sreyneang Lim',
      email: 'sreyneang@example.com',
      role: 'member',
      status: 'inactive',
      createdAt: '2026-08-12',
    },
  ];

  private readonly usersSubject = new BehaviorSubject<User[]>(this.users);

  readonly users$ = this.usersSubject.asObservable();

  getUsers(): User[] {
    return this.users;
  }

  addUser(user: User): void {
    this.users.push(user);
    this.usersSubject.next(this.users);
  }

  updateUser(updatedUser: User): void {
    const index = this.users.findIndex((user) => user.id === updatedUser.id);

    if (index !== -1) {
      this.users[index] = updatedUser;
      this.usersSubject.next(this.users);
    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter((user) => user.id !== id);

    this.usersSubject.next(this.users);
  }
}
