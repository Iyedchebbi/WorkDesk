
import { Project, Client, Task, Invoice, UserProfile } from './types';

export const COLORS = {
  background: '#020617',
  card: '#0F172A',
  border: '#1E2938',
  accent: '#22D3EE',
  primaryText: '#F8FAFC',
  secondaryText: '#94A3B8',
};

export const MOCK_USER: UserProfile = {
  name: 'Guest User',
  email: 'user@workdesk.io',
  avatar: 'https://ui-avatars.com/api/?name=User&background=22D3EE&color=020617',
  role: 'Freelancer',
  planType: 'free',
  credits: 3
};

export const MOCK_CLIENTS: Client[] = [];

export const MOCK_PROJECTS: Project[] = [];

export const MOCK_TASKS: Task[] = [];

export const MOCK_INVOICES: Invoice[] = [];

export const STRIPE_LINKS = {
  pro: 'https://buy.stripe.com/test_aFa5kF9h03J58QvcatfEk00',
  agency: 'https://buy.stripe.com/test_dRmfZjctc1AXfeTa2lfEk01'
};
