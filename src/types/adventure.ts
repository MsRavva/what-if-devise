// Типы для текстового приключения

export interface Item {
  id: string;
  name: string;
  description: string;
  takeable: boolean;
  usable?: boolean;
}

export interface Exit {
  direction: string;
  targetLocationId: string;
  description?: string;
  locked?: boolean;
  requiredItem?: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string;
  exits: Exit[];
  items: Item[];
  npcs?: NPC[];
  visited: boolean;
}

export interface NPC {
  id: string;
  name: string;
  description: string;
  dialogue?: string[];
}

export interface GameState {
  currentLocationId: string;
  inventory: Item[];
  visitedLocations: string[];
  gameLog: GameLogEntry[];
  flags: Record<string, boolean>;
  turn: number;
}

export interface GameLogEntry {
  type: 'command' | 'response' | 'system' | 'location' | 'item' | 'error';
  text: string;
  timestamp: number;
}

export interface Command {
  verb: string;
  noun?: string;
  preposition?: string;
  object?: string;
  fullText: string;
}

export type CommandType = 
  | 'look' | 'go' | 'take' | 'drop' | 'inventory' 
  | 'examine' | 'use' | 'talk' | 'help' | 'save' 
  | 'load' | 'clear' | 'unknown';
