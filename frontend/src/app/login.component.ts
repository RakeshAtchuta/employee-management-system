import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { ApiService } from './api.service';

@Component({
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule
  ],

  template: `
    <div class="login">

      <div class="card login-box">

        <h1>Employee Management</h1>

        <p class="muted">
          Secure enterprise portal
        </p>

        <form
          [formGroup]="form"
          (ngSubmit)="login()">

          <!-- Username -->
          <div class="field">

            <label for="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              formControlName="username"
              autocomplete="username">

            <small
              class="error"
              *ngIf="
                form.controls.username.touched &&
                form.controls.username.hasError('required')
              ">
              Username is required.
            </small>

          </div>

          <br>

          <!-- Password -->
          <div class="field">

            <label for="password">
              Password
            </label>

            <div class="password-wrapper">

              <input
                id="password"
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                autocomplete="current-password">

              <button
                type="button"
                class="password-toggle"
                [attr.aria-label]="
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                "
                [title]="
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                "
                (click)="togglePassword()">

                <i
                  class="pi"
                  [ngClass]="
                    showPassword
                      ? 'pi-eye-slash'
                      : 'pi-eye'
                  ">
                </i>

              </button>

            </div>

            <small
              class="error"
              *ngIf="
                form.controls.password.touched &&
                form.controls.password.hasError('required')
              ">
              Password is required.
            </small>

          </div>

          <br>

          <!-- Login button -->
          <button
            pButton
            type="submit"
            label="Login"
            [disabled]="form.invalid">
          </button>

          <!-- Login error -->
          <p
            class="error"
            *ngIf="error">

            {{ error }}

          </p>

        </form>

      </div>

    </div>
  `,

  styles: [`

    .password-wrapper {
      position: relative;
      width: 100%;
    }

    .password-wrapper input {
      width: 100%;
      padding-right: 45px;
      box-sizing: border-box;
    }

    .password-toggle {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);

      border: none;
      background: transparent;

      width: 32px;
      height: 32px;

      display: flex;
      align-items: center;
      justify-content: center;

      cursor: pointer;

      color: #6b7280;
    }

    .password-toggle:hover {
      color: #2563eb;
    }

    .password-toggle:focus {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
      border-radius: 4px;
    }

    .error {
      color: #dc2626;
      font-size: 13px;
      margin-top: 5px;
      display: block;
    }

  `]
})
export class LoginComponent {

  // =========================================================
  // SERVICES
  // =========================================================

  fb = inject(FormBuilder);

  api = inject(ApiService);

  router = inject(Router);


  // =========================================================
  // LOGIN STATE
  // =========================================================

  error = '';

  showPassword = false;


  // =========================================================
  // LOGIN FORM
  // =========================================================

  form = this.fb.group({

    username: [
      '',
      Validators.required
    ],

    password: [
      '',
      Validators.required
    ]

  });


  // =========================================================
  // SHOW / HIDE PASSWORD
  // =========================================================

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }


  // =========================================================
  // LOGIN
  // =========================================================

  login(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.error = '';

    this.api
      .post<any>(
        '/auth/login/',
        this.form.value
      )
      .subscribe({

        next: (r) => {

          localStorage.setItem(
            'access',
            r.access
          );

          localStorage.setItem(
            'refresh',
            r.refresh
          );

          this.router.navigate([
            '/dashboard'
          ]);

        },

        error: (err) => {

          console.error(
            'Login failed:',
            err
          );

          this.error =
            'Invalid username or password';

        }

      });

  }

}