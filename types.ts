import { LucideIcon } from 'lucide-react';

export enum PageView {
  LOGIN = 'LOGIN',
  GAME = 'GAME',
  STORE = 'STORE',
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN',
}

export type ItemType = 'furniture' | 'decoration' | 'surface' | 'plant' | 'lighting';

export interface GameItem {
  id: string;
  name: string;
  type: ItemType;
  price: number;
  description: string;
  width: number; // in grid units
  height: number; // in grid units
  color: string;
  iconName: string; // Key to map to Lucide icon or custom SVG
}

export interface PlacedItem extends GameItem {
  instanceId: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
  zIndex: number;
}

export interface UserProfile {
  username: string;
  level: number;
  xp: number;
  currency: number;
  inventory: GameItem[];
  joinedDate: string;
  isAdmin?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
