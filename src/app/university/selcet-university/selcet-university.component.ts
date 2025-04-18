// career-path-selector.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faGraduationCap,
  faSchool,
  faCode,
  faChartLine,
  faMicrochip,
  faBolt,
  faDatabase,
  faLaptopCode,
  faArrowRight,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { ModelComponent } from "./model/model.component";
import { UniversityService } from '../university.service';

interface Faculty {
  id: string;
  name: string;
  icon: any;
}

interface Department {
  id: string;
  name: string;
  facultyId: string;
  icon: any;
}

interface CareerTrack {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  icon: any;
}

@Component({
  selector: 'career-path-selector',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ModelComponent,
    FontAwesomeModule
  ],
  templateUrl: './selcet-university.component.html',
  styleUrls: ['./selcet-university.component.css']
})
export class SelectUniversityComponent implements OnInit {
  icons = {
    graduation: faGraduationCap,
    school: faSchool,
    code: faCode,
    chart: faChartLine,
    chip: faMicrochip,
    bolt: faBolt,
    database: faDatabase,
    laptop: faLaptopCode,
    arrow: faArrowRight,
    info: faInfoCircle
  };

  // Data
  faculties: Faculty[] = [
    { id: 'bus', name: 'Business', icon: this.icons.chart },
    { id: 'eng', name: 'Engineering', icon: this.icons.chip },
    { id: 'sci', name: 'Science', icon: this.icons.graduation }
  ];

  allDepartments: Department[] = [
    { id: 'cs', name: 'Computer Science', facultyId: 'eng', icon: this.icons.code },
    { id: 'ee', name: 'Electrical Engineering', facultyId: 'eng', icon: this.icons.bolt },
    { id: 'bis', name: 'Business Information Systems', facultyId: 'bus', icon: this.icons.database },
    { id: 'phy', name: 'Physics', facultyId: 'sci', icon: this.icons.graduation },
    { id: 'chem', name: 'Chemistry', facultyId: 'sci', icon: this.icons.graduation }
  ];

  allTracks: CareerTrack[] = [
    { id: 'cs', name: 'Software Engineering', description: 'Design, develop, and maintain software systems', departmentId: 'cs', icon: this.icons.code },
    { id: 'ee', name: 'Data Science', description: 'Extract insights from complex datasets', departmentId: 'cs', icon: this.icons.database },
    { id: 'bis', name: 'Frontend Development', description: 'Build interactive user interfaces', departmentId: 'bis', icon: this.icons.laptop },
    { id: 'phy', name: 'Data Analysis', description: 'Analyze business data for decision making', departmentId: 'bis', icon: this.icons.chart },
    { id: 'chem', name: 'Circuit Design', description: 'Design electronic circuits and systems', departmentId: 'ee', icon: this.icons.chip }
  ];

  // Filtered
  departments: Department[] = [];
  tracks: CareerTrack[] = [];

  // State
  selectedFaculty: Faculty | null = null;
  selectedDepartment: Department | null = null;
  selectedTrack: CareerTrack | null = null;

  // UI State
  showModal = false;
  modalData: any = {};

  // Services
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private viewportScroller = inject(ViewportScroller);

  constructor(private universityService: UniversityService) { }

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.checkQueryParams();
  }

  private checkQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['faculty']) {
        this.selectedFaculty = this.faculties.find(f => f.id === params['faculty']) || null;
        this.onFacultyChange();
      }
    });
  }

  onFacultyChange(): void {
    this.departments = this.selectedFaculty
      ? this.allDepartments.filter(d => d.facultyId === this.selectedFaculty!.id)
      : [];
    this.selectedDepartment = null;
    this.tracks = [];
  }

  onDepartmentChange(): void {
    this.tracks = this.selectedDepartment
      ? this.allTracks.filter(t => t.departmentId === this.selectedDepartment?.id)
      : [];
    this.selectedTrack = null;
  }

  onTrackSelect(track: CareerTrack): void {
    this.selectedTrack = track;
  }

  exploreCareerPath(): void {
    if (!this.selectedTrack) return;

    this.router.navigate(['/career-path'], {
      queryParams: {
        track: this.selectedTrack.id,
        faculty: this.selectedFaculty?.id,
        department: this.selectedDepartment?.id
      },
      state: { trackData: this.selectedTrack }
    });
  }

  openHelperModal(): void {
    if (!this.selectedFaculty || !this.selectedDepartment) return;

    this.modalData = {
      faculty: this.selectedFaculty,
      department: this.selectedDepartment,
      tracks: this.tracks
    };

    this.showModal = true;
  }

  getProgressSteps(): { active: boolean }[] {
    return [
      { active: !!this.selectedFaculty },
      { active: !!this.selectedDepartment },
      { active: !!this.selectedTrack }
    ];
  }

  onSelectUniversity(university: any): void {
    this.universityService.setUniversity(university);
  }
}
