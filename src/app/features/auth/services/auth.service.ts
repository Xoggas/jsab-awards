import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential
} from '@angular/fire/auth';
import {UserAuthDto} from '../models/user-auth.dto';
import {doc, Firestore, setDoc} from "@angular/fire/firestore";

type AuthResponse =
  | { isOk: boolean; user?: UserCredential }
  | { isOk: boolean; cancelled: false }

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  firestore = inject(Firestore);
  googleAuthProvider = new GoogleAuthProvider();
  xAuthProvider = new TwitterAuthProvider();
  facebookAuthProvider = new FacebookAuthProvider();

  async authorizeWithEmailAndPassword(dto: UserAuthDto): Promise<AuthResponse> {
    try {
      const response = await signInWithEmailAndPassword(this.auth, dto.email, dto.password);
      return {isOk: true, user: response};
    }
    catch (e: any) {
      if (e.code === 'auth/invalid-credential') {
        try {
          const response = await createUserWithEmailAndPassword(this.auth, dto.email, dto.password);
          const id = response.user.uid;
          await this.createUserInFirestore(id, dto.username);
          return {isOk: true, user: response};
        }
        catch (e: any) {
          return {isOk: false};
        }
      }

      return {isOk: false};
    }
  }

  async authorizeWithGoogle(): Promise<AuthResponse> {
    return await this.authorizeWith(this.googleAuthProvider);
  }

  private async authorizeWith(provider: any): Promise<AuthResponse> {
    try {
      const response = await signInWithPopup(this.auth, provider);
      const [id, username] = [response.user.uid, response.user.displayName ?? "Unknown name"];
      await this.createUserInFirestore(id, username);
      return {isOk: true, user: response};
    }
    catch (e: any) {
      return {isOk: false};
    }
  }

  private async createUserInFirestore(id: string, username: string): Promise<void> {
    const userRef = doc(this.firestore, 'users', id);
    await setDoc(userRef, {
      username: username,
      isAdmin: false
    });
  }
}
