export interface Track {
  id?: string;
  trackId?: string;
  title: string;
  description: string;
  heroImage?: string;
  benefits: Benefit[];
  content: { sections: Section[] };
  pathCards: PathCard[];
}


export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

export interface Section {
  title: string;
  content: string;
  order?: number;
}

export interface PathCard {
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  link?: string;
  buttonText?: string;
  highlighted?: boolean;
}

export interface Department {
  id?: string;
  facultyId: string;
  name: string;
  icon?: string;
}

export interface CareerTrack {
  id?: string;
  departmentIds: string[];
  description: string;
  icon: string;
  name: string;
}

export interface Faculty {
  id?: string;
  name: string;
  icon?: string;
}
