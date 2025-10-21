import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  User as FirebaseUser,      // 👈 Firebase User
  UserCredential
} from 'firebase/auth';
import { app } from '../firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = getAuth(app);

  async loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
    const credential: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  async signup(email: string, password: string): Promise<FirebaseUser> {
    const credential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    return result.user; // return Firebase User
  }

  async logout(): Promise<void> {
    return signOut(this.auth);
  }
}
