import {Component, inject, signal} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Button} from '../../../../shared/components/button/button';
import {Container} from '../../../../shared/components/container/container';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserAuthDto} from '../../models/user-auth.dto';
import {AuthService} from '../../services/auth.service';
import {delay} from '../../../../shared/helpers/delay.helper';

@Component({
  selector: 'app-auth.page',
  imports: [
    NgOptimizedImage,
    Button,
    Container,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.css',
})
export class AuthPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  triedToAuthorize = signal(false);
  waitingForResponse = signal(false);
  wasAuthorized = signal(false);

  authForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern(/^[A-Za-z0-9 ]+$/),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=[^!@#$%^&*]*[!@#$%^&*]).{8,}$/)
    ])
  });

  getErrorMessage(controlName: string): string | null {
    const control = this.authForm.get(controlName);

    if (!control || !control.errors) {
      return null;
    }

    if (!control.dirty && !control.touched) {
      return null;
    }

    switch (controlName) {
      case 'username':
        if (control.hasError('required')) {
          return 'Name is required';
        }

        if (control.hasError('maxlength')) {
          const max = control.errors?.['maxlength'].requiredLength;
          return `Name cannot exceed ${max} characters`;
        }

        if (control.hasError('pattern')) {
          return 'Name can only contain letters, numbers, and spaces';
        }

        break;

      case 'email':
        if (control.hasError('required')) {
          return 'Email is required';
        }

        if (control.hasError('email')) {
          return 'Enter a valid email address';
        }

        break;

      case 'password':
        if (control.hasError('required')) {
          return 'Password is required';
        }

        if (control.hasError('minlength')) {
          const min = control.errors?.['minlength'].requiredLength;
          return `Password must be at least ${min} characters`;
        }

        if (control.hasError('pattern')) {
          return 'Include one uppercase, lowercase, number and a special character';
        }

        break;

      default:
        return null;
    }

    return null;
  }

  async onSubmit(): Promise<void> {
    this.authForm.markAllAsTouched();

    if (!this.authForm.valid) {
      return;
    }

    this.triedToAuthorize.set(true);

    const userAuthDto: UserAuthDto = {
      username: this.authForm.value.username || "",
      email: this.authForm.value.email || "",
      password: this.authForm.value.password || "",
    };

    this.waitingForResponse.set(true);
    this.wasAuthorized = signal(false);

    const response = await this.authService.authorizeWithEmailAndPassword(userAuthDto);

    await delay(1000);

    if (response.isOk) {
      await this.router.navigate(['/voting']);
    }
    else {
      this.waitingForResponse.set(false);
      this.wasAuthorized = signal(false);
    }
  }

  async authorizeWithGoogle(): Promise<void> {
    const response = await this.authService.authorizeWithGoogle();

    if (response.isOk) {
      await this.router.navigate(['/voting']);
    }
  }
}
