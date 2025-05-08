export interface TrackSection {
  title?: string;
  content: string;
}

export interface TrackBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface TrackProgress {
  current: number;
  total: number;
  percentage?: number;
}

export interface TrackPathCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  enabled: boolean;
  link?: string;
  buttonText?: string;
  highlighted?: boolean;
  progress?: TrackProgress;
}

export interface Track {
  id?: string;
  title: string;
  description: string;
  trackId?: string;
  benefits: TrackBenefit[];
  content: {
    sections: TrackSection[];
  };
  pathCards: TrackPathCard[];
  progress?: TrackProgress;
}
