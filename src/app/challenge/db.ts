import fs from 'fs/promises';
import path from 'path';
import { User } from './types';

const DATA_PATH = path.join(process.cwd(), 'data.json');

export async function readDb(): Promise<User[]> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Default fallback data
    return [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Smith' },
    ];
  }
}

export async function writeDb(users: User[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2));
}
