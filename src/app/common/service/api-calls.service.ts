import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  constructor(private http: HttpClient) { }

  postApiWithPackageName(data: any, packageName: string): Observable<any> {
    return this.http.post(environment.BaseUrl + packageName, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  
}
