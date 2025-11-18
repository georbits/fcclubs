import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { AuthService, RegistrationRequest } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <section class="grid gap-4">
      <mat-card class="bg-slate-900/60 border border-slate-800">
        <mat-card-header>
          <mat-card-title>Create your tournament account</mat-card-title>
          <mat-card-subtitle>Join the competition with your platform handle</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="space-y-4">
          <div *ngIf="successMessage()" class="rounded border border-emerald-700 bg-emerald-900/40 p-3 text-sm text-emerald-100">
            {{ successMessage() }}
          </div>

          <div *ngIf="errorMessage()" class="rounded border border-rose-700 bg-rose-900/40 p-3 text-sm text-rose-100">
            {{ errorMessage() }}
          </div>

          <form class="grid gap-4 md:grid-cols-2" [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" floatLabel="always">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required />
              <mat-icon matSuffix>mail</mat-icon>
              <mat-error *ngIf="form.controls.email.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="form.controls.email.hasError('email')">Enter a valid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" floatLabel="always">
              <mat-label>Display name</mat-label>
              <input matInput formControlName="displayName" required />
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="form.controls.displayName.hasError('required')">Display name is required</mat-error>
              <mat-error *ngIf="form.controls.displayName.hasError('minlength')">Minimum 3 characters</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" floatLabel="always">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required />
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="form.controls.password.hasError('required')">Password is required</mat-error>
              <mat-error *ngIf="form.controls.password.hasError('minlength')">At least 8 characters</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" floatLabel="always">
              <mat-label>Confirm password</mat-label>
              <input matInput type="password" formControlName="confirmPassword" required />
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="form.controls.confirmPassword.hasError('required')">Confirmation is required</mat-error>
              <mat-error *ngIf="form.hasError('passwordMismatch')">Passwords must match</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" floatLabel="always">
              <mat-label>Platform</mat-label>
              <mat-select formControlName="platform" required>
                <mat-option *ngFor="let platform of platforms" [value]="platform.value">{{ platform.label }}</mat-option>
              </mat-select>
              <mat-error *ngIf="form.controls.platform.hasError('required')">Choose your platform</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" floatLabel="always">
              <mat-label>Platform handle</mat-label>
              <input matInput formControlName="platformHandle" required />
              <mat-icon matSuffix>sports_esports</mat-icon>
              <mat-error *ngIf="form.controls.platformHandle.hasError('required')">Platform handle is required</mat-error>
              <mat-error *ngIf="form.controls.platformHandle.hasError('minlength')">Minimum 3 characters</mat-error>
            </mat-form-field>

            <div class="md:col-span-2 flex items-center gap-3">
              <button mat-flat-button color="primary" type="submit" [disabled]="submitting()">
                <mat-spinner *ngIf="submitting()" diameter="20" class="!w-5 !h-5"></mat-spinner>
                <span *ngIf="!submitting()">Create account</span>
              </button>
              <p class="text-sm text-slate-300">We will send a confirmation email once registration is complete.</p>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly platforms = [
    { value: 'EA' as const, label: 'EA App' },
    { value: 'PS5' as const, label: 'PlayStation 5' },
    { value: 'XBOX' as const, label: 'Xbox' },
  ];

  submitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  form = this.fb.group(
    {
      email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      displayName: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      password: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
      confirmPassword: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      platform: this.fb.control<RegistrationRequest['platform'] | ''>('', { validators: [Validators.required] }),
      platformHandle: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
    },
    { validators: this.passwordsMatchValidator() }
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const payload: RegistrationRequest = {
      email: this.form.controls.email.value,
      displayName: this.form.controls.displayName.value,
      password: this.form.controls.password.value,
      platform: this.form.controls.platform.value as RegistrationRequest['platform'],
      platformHandle: this.form.controls.platformHandle.value,
    };

    this.authService
      .register(payload)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.successMessage.set(`Welcome ${response.displayName}! Check your email to verify your account.`);
          this.form.reset();
        },
        error: () => this.errorMessage.set('Registration failed. Please try again or contact support.'),
      });
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;

      return password && confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
    };
  }
}
