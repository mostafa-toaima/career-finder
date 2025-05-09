import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, authState, UserCredential, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from '@angular/fire/auth';
import { doc, docData, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { UserProgress } from '../interfaces/UserProgress';


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

  getUserProfile(): User | null {
    return this.auth.currentUser;
  }


  getUserProfileFromFirestore(): Observable<any> {
    return this.user$.pipe(
      switchMap(user => {
        if (user) {
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          return from(getDoc(userDocRef)).pipe(
            map(snapshot => snapshot.exists() ? snapshot.data() : null)
          );
        }
        return of(null);
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
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((userCredential) => {
        console.log("userCredential", userCredential);

        const userDocRef = doc(this.firestore, `users/${userCredential.user.uid}`);
        return from(setDoc(userDocRef, {
          photo: userCredential.user.photoURL,
          email: userCredential.user.email,
          name: userCredential.user.displayName,
          createdAt: new Date(),
          role: 'user',
        })).pipe(
          switchMap(() => this.initializeUserProgress(userCredential.user.uid)),
          map(() => userCredential)
        );
      })
    );
  }

  register(data: any): Observable<UserCredential> {
    console.log("register", data);
    const { department, email, faculty, firstName, gender, lastName, university, password, mobile } = data;

    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        const userDocRef = doc(this.firestore, `users/${userCredential.user.uid}`);
        return from(setDoc(userDocRef, {
          email,
          password,
          department,
          university,
          faculty,
          name: firstName + " " + lastName,
          gender,
          mobile,
          createdAt: new Date(),
          role: 'user',
        })).pipe(
          switchMap(() => this.initializeUserProgress(userCredential.user.uid)),
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

  resetPassword(email: string): Observable<any> {
    return from(sendPasswordResetEmail(this.auth, email));
  }



  getUserProgress(userId: string): Observable<UserProgress> {
    const progressRef = doc(this.firestore, `userProgress/${userId}`);
    return docData(progressRef) as Observable<UserProgress>;
  }

  initializeUserProgress(userId: string): Promise<void> {
    const progressRef = doc(this.firestore, `userProgress/${userId}`);
    const initialProgress: UserProgress = {
      userId,
      completedTracks: [],
      inProgressTracks: [],
      trackProgress: {},
      roadmapProgress: {},
      skillProgress: {}, // Add this
      lastUpdated: new Date(),
      completedSteps: [],
      inProgressSteps: []
    };
    return setDoc(progressRef, initialProgress);
  }

  updateUserProgress(userId: string, progress: Partial<UserProgress>): Observable<any> {
    const progressRef = doc(this.firestore, `userProgress/${userId}`);
    return from(setDoc(progressRef, {
      ...progress,
      lastUpdated: new Date()
    }, { merge: true }));
  }

  updateSkillStatus(userId: string, skillId: string, status: 'start' | 'in-progress' | 'completed'): Observable<void> {
    const progressRef = doc(this.firestore, `userProgress/${userId}`);
    return from(setDoc(progressRef, {
      skillProgress: {
        [skillId]: status
      },
      lastUpdated: new Date()
    }, { merge: true }));
  }


  // services/auth.service.ts
  updateSkillProgress(
    userId: string,
    skillId: string,
    status: 'start' | 'in-progress' | 'completed'
  ): Observable<void> {
    const progressRef = doc(this.firestore, `userProgress/${userId}`);
    return from(setDoc(progressRef, {
      skillProgress: {
        [skillId]: status
      },
      lastUpdated: new Date()
    }, { merge: true }));
  }

  getSkillProgress(userId: string, skillId: string): Observable<string> {
    const progressRef = doc(this.firestore, `userProgress/${userId}`);
    return docData(progressRef).pipe(
      map(progress => progress?.['skillProgress']?.[skillId] || 'start')
    );
  }
}
