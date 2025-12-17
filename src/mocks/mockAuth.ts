import { User } from '../lib/types/auth';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@careinvoicing.com',
    role: 'admin',
    name: 'Admin User',
  },
  {
    id: '2',
    username: 'finance',
    email: 'finance@careinvoicing.com',
    role: 'finance',
    name: 'Finance Manager',
  },
  {
    id: '3',
    username: 'manager',
    email: 'manager@careinvoicing.com',
    role: 'manager',
    name: 'Operations Manager',
  },
  {
    id: '4',
    username: 'viewer',
    email: 'viewer@careinvoicing.com',
    role: 'viewer',
    name: 'View Only User',
  },
];

export const mockCredentials: Record<string, string> = {
  admin: 'admin123',
  finance: 'finance123',
  manager: 'manager123',
  viewer: 'viewer123',
};