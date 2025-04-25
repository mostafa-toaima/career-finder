import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faGraduationCap,
  faSchool,
  faCode,
  faArrowRight,
  faInfoCircle,
  faLightbulb,
  faRoute,
  faSearch,
  faBullhorn,
  faChartLine,
  faChartPie,
  faDatabase,
  faGlobe,
  faMicrochip,
  faMoneyBillWave,
  faRocket,
  faTasks,
  faUserCheck,
  faCloud,
  faBalanceScale,
  faComments,
  faLanguage,
  faMobileAlt,
  faPaintBrush,
  faRobot,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { AiModelComponent } from '../ai-component/ai-model.component';
import { UniversityService } from '../../services/university.service';
import { Faculty } from '../../interfaces/Faculty';
import { Department } from '../../interfaces/Department';
import { CareerTrack } from '../../interfaces/CareerTrack';
import { animate, style, transition, trigger } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, fadeInUp, pulse, scaleIn, slideInDown, slideInUp } from '../../interfaces/animations';

@Component({
  selector: 'app-career-path-selector',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    AiModelComponent
  ],
  templateUrl: './career-path-selector.component.html',
  styleUrls: ['./career-path-selector.component.scss'],
  animations: [fadeIn,
    slideInDown,
    slideInUp,
    fadeInUp,
    scaleIn,
    pulse,
    bounceIn,
    fadeInRight]
})
export class CareerPathSelectorComponent implements OnInit {
  // Icons
  icons = {
    graduation: faGraduationCap,
    school: faSchool,
    code: faCode,
    arrow: faArrowRight,
    info: faInfoCircle,
    lightbulb: faLightbulb,
    route: faRoute,
    search: faSearch,
    chart: faChartLine,
    project: faTasks,
    marketing: faBullhorn,
    finance: faMoneyBillWave,
    startup: faRocket,
    database: faDatabase,
    analytics: faChartPie,
    technology: faMicrochip,
    web: faGlobe,
    userCheck: faUserCheck,
    ai: faRobot,
    mobile: faMobileAlt,
    cloud: faCloud,
    security: faShieldAlt,
    design: faPaintBrush,
    language: faLanguage,
    legal: faBalanceScale,
    communication: faComments
  };

  // Data collections
  faculties: Faculty[] = [];
  allDepartments: Department[] = [];
  allTracks: CareerTrack[] = [];

  // Filtered collections
  departments: Department[] = [];
  tracks: CareerTrack[] = [];

  // Selected items
  selectedFaculty: Faculty | null = null;
  selectedDepartment: Department | null = null;
  selectedTrack: CareerTrack | null = null;

  // Modal control
  showModal = false;
  modalData: any = {};

  // Services
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private viewportScroller = inject(ViewportScroller);
  private universityService = inject(UniversityService);

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.checkQueryParams();
    this.loadInitialData();
  }

  /**
   * Load all initial data needed for the component
   */
  private loadInitialData(): void {
    this.universityService.getFaculties().subscribe({
      next: (faculties) => {
        this.faculties = faculties;
        this.checkQueryParams(); // Check params after data loads
      },
      error: (error) => console.error('Error loading faculties:', error)
    });

    this.universityService.getDepartments().subscribe({
      next: (departments) => this.allDepartments = departments,
      error: (error) => console.error('Error loading departments:', error)
    });

    this.universityService.getTracks().subscribe({
      next: (tracks) => this.allTracks = tracks,
      error: (error) => console.error('Error loading tracks:', error)
    });
  }

  /**
   * Check for query parameters to pre-select values
   */
  private checkQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['faculty'] && this.faculties.length) {
        const faculty = this.faculties.find(f => f.id === params['faculty']);
        if (faculty) {
          this.selectedFaculty = faculty;
          this.onFacultyChange();

          if (params['department']) {
            const department = this.departments.find(d => d.id === params['department']);
            if (department) {
              this.selectedDepartment = department;
              this.onDepartmentChange();

              if (params['track']) {
                const track = this.tracks.find(t => t.id === params['track']);
                if (track) {
                  this.selectedTrack = track;
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * Handle faculty selection change
   */
  onFacultyChange(): void {
    this.departments = this.selectedFaculty
      ? this.allDepartments.filter(d => d.facultyId === this.selectedFaculty!.id)
      : [];
    this.selectedDepartment = null;
    this.tracks = [];
    this.selectedTrack = null;
  }

  /**
   * Handle department selection change
   */
  onDepartmentChange(): void {
    this.tracks = this.selectedDepartment
      ? this.allTracks.filter(t => t.departmentIds?.includes(this.selectedDepartment!.id))
      : [];
    this.selectedTrack = null;
  }

  /**
   * Handle track selection
   */
  onTrackSelect(track: CareerTrack): void {
    this.selectedTrack = track;
  }

  /**
   * Navigate to career path exploration
   */

  exploreCareerPath(): void {
    if (!this.selectedTrack) return;
    console.log(this.selectedTrack.id);


    // Updated to use the new route structure with track ID in the path
    this.router.navigate(['/career-path', this.selectedTrack.id], {
      queryParams: {
        faculty: this.selectedFaculty?.id,
        department: this.selectedDepartment?.id
      }
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

  /**
   * Get progress steps for the progress indicator
   */
  getProgressSteps(): { active: boolean }[] {
    return [
      { active: !!this.selectedFaculty },
      { active: !!this.selectedDepartment },
      { active: !!this.selectedTrack }
    ];
  }

  /**
   * Reset all selections
   */
  resetSelections(): void {
    this.selectedFaculty = null;
    this.selectedDepartment = null;
    this.selectedTrack = null;
    this.departments = [];
    this.tracks = [];
  }
}
