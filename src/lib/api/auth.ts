import { LoginCredentials, AuthResponse, User } from '../../lib/types/auth';
import { mockUsers, mockCredentials } from '../../mocks/mockAuth';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  await delay(500); // Simulate network delay

  const user = mockUsers.find(u => u.username === credentials.username);
  
  if (!user) {
    throw new Error('Invalid username or password');
  }

  const expectedPassword = mockCredentials[credentials.username];
  if (credentials.password !== expectedPassword) {
    throw new Error('Invalid username or password');
  }

  return {
    user,
    token: `mock-jwt-token-${user.id}`,
  };
}

export async function logout(): Promise<void> {
  await delay(200);
  // Just simulate API call, actual logout handled by store
}

export async function getCurrentUser(token: string): Promise<User> {
  await delay(300);
  
  // Extract user ID from mock token
  const userId = token.split('-').pop();
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('Invalid token');
  }
  
  return user;
}