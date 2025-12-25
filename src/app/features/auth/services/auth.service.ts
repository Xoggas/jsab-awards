import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential
} from '@angular/fire/auth';
import {UserAuthDto} from '../models/user-auth.dto';
import {UserService} from './user.service';

type AuthResponse =
  | { isOk: boolean; user?: UserCredential }
  | { isOk: boolean; cancelled: false }

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  googleAuthProvider = new GoogleAuthProvider();
  userService = inject(UserService);

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
          await this.userService.createUser(id, dto.username);
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
      await this.userService.createUser(id, username);
      return {isOk: true, user: response};
    }
    catch (e: any) {
      return {isOk: false};
    }
  }
}
