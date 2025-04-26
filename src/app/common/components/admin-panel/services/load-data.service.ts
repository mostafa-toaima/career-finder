import { Injectable } from '@angular/core';
import { UniversityService } from '../../../../components/university/services/university.service';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {

  constructor(private universityService: UniversityService) { }

  // getDepartments() {
  //   this.universityService.getDepartments().subscribe({
  //     r
  //   })
  // }
  getFaculties() {

  }
}
