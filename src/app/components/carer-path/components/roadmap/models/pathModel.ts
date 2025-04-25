export interface Skill {
  id: string;
  name?: string;
  description?: string;
  level?: number;
}

export interface Resource {
  url: string;
  name: string;
  icon: string;
}

export interface Step {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  level?: string;
  color?: string;
  icon?: string;
  skills?: Skill[];
  resources?: Resource[];
}

export interface Stage {
  id: string;
  name: string;
  steps: Step[];
}

export type SkillStatus = 'start' | 'in-progress' | 'complete';
