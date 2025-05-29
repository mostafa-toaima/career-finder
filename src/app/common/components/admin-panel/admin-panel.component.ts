import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, setDoc, getDoc } from '@angular/fire/firestore';
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
    console.log("this.trackForm", this.trackForm);

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
      if (!this.careerTrackForm.id) {
        alert('Track ID is required');
        return;
      }
      const careerTrackDocRef = doc(this.firestore, 'careerTracks', this.careerTrackForm.id);
      if (this.editMode && this.currentEditId) {
        if (this.currentEditId !== this.careerTrackForm.id) {
          const oldDocRef = doc(this.firestore, 'careerTracks', this.currentEditId);
          await deleteDoc(oldDocRef);
        }
        await setDoc(careerTrackDocRef, this.careerTrackForm, { merge: true });
      } else {
        await setDoc(careerTrackDocRef, this.careerTrackForm);
      }
      alert('Career track saved successfully');
      this.resetCareerTrackForm();
      this.loadCareerTracks();
    } catch (error) {
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

  async uploadJson() {
    try {
      const input = JSON.parse(this.jsonInput);

      // Case 1: Add complete roadmap
      if (input.id && input.title && input.stages) {
        const roadmapData = {
          id: input.id,
          title: input.title,
          stages: input.stages.map((stage: { steps: any[]; }) => ({
            ...stage,
            steps: stage.steps.map(step => ({
              ...step,
              id: step.id || Date.now().toString(),
              skills: step.skills?.map((skill: { id: any; }) => ({
                ...skill,
                id: skill.id || Date.now().toString()
              })) || [],
              createdAt: new Date().toISOString()
            }))
          }))
        };

        const docRef = doc(this.firestore, 'roadmaps', input.id);
        await setDoc(docRef, roadmapData);
        alert('Roadmap created successfully');
        return;
      }

      // Case 2: Add stage to existing roadmap
      if (input.docId && input.name && input.steps) {
        const docRef = doc(this.firestore, 'roadmaps', input.docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error('Roadmap not found');
        }

        const existingData = docSnap.data();
        const newStage = {
          id: input.id || Date.now().toString(),
          name: input.name,
          icon: input.icon || '',
          steps: input.steps.map((step: { id: any; skills: any[]; }) => ({
            ...step,
            id: step.id || Date.now().toString(),
            skills: step.skills?.map((skill: { id: any; }) => ({
              ...skill,
              id: skill.id || Date.now().toString()
            })) || [],
            createdAt: new Date().toISOString()
          }))
        };

        const updatedData = {
          stages: [...(existingData['stages'] || []), newStage]
        };

        await setDoc(docRef, updatedData, { merge: true });
        alert('Stage added successfully');
        return;
      }

      // Case 3: Add step to existing stage
      if (input.docId && input.stageId && input.stepData) {
        const docRef = doc(this.firestore, 'roadmaps', input.docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error('Roadmap not found');
        }

        const existingData = docSnap.data();
        const stageIndex = existingData['stages'].findIndex((s: { id: any; }) => s.id === input.stageId);

        if (stageIndex === -1) {
          throw new Error('Stage not found');
        }

        const updatedStages = [...existingData['stages']];
        updatedStages[stageIndex] = {
          ...updatedStages[stageIndex],
          steps: [
            ...(updatedStages[stageIndex].steps || []),
            {
              ...input.stepData,
              id: input.stepData.id || Date.now().toString(),
              skills: input.stepData.skills?.map((skill: { id: any; }) => ({
                ...skill,
                id: skill.id || Date.now().toString()
              })) || [],
              createdAt: new Date().toISOString()
            }
          ]
        };

        await setDoc(docRef, { stages: updatedStages }, { merge: true });
        alert('Step added successfully');
        return;
      }

      // Case 4: Add skill to existing step
      if (input.docId && input.stageId && input.stepId && input.skillData) {
        const docRef = doc(this.firestore, 'roadmaps', input.docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error('Roadmap not found');
        }

        const existingData = docSnap.data();
        const stageIndex = existingData['stages'].findIndex((s: { id: any; }) => s.id === input.stageId);

        if (stageIndex === -1) {
          throw new Error('Stage not found');
        }

        const stepIndex = existingData['stages'][stageIndex].steps.findIndex(
          (          step: { id: any; }) => step.id === input.stepId
        );

        if (stepIndex === -1) {
          throw new Error('Step not found');
        }

        const updatedStages = [...existingData['stages']];
        updatedStages[stageIndex] = {
          ...updatedStages[stageIndex],
          steps: [
            ...updatedStages[stageIndex].steps.slice(0, stepIndex),
            {
              ...updatedStages[stageIndex].steps[stepIndex],
              skills: [
                ...(updatedStages[stageIndex].steps[stepIndex].skills || []),
                {
                  ...input.skillData,
                  id: input.skillData.id || Date.now().toString(),
                  createdAt: new Date().toISOString()
                }
              ]
            },
            ...updatedStages[stageIndex].steps.slice(stepIndex + 1)
          ]
        };

        await setDoc(docRef, { stages: updatedStages }, { merge: true });
        alert('Skill added successfully');
        return;
      }

      throw new Error('Invalid JSON structure');

    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error}`);
    } finally {
      this.jsonInput = '';
      this.loadAllData();
    }
  }
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
      name: '',
      id: ''
    };
  }

  getDefaultFaculty(): Faculty {
    return {
      name: ''
    };
  }

  onTabChange(index: number) {
    this.activeTabIndex = index;
    this.editMode = false;
    this.currentEditId = '';
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
  getCareerTrackName(trackId: string): string {
    const track = this.careerTracks.find(t => t.id === trackId);
    return track ? track.name : 'Not associated';
  }
}
