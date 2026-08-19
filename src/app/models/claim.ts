export interface Claim {
  id: number;

  branch: string;

  type: 'emergency' | 'standard' | 'other';

  status: 'NEW' | 'REJECT' | 'RETURN' | 'APPROVE';

  amount: number;

  receivedDate: string;
}
