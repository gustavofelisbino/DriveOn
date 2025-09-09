import type { LoginDTO, User } from './types';
import { saveToken } from '../../lib/storage';

export async function login(_dto: LoginDTO): Promise<User> {
  await new Promise(r => setTimeout(r, 500));
  saveToken('fake-jwt-token');
  return { id: '1', name: 'Gustavo', role: 'Mecânico' };
}
export async function logout(): Promise<void> {
  await new Promise(r => setTimeout(r, 100));
  localStorage.removeItem('driveon_token');
}
