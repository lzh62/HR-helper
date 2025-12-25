
export interface Participant {
  id: string;
  name: string;
}

export type AppMode = 'setup' | 'draw' | 'grouping';

export interface GroupResult {
  groupName: string;
  members: string[];
}
