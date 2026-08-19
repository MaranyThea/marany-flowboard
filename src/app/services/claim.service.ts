import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Claim } from '../models/claim';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  private claims: Claim[] = [
    {
      id: 1,
      branch: 'Phnom Penh',
      type: 'standard',
      status: 'NEW',
      amount: 450,
      receivedDate: '2026-08-19'
    },
    {
      id: 2,
      branch: 'Phnom Penh',
      type: 'emergency',
      status: 'APPROVE',
      amount: 1200,
      receivedDate: '2026-08-19'
    },
    {
      id: 3,
      branch: 'Takhmao',
      type: 'standard',
      status: 'RETURN',
      amount: 680,
      receivedDate: '2026-08-19'
    },
    {
      id: 4,
      branch: 'Siem Reap',
      type: 'emergency',
      status: 'REJECT',
      amount: 950,
      receivedDate: '2026-08-18'
    },
    {
      id: 5,
      branch: 'Phnom Penh',
      type: 'standard',
      status: 'APPROVE',
      amount: 1500,
      receivedDate: '2026-08-18'
    },
    {
      id: 6,
      branch: 'Battambang',
      type: 'other',
      status: 'NEW',
      amount: 300,
      receivedDate: '2026-08-18'
    },
    {
      id: 7,
      branch: 'Takhmao',
      type: 'emergency',
      status: 'APPROVE',
      amount: 1100,
      receivedDate: '2026-08-17'
    },
    {
      id: 8,
      branch: 'Siem Reap',
      type: 'standard',
      status: 'NEW',
      amount: 520,
      receivedDate: '2026-08-17'
    },
    {
      id: 9,
      branch: 'Phnom Penh',
      type: 'other',
      status: 'REJECT',
      amount: 750,
      receivedDate: '2026-08-16'
    },
    {
      id: 10,
      branch: 'Battambang',
      type: 'standard',
      status: 'APPROVE',
      amount: 890,
      receivedDate: '2026-08-16'
    },
    {
      id: 11,
      branch: 'Takhmao',
      type: 'standard',
      status: 'NEW',
      amount: 430,
      receivedDate: '2026-08-15'
    },
    {
      id: 12,
      branch: 'Siem Reap',
      type: 'other',
      status: 'RETURN',
      amount: 620,
      receivedDate: '2026-08-15'
    }
  ];

  private readonly claimsSubject =
    new BehaviorSubject<Claim[]>(this.claims);

  readonly claims$ =
    this.claimsSubject.asObservable();

  getClaims(): Claim[] {
    return this.claims;
  }
}
