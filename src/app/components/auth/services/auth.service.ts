import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, authState, UserCredential, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, from, map, of, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;
  isAdmin$: Observable<boolean>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.user$ = authState(this.auth);
    this.isAdmin$ = this.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.checkAdminStatus(user.uid);
        }
        return of(false);
      })
    );
  }

  private checkAdminStatus(uid: string): Observable<boolean> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      switchMap(snapshot => {
        return of(snapshot.exists() && snapshot.data()?.['role'] === 'admin');
      })
    );
  }

  setAdminStatus(uid: string, isAdmin: boolean): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return from(setDoc(userDocRef, { role: isAdmin ? 'admin' : 'user' }, { merge: true }));
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

  // register(email: string, password: string): Observable<UserCredential> {
  //   return from(createUserWithEmailAndPassword(this.auth, email, password));
  // }
  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        const userDocRef = doc(this.firestore, `users/${userCredential.user.uid}`);
        return from(setDoc(userDocRef, {
          email: email,
          createdAt: new Date(),
          role: 'user'
        })).pipe(
          map(() => userCredential)
        );
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
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

  // promoteToAdmin(email: string) {
  //   this.authService.user$.pipe(
  //     take(1),
  //     switchMap(user => {
  //       if (user) {
  //         return this.authService.setAdminStatus(user.uid, true);
  //       }
  //       return of(null);
  //     })
  //   ).subscribe(() => {
  //     alert('Admin privileges granted');
  //   });
  // }

}
