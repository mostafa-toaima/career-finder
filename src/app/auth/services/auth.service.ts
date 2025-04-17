import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, authState, UserCredential } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { ApiCallsService } from '../../common/service/api-calls.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth, private apiService: ApiCallsService) {
    this.user$ = authState(this.auth); // Observe auth state changes
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // login(data: any): Observable<any> {
  //   const url = environment.BaseUrl + "auth/login";
  //   console.log('Making request to:', url);
  //   return this.apiService.postApiWithPackageName(data, "auth/login");
  // }


  // register(data: any): Observable<any> {
  //   const url = environment.BaseUrl + "/auth/register";
  //   console.log('Making request to:', url);
  //   return this.apiService.postApiWithPackageName(data, "/auth/register");
  // }

  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }
}
