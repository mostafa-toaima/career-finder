import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UniversityService } from '../../../components/university/services/university.service';
import { TrackService } from '../../../components/carer-path/services/track.service';
import { CareerTrack, Department, Faculty, Track } from './interfaces/interface';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class AdminPanelComponent implements OnInit {
  private firestore = inject(Firestore);
  private universityService = inject(UniversityService);
  private trackService = inject(TrackService);

  activeTabIndex = 0;
  jsonInput = '';
  editMode = false;
  currentEditId = '';

  // Form data
  trackForm: Track = this.getDefaultTrack();
  departmentForm: Department = this.getDefaultDepartment();
  careerTrackForm: CareerTrack = this.getDefaultCareerTrack();
  facultyForm: Faculty = this.getDefaultFaculty();

  // Data lists
  faculties: Faculty[] = [];
  departments: Department[] = [];
  careerTracks: CareerTrack[] = [];
  tracks: Track[] = [];

  // Options for selects
  facultyOptions: { id: string, name: string }[] = [];
  departmentOptions: { id: string, label: string }[] = [];

  ngOnInit(): void {
    this.loadAllData();
  }

  async loadAllData() {
    this.loadFaculties();
    this.loadDepartments();
    this.loadCareerTracks();
    this.loadTracks();
  }

  async loadFaculties() {
    this.universityService.getFaculties().subscribe({
      next: (faculties) => {
        this.faculties = faculties;
        this.facultyOptions = faculties.map(f => ({ id: f.id || '', name: f.name }));
      },
      error: (error) => console.error('Error loading faculties:', error)
    });
  }

  async loadDepartments() {
    this.universityService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.departmentOptions = departments.map(d => ({
          id: d.id || '',
          label: d.name
        }));
      },
      error: (error) => console.error('Error loading departments:', error)
    });
  }

  async loadCareerTracks() {
    this.universityService.getTracks().subscribe({
      next: (tracks) => {
        this.careerTracks = tracks;
      },
      error: (error) => console.error('Error loading career tracks:', error)
    });
  }

  async loadTracks() {
    this.trackService.getAllTracks().subscribe({
      next: (tracks) => {
        this.tracks = tracks;
      },
      error: (error) => console.error('Error loading tracks:', error)
    });
  }

  // Track Form Methods
  addBenefit() {
    this.trackForm.benefits.push({ title: '', description: '', icon: '' });
  }

  removeBenefit(index: number) {
    this.trackForm.benefits.splice(index, 1);
  }

  addSection() {
    this.trackForm.content.sections.push({
      title: '',
      content: '',
      order: this.trackForm.content.sections.length + 1
    });
  }

  removeSection(index: number) {
    this.trackForm.content.sections.splice(index, 1);
  }

  addPathCard() {
    this.trackForm.pathCards.push({
      title: '',
      description: '',
      icon: '',
      enabled: true
    });
  }

  removePathCard(index: number) {
    this.trackForm.pathCards.splice(index, 1);
  }

  async saveTrack() {
    try {
      const tracksCollection = collection(this.firestore, 'tracksData');

      if (this.editMode && this.currentEditId) {
        const trackDoc = doc(this.firestore, 'tracksData', this.currentEditId);
        await updateDoc(trackDoc, { ...this.trackForm });
      } else {
        await addDoc(tracksCollection, this.trackForm);
      }

      alert('Track saved successfully');
      this.resetTrackForm();
      this.loadTracks();
    } catch (error) {
      console.error('Error saving track:', error);
      alert('Failed to save track');
    }
  }

  editTrack(track: Track) {
    this.editMode = true;
    this.currentEditId = track.id || '';
    this.trackForm = { ...track };
  }

  async deleteTrack(id: string) {
    if (confirm('Are you sure you want to delete this track?')) {
      try {
        const trackDoc = doc(this.firestore, 'tracksData', id);
        await deleteDoc(trackDoc);
        alert('Track deleted successfully');
        this.loadTracks();
      } catch (error) {
        console.error('Error deleting track:', error);
        alert('Failed to delete track');
      }
    }
  }

  // Department Form Methods
  async saveDepartment() {
    try {
      const departmentsCollection = collection(this.firestore, 'departments');

      if (this.editMode && this.currentEditId) {
        const deptDoc = doc(this.firestore, 'departments', this.currentEditId);
        await updateDoc(deptDoc, { ...this.departmentForm });
      } else {
        await addDoc(departmentsCollection, this.departmentForm);
      }

      alert('Department saved successfully');
      this.resetDepartmentForm();
      this.loadDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
      alert('Failed to save department');
    }
  }

  editDepartment(department: Department) {
    this.editMode = true;
    this.currentEditId = department.id || '';
    this.departmentForm = { ...department };
  }

  async deleteDepartment(id: string) {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        const deptDoc = doc(this.firestore, 'departments', id);
        await deleteDoc(deptDoc);
        alert('Department deleted successfully');
        this.loadDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
        alert('Failed to delete department');
      }
    }
  }

  // Career Track Form Methods
  async saveCareerTrack() {
    try {
      const careerTracksCollection = collection(this.firestore, 'careerTracks');

      if (this.editMode && this.currentEditId) {
        const trackDoc = doc(this.firestore, 'careerTracks', this.currentEditId);
        await updateDoc(trackDoc, { ...this.careerTrackForm });
      } else {
        await addDoc(careerTracksCollection, this.careerTrackForm);
      }

      alert('Career track saved successfully');
      this.resetCareerTrackForm();
      this.loadCareerTracks();
    } catch (error) {
      console.error('Error saving career track:', error);
      alert('Failed to save career track');
    }
  }

  editCareerTrack(track: CareerTrack) {
    this.editMode = true;
    this.currentEditId = track.id || '';
    this.careerTrackForm = { ...track };
  }

  async deleteCareerTrack(id: string) {
    if (confirm('Are you sure you want to delete this career track?')) {
      try {
        const trackDoc = doc(this.firestore, 'careerTracks', id);
        await deleteDoc(trackDoc);
        alert('Career track deleted successfully');
        this.loadCareerTracks();
      } catch (error) {
        console.error('Error deleting career track:', error);
        alert('Failed to delete career track');
      }
    }
  }

  // Faculty Form Methods
  async saveFaculty() {
    try {
      const facultiesCollection = collection(this.firestore, 'faculties');

      if (this.editMode && this.currentEditId) {
        const facultyDoc = doc(this.firestore, 'faculties', this.currentEditId);
        await updateDoc(facultyDoc, { ...this.facultyForm });
      } else {
        await addDoc(facultiesCollection, this.facultyForm);
      }

      alert('Faculty saved successfully');
      this.resetFacultyForm();
      this.loadFaculties();
    } catch (error) {
      console.error('Error saving faculty:', error);
      alert('Failed to save faculty');
    }
  }

  editFaculty(faculty: Faculty) {
    this.editMode = true;
    this.currentEditId = faculty.id || '';
    this.facultyForm = { ...faculty };
  }

  async deleteFaculty(id: string) {
    if (confirm('Are you sure you want to delete this faculty?')) {
      try {
        const facultyDoc = doc(this.firestore, 'faculties', id);
        await deleteDoc(facultyDoc);
        alert('Faculty deleted successfully');
        this.loadFaculties();
      } catch (error) {
        console.error('Error deleting faculty:', error);
        alert('Failed to delete faculty');
      }
    }
  }

  // JSON Upload
  async uploadJson() {
    try {
      const data = JSON.parse(this.jsonInput);
      let collectionName = '';

      if (data.title && data.content) {
        collectionName = 'tracksData';
      } else if (data.facultyId) {
        collectionName = 'departments';
      } else if (data.departmentIds) {
        collectionName = 'careerTracks';
      } else if (data.name && !data.facultyId && !data.departmentIds) {
        collectionName = 'faculties';
      } else {
        throw new Error('Cannot determine collection type from JSON data');
      }

      const collectionRef = collection(this.firestore, collectionName);
      await addDoc(collectionRef, data);

      alert('Data uploaded successfully');
      this.jsonInput = '';
      this.loadAllData();
    } catch (error) {
      console.error('Error uploading JSON:', error);
      alert('Invalid JSON or upload failed');
    }
  }

  // Reset Forms
  resetTrackForm() {
    this.trackForm = this.getDefaultTrack();
    this.editMode = false;
    this.currentEditId = '';
  }

  resetDepartmentForm() {
    this.departmentForm = this.getDefaultDepartment();
    this.editMode = false;
    this.currentEditId = '';
  }

  resetCareerTrackForm() {
    this.careerTrackForm = this.getDefaultCareerTrack();
    this.editMode = false;
    this.currentEditId = '';
  }

  resetFacultyForm() {
    this.facultyForm = this.getDefaultFaculty();
    this.editMode = false;
    this.currentEditId = '';
  }

  // Default Form Values
  getDefaultTrack(): Track {
    return {
      title: '',
      description: '',
      benefits: [],
      content: { sections: [] },
      pathCards: []
    };
  }

  getDefaultDepartment(): Department {
    return {
      facultyId: '',
      name: ''
    };
  }

  getDefaultCareerTrack(): CareerTrack {
    return {
      departmentIds: [],
      description: '',
      icon: '',
      name: ''
    };
  }

  getDefaultFaculty(): Faculty {
    return {
      name: ''
    };
  }

  // Tab change handler
  onTabChange(index: number) {
    this.activeTabIndex = index;
    this.editMode = false;
    this.currentEditId = '';

    // Reset forms when changing tabs
    this.resetTrackForm();
    this.resetDepartmentForm();
    this.resetCareerTrackForm();
    this.resetFacultyForm();
  }

  getFacultyName(facultyId: string): string {
    const faculty = this.faculties.find(f => f.id === facultyId);
    return faculty ? faculty.name : 'Unknown Faculty';
  }

  toggleDepartment(departmentId: string) {
    const index = this.careerTrackForm.departmentIds.indexOf(departmentId);
    if (index === -1) {
      this.careerTrackForm.departmentIds.push(departmentId);
    } else {
      this.careerTrackForm.departmentIds.splice(index, 1);
    }
  }
}
