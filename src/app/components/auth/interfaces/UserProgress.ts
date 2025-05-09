export interface UserProgress {
  userId: string;
  completedTracks: string[];
  inProgressTracks: string[];
  completedSteps: string[];
  inProgressSteps: string[];
  trackProgress: {
    [trackId: string]: {
      completed: number;
      total: number;
    }
  };
  roadmapProgress: {
    [roadmapId: string]: {
      completedSteps: string[];
      inProgressSteps: string[];
    }
  };
  skillProgress: {
    [skillId: string]: 'start' | 'in-progress' | 'completed';
  };
  lastUpdated: Date;
}
