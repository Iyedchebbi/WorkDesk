
export type ProjectStatus = 'Active' | 'Completed';
export type TaskStatus = 'To Do' | 'Done';
export type InvoiceStatus = 'Paid' | 'Unpaid';
export type PlanType = 'free' | 'pro' | 'agency';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  deadline: string;
  clientId: string;
  budget: number;
  userId: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  projectId: string;
  userId: string;
}

export interface Invoice {
  id: string;
  title: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  clientId: string;
  userId: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  planType: PlanType;
  credits: number;
  stripeCustomerId?: string;
  subscriptionStatus?: string;
}
