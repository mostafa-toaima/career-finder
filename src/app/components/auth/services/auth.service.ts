import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, authState, UserCredential, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth);
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  loginWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }

  loginWithFacebook(): Observable<any> {
    const provider = new FacebookAuthProvider();
    return from(signInWithPopup(this.auth, provider));
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
