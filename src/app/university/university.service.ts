import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private faculties = [
    { id: 1, name: 'Engineering', sections: ['Civil', 'Mechanical', 'Electrical'] },
    { id: 2, name: 'Medicine', sections: ['General Medicine', 'Dentistry', 'Pharmacy'] },
    { id: 3, name: 'Business', sections: ['Finance', 'Marketing', 'HR'] }
  ];

  private careerPaths = {
    'Engineering': {
      'Civil': ['Structural Engineer', 'Transportation Engineer', 'Geotechnical Engineer'],
      'Mechanical': ['Automotive Engineer', 'Aerospace Engineer', 'HVAC Engineer'],
      'Electrical': ['Power Engineer', 'Electronics Engineer', 'Telecommunications Engineer']
    },
    'Medicine': {
      'GeneralMedicine': ['Surgeon', 'Physician', 'Pediatrician'],
      'Dentistry': ['Orthodontist', 'Oral Surgeon', 'Pediatric Dentist'],
      'Pharmacy': ['Clinical Pharmacist', 'Pharmaceutical Researcher', 'Hospital Pharmacist']
    },
    'Business': {
      'Finance': ['Financial Analyst', 'Investment Banker', 'Risk Manager'],
      'Marketing': ['Digital Marketer', 'Brand Manager', 'Market Research Analyst'],
      'HR': ['Recruitment Specialist', 'HR Manager', 'Training Coordinator']
    }
  };

  constructor() { }

  getFaculties() {
    return this.faculties;
  }



  getSections(facultyName: string) {
    const faculty = this.faculties.find(f => f.name === facultyName);
    return faculty ? faculty.sections : [];
  }

  // getCareerPaths(facultyName: any, sectionName: any) {
  //   return this.careerPaths[facultyName as keyof typeof this.careerPaths]?.[sectionName] || [];
  // }
}
