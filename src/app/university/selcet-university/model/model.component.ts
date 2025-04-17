import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { GeminiService } from '../../../common/service/gemini.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'custom-model',
  standalone: true,
  imports: [CommonModule, DialogModule, ReactiveFormsModule, ProgressSpinnerModule, ToastModule],
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
  providers: [MessageService]
})
export class ModelComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() data: any;
  @Output() visibleChange = new EventEmitter<boolean>();

  aiForm!: FormGroup;
  geminiService = inject(GeminiService);
  messageService = inject(MessageService);
  loadingProgress = 0;
  private loadingInterval: any;

  // UI state variables
  isSubmitting = false;
  showResults = false;
  aiResponse: any = null;
  progress = 0;
  responseSections: string[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.data) {
      this.initForm();
    }
    this.aiForm?.valueChanges.subscribe(() => {
      this.calculateProgress();
    });
  }

  initForm() {
    this.aiForm = this.fb.group({
      faculty: [{ value: this.data?.selectedFaculty || '', disabled: true }],
      department: [{ value: this.data?.selectedDepartment || '', disabled: true }],
      favoriteSubjects: ['', [Validators.required, Validators.minLength(10)]],
      workPreference: ['N/A', Validators.required],
      strengths: ['', [Validators.required, Validators.minLength(10)]],
      environment: ['N/A', Validators.required],
      problemSolving: ['', Validators.required],
      studyWillingness: ['', Validators.required],
      researchInterest: [5, [Validators.min(0), Validators.max(10)]],
      taskStyle: ['', Validators.required],
      entrepreneurship: ['', Validators.required],
      goal: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetFormState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.data = changes['data'].currentValue;
      this.initForm();
    }
  }

  onSubmit() {
    if (this.aiForm.invalid) {
      this.markFormGroupTouched(this.aiForm);
      return;
    }

    this.isSubmitting = true;
    this.loadingProgress = 10;
    this.loadingInterval = setInterval(() => {
      this.loadingProgress += 10;
      if (this.loadingProgress >= 90) {
        clearInterval(this.loadingInterval);
      }
    }, 500);
    const formData = {
      ...this.aiForm.value,
      faculty: this.data?.selectedFaculty,
      department: this.data?.selectedDepartment,
    };

    this.geminiService.sendFormDataToGemini(formData)
      .then((response) => {
        this.aiResponse = this.parseAiResponse(response);
        this.showResults = true;
        console.log('AI Response:', this.aiResponse);
        this.responseSections = Object.keys(this.aiResponse).map(key => key.replace(/:/g, ''));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'AI response received successfully!' });

      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        this.isSubmitting = false;
        clearInterval(this.loadingInterval);
        this.loadingProgress = 100;
        setTimeout(() => this.loadingProgress = 0, 500);
      });
  }

  private parseAiResponse(response: any): any {
    // If the response is already an object, return it directly
    if (typeof response === 'object' && response !== null) {
      return response;
    }

    // If it's a string, try to parse it
    if (typeof response === 'string') {
      try {
        return JSON.parse(response);
      } catch (e) {
        // If not JSON, try to extract key-value pairs
        const result: any = {};
        const lines = response.split('\n');

        let currentKey = '';
        let currentValue = '';

        lines.forEach(line => {
          if (line.endsWith(':')) {
            if (currentKey) {
              result[currentKey] = currentValue.trim();
            }
            currentKey = line;
            currentValue = '';
          } else {
            currentValue += line + '\n';
          }
        });

        if (currentKey) {
          result[currentKey] = currentValue.trim();
        }

        return result;
      }
    }

    return {};
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private resetFormState() {
    this.showResults = false;
    this.aiResponse = null;
    this.isSubmitting = false;
    if (this.aiForm) {
      this.aiForm.reset({
        faculty: this.data?.selectedFaculty || '',
        department: this.data?.selectedDepartment || '',
        workPreference: 'N/A',
        environment: 'N/A',
        researchInterest: 5
      });
    }
  }

  calculateProgress(): number {
    if (!this.aiForm) return 0;

    const totalControls = Object.keys(this.aiForm.controls).length;
    const filledControls = Object.values(this.aiForm.controls).filter(
      control => control.value !== null && control.value !== '' && control.value !== 'N/A'
    ).length;

    this.progress = Math.round((filledControls / totalControls) * 100);
    return this.progress;
  }

  getFormControl(name: string) {
    return this.aiForm.get(name);
  }

  isFieldInvalid(name: string) {
    const control = this.getFormControl(name);
    return control?.invalid && (control?.dirty || control?.touched);
  }
}
