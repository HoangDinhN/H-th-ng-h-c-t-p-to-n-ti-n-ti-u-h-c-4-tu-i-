export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  stars: number;
};

export type View =
  | 'login'
  | 'dashboard'
  | 'learning-hub'
  | 'comparison-game'
  | 'number-learning'
  | 'writing-practice'
  | 'mario-game'
  | 'rewards'
  | 'reports'
  | 'profile';

export type AppContextType = {
  user: User | null;
  view: View;
  setView: (view: View) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addStars: (amount: number) => void;
};
