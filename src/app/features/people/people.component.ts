import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  company: string;
  relationship: 'Colleague' | 'Mentor' | 'Friend' | 'Client' | 'Investor';
  domain: 'Work' | 'Side Project' | 'School' | 'Personal';
  domainClass: string;
  lastContact: string;
  cadence: string;
  email: string;
  avatarColor: string;
  notes: string;
}

@Component({
  selector: 'app-people',
  imports: [CommonModule, FormsModule],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent {
  readonly selectedDomain = signal<'All' | 'Work' | 'Side Project' | 'School' | 'Personal'>('All');
  readonly searchQuery = signal('');

  // Modal
  isModalOpen = false;
  newName = '';
  newRole = '';
  newCompany = '';
  newRelationship: 'Colleague' | 'Mentor' | 'Friend' | 'Client' | 'Investor' = 'Colleague';
  newDomain: 'Work' | 'Side Project' | 'School' | 'Personal' = 'Work';
  newCadence = 'Every 2 Weeks';
  newEmail = '';
  newNotes = '';

  people = signal<ContactPerson[]>([
    {
      id: '1',
      name: 'Alex Rivera',
      role: 'Staff Infrastructure Architect',
      company: 'Vercel / Next.js',
      relationship: 'Mentor',
      domain: 'Work',
      domainClass: 'domain-work',
      lastContact: '3 days ago',
      cadence: 'Monthly',
      email: 'alex.rivera@example.com',
      avatarColor: 'linear-gradient(135deg, #38bdf8, #6366f1)',
      notes: 'Advised on distributed state hydration and edge caching strategies.'
    },
    {
      id: '2',
      name: 'Sophia Chen',
      role: 'Founding Engineer & Co-Creator',
      company: 'FlowBoard Core',
      relationship: 'Colleague',
      domain: 'Side Project',
      domainClass: 'domain-side-project',
      lastContact: 'Yesterday',
      cadence: 'Weekly',
      email: 'sophia@flowboard.dev',
      avatarColor: 'linear-gradient(135deg, #fb923c, #ea580c)',
      notes: 'Syncing on dark obsidian theme tokens and Nova AI agent drawer integration.'
    },
    {
      id: '3',
      name: 'Prof. David Vance',
      role: 'Distributed Systems Faculty Lead',
      company: 'Tech Institute',
      relationship: 'Mentor',
      domain: 'School',
      domainClass: 'domain-school',
      lastContact: '1 week ago',
      cadence: 'Bi-weekly',
      email: 'dvance@univ.edu',
      avatarColor: 'linear-gradient(135deg, #f43f5e, #be123c)',
      notes: 'Thesis supervision regarding consensus latency under network partition.'
    },
    {
      id: '4',
      name: 'Marcus Brody',
      role: 'Marathon Coach & Physiotherapist',
      company: 'Apex Performance Lab',
      relationship: 'Friend',
      domain: 'Personal',
      domainClass: 'domain-personal',
      lastContact: '5 days ago',
      cadence: 'Weekly',
      email: 'marcus.run@example.com',
      avatarColor: 'linear-gradient(135deg, #4ade80, #059669)',
      notes: 'Half marathon training progression and heart rate zone 2 calibration.'
    }
  ]);

  readonly filteredPeople = computed(() => {
    return this.people().filter(p => {
      const matchesDomain = this.selectedDomain() === 'All' || p.domain === this.selectedDomain();
      const matchesSearch = !this.searchQuery().trim() ||
        p.name.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        p.role.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        p.company.toLowerCase().includes(this.searchQuery().toLowerCase());
      return matchesDomain && matchesSearch;
    });
  });

  setDomain(domain: 'All' | 'Work' | 'Side Project' | 'School' | 'Personal'): void {
    this.selectedDomain.set(domain);
  }

  logTouchpoint(person: ContactPerson): void {
    person.lastContact = 'Today';
  }

  openAddModal(): void {
    this.newName = '';
    this.newRole = '';
    this.newCompany = '';
    this.newRelationship = 'Colleague';
    this.newDomain = 'Work';
    this.newCadence = 'Every 2 Weeks';
    this.newEmail = '';
    this.newNotes = '';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  savePerson(): void {
    if (!this.newName.trim()) return;

    const domainClasses: Record<string, string> = {
      'Work': 'domain-work',
      'Side Project': 'domain-side-project',
      'School': 'domain-school',
      'Personal': 'domain-personal'
    };

    const newP: ContactPerson = {
      id: Date.now().toString(),
      name: this.newName.trim(),
      role: this.newRole.trim() || 'Professional',
      company: this.newCompany.trim() || 'Independent',
      relationship: this.newRelationship,
      domain: this.newDomain,
      domainClass: domainClasses[this.newDomain] || 'domain-work',
      lastContact: 'Today',
      cadence: this.newCadence,
      email: this.newEmail.trim() || 'contact@example.com',
      avatarColor: 'linear-gradient(135deg, #38bdf8, #a78bfa)',
      notes: this.newNotes.trim()
    };

    this.people.update(list => [newP, ...list]);
    this.closeModal();
  }

  deletePerson(id: string): void {
    this.people.update(list => list.filter(p => p.id !== id));
  }
}
