import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <section class="grid gap-4">
      <mat-card class="bg-slate-900/60 border border-slate-800">
        <mat-card-header>
          <mat-card-title>Welcome back</mat-card-title>
          <mat-card-subtitle>Sign in to manage your club or update your profile</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="space-y-4">
          <div *ngIf="errorMessage()" class="rounded border border-rose-700 bg-rose-900/40 p-3 text-sm text-rose-100">
            {{ errorMessage() }}
          </div>

          <form class="grid gap-4 md:grid-cols-2" [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" floatLabel="always" class="md:col-span-2">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required />
              <mat-icon matSuffix>mail</mat-icon>
              <mat-error *ngIf="form.controls.email.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="form.controls.email.hasError('email')">Enter a valid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" floatLabel="always" class="md:col-span-2">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required />
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="form.controls.password.hasError('required')">Password is required</mat-error>
            </mat-form-field>

            <div class="md:col-span-2 flex items-center gap-3">
              <button mat-flat-button color="primary" type="submit" [disabled]="submitting()">
                <mat-spinner *ngIf="submitting()" diameter="20" class="!w-5 !h-5"></mat-spinner>
                <span *ngIf="!submitting()">Sign in</span>
              </button>
              <p class="text-sm text-slate-300">Use the email and password from your registration.</p>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.authService
      .login({
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.authService.setSessionToken(response.accessToken);
          this.router.navigate(['/profile']);
        },
        error: () => this.errorMessage.set('Invalid email or password. Please try again.'),
      });
  }
}
