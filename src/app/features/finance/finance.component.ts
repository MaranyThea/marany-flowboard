import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  domain: string;
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  cadence: 'Monthly' | 'Yearly';
  icon: string;
  nextBilling: string;
}

@Component({
  selector: 'app-finance',
  imports: [CommonModule, FormsModule],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.scss'
})
export class FinanceComponent {
  readonly monthlyIncome = signal(8500);
  readonly monthlyExpenses = signal(3420);
  readonly savingsGoalTarget = signal(50000);
  readonly currentSavings = signal(38400);

  // Modal
  isModalOpen = false;
  newTransTitle = '';
  newTransAmount = 0;
  newTransType: 'income' | 'expense' = 'expense';
  newTransCategory = 'Software';
  newTransDomain = 'Side Project';

  readonly netSavings = computed(() => this.monthlyIncome() - this.monthlyExpenses());
  readonly savingsRate = computed(() => Math.round((this.netSavings() / this.monthlyIncome()) * 100));

  subscriptions = signal<Subscription[]>([
    { id: '1', name: 'OpenAI ChatGPT Plus & API', cost: 42, cadence: 'Monthly', icon: '🤖', nextBilling: 'Sep 18, 2026' },
    { id: '2', name: 'GitHub Copilot Enterprise', cost: 19, cadence: 'Monthly', icon: '🐙', nextBilling: 'Sep 21, 2026' },
    { id: '3', name: 'Figma Professional Suite', cost: 15, cadence: 'Monthly', icon: '🎨', nextBilling: 'Sep 25, 2026' },
    { id: '4', name: 'Vercel Pro & AWS Cloud', cost: 35, cadence: 'Monthly', icon: '▲', nextBilling: 'Sep 30, 2026' }
  ]);

  transactions = signal<Transaction[]>([
    { id: 't1', title: 'Consulting Retainer & Engineering Work', category: 'Income', amount: 4500, type: 'income', date: 'Sep 8, 2026', domain: 'Work' },
    { id: 't2', title: 'AWS Cloud Hosting & Databases', category: 'Infrastructure', amount: 84, type: 'expense', date: 'Sep 7, 2026', domain: 'Side Project' },
    { id: 't3', title: 'Ergonomic Standing Desk Setup', category: 'Office Hardware', amount: 320, type: 'expense', date: 'Sep 5, 2026', domain: 'Personal' },
    { id: 't4', title: 'Course Textbooks & Lab Materials', category: 'Academics', amount: 145, type: 'expense', date: 'Sep 2, 2026', domain: 'School' },
    { id: 't5', title: 'SaaS Customer Subscriptions (FlowBoard)', category: 'Product Revenue', amount: 780, type: 'income', date: 'Sep 1, 2026', domain: 'Side Project' }
  ]);

  readonly totalSubCost = computed(() => {
    return this.subscriptions().reduce((acc, sub) => acc + sub.cost, 0);
  });

  openAddModal(): void {
    this.newTransTitle = '';
    this.newTransAmount = 50;
    this.newTransType = 'expense';
    this.newTransCategory = 'Software';
    this.newTransDomain = 'Side Project';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveTransaction(): void {
    if (!this.newTransTitle.trim() || this.newTransAmount <= 0) return;

    const newT: Transaction = {
      id: Date.now().toString(),
      title: this.newTransTitle.trim(),
      category: this.newTransCategory,
      amount: this.newTransAmount,
      type: this.newTransType,
      date: 'Today',
      domain: this.newTransDomain
    };

    this.transactions.update(list => [newT, ...list]);

    if (this.newTransType === 'expense') {
      this.monthlyExpenses.update(e => e + this.newTransAmount);
    } else {
      this.monthlyIncome.update(i => i + this.newTransAmount);
    }

    this.closeModal();
  }
}
