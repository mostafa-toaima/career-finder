import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { CareerAdvisorService } from '../../../../common/service/gemini.service';
import { SafeHtmlPipe } from '../../../../common/pipes/safe-html.pipe';

@Component({
  selector: 'ai-model',
  standalone: true,
  imports: [CommonModule, DialogModule, ReactiveFormsModule, ProgressSpinnerModule, ToastModule, SafeHtmlPipe],
  templateUrl: './ai-model.component.html',
  styleUrls: ['./ai-model.component.css'],
  providers: [MessageService]
})
export class AiModelComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() data: any;
  @Output() visibleChange = new EventEmitter<boolean>();

  aiForm!: FormGroup;
  // geminiService = inject(GeminiService);
  careerAdvisorService = inject(CareerAdvisorService);

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

    // this.geminiService.sendFormDataToGemini(formData)
    this.careerAdvisorService.sendFormData(formData)
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
    // If response is already an object (like from error case), return it
    if (typeof response === 'object' && response !== null) {
      return response;
    }

    // If it's a string, try to parse it
    if (typeof response === 'string') {
      try {
        // First try to parse as pure JSON
        const jsonResponse = JSON.parse(response);
        if (jsonResponse && typeof jsonResponse === 'object') {
          return jsonResponse;
        }
      } catch (e) {
        console.log('Response is not pure JSON, trying alternative parsing');
      }

      // Alternative parsing for non-JSON responses
      try {
        // Try to extract JSON from markdown or other formatted responses
        const jsonStart = response.indexOf('{');
        const jsonEnd = response.lastIndexOf('}');
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          const jsonString = response.substring(jsonStart, jsonEnd + 1);
          return JSON.parse(jsonString);
        }

        // If no JSON found, try to structure the response manually
        return this.structureTextResponse(response);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        return {
          'Recommended Career Path': 'Error parsing response',
          'Career Description': 'We encountered an issue processing your career analysis.',
          'Why This Path Fits You': 'Please try again later.',
          'Your Action Plan': 'Contact support if the problem persists.',
          'Pro Tips for Success': ''
        };
      }
    }

    return {
      'Recommended Career Path': 'Invalid response format',
      'Career Description': 'The system returned an unexpected response format.',
      'Why This Path Fits You': 'Please try again later.',
      'Your Action Plan': 'Contact support if the problem persists.',
      'Pro Tips for Success': ''
    };
  }

  private structureTextResponse(text: string): any {
    const result: any = {};
    const sections = text.split('\n\n');

    sections.forEach(section => {
      const lines = section.split('\n');
      if (lines.length > 0) {
        const key = lines[0].replace(':', '').trim();
        const value = lines.slice(1).join('\n').trim();
        if (key && value) {
          result[key] = value;
        }
      }
    });

    return result;
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

  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
