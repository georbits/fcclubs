import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { PLATFORM_OPTIONS, Platform } from '../../../core/models/platform';
import { ProfileResponse, ProfileService, UpdateProfileRequest } from './profile.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  template: `
    <mat-card class="bg-slate-900/60 border border-slate-800">
      <mat-card-header>
        <mat-card-title>Profile & security</mat-card-title>
        <mat-card-subtitle>Update contact info and platform handles</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="space-y-4">
        <div
          *ngIf="displayProfile()"
          class="flex flex-col gap-3 rounded border border-slate-800 bg-slate-900/80 p-3 md:flex-row md:items-center"
        >
          <div class="flex items-center gap-3">
            <img
              *ngIf="displayProfile()?.profileImageUrl; else avatarFallback"
              [src]="displayProfile()?.profileImageUrl"
              [alt]="displayProfile()?.displayName"
              class="h-16 w-16 rounded-full border border-slate-700 object-cover shadow"
            />
            <ng-template #avatarFallback>
              <div
                class="flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-200"
              >
                <mat-icon>person</mat-icon>
              </div>
            </ng-template>
            <div>
              <div class="text-lg font-semibold text-slate-50">{{ displayProfile()?.displayName }}</div>
              <div class="text-sm text-slate-400">{{ displayProfile()?.email }}</div>
              <div class="text-xs text-slate-400">Updated {{ displayProfile()?.updatedAt | date: 'short' }}</div>
            </div>
          </div>
          <div class="md:ml-auto flex items-center gap-3">
            <div class="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-100">
              {{ displayProfile()?.platform }}
            </div>
            <span class="text-slate-300 text-sm">{{ displayProfile()?.platformHandle }}</span>
            <div
              *ngIf="optimisticUpdate()"
              class="flex items-center gap-2 rounded-full border border-amber-700 bg-amber-900/40 px-3 py-1 text-xs text-amber-50"
            >
              <mat-spinner diameter="16"></mat-spinner>
              <span>Saving…</span>
            </div>
          </div>
        </div>

        <div
          *ngIf="successMessage()"
          class="rounded border border-emerald-700 bg-emerald-900/40 p-3 text-sm text-emerald-100"
        >
          {{ successMessage() }}
        </div>

        <div *ngIf="errorMessage()" class="rounded border border-rose-700 bg-rose-900/40 p-3 text-sm text-rose-100">
          {{ errorMessage() }}
        </div>

        <div *ngIf="loading()" class="flex items-center gap-3 text-slate-300">
          <mat-spinner diameter="28"></mat-spinner>
          <span>Loading your profile...</span>
        </div>

        <form
          *ngIf="!loading()"
          class="grid gap-4 md:grid-cols-2"
          [formGroup]="form"
          (ngSubmit)="saveProfile()"
          [class.opacity-60]="saving()"
        >
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

          <mat-form-field appearance="outline" floatLabel="always">
            <mat-label>Avatar URL</mat-label>
            <input matInput type="url" formControlName="profileImageUrl" />
            <mat-icon matSuffix>image</mat-icon>
            <mat-hint>Optional link to your profile image</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline" floatLabel="always">
            <mat-label>New password</mat-label>
            <input matInput type="password" formControlName="newPassword" />
            <mat-icon matSuffix>lock</mat-icon>
            <mat-hint>Leave blank to keep your existing password</mat-hint>
            <mat-error *ngIf="form.controls.newPassword.hasError('minlength')">At least 8 characters</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" floatLabel="always" class="md:col-span-2">
            <mat-label>Confirm new password</mat-label>
            <input matInput type="password" formControlName="confirmPassword" />
            <mat-icon matSuffix>lock</mat-icon>
            <mat-error *ngIf="form.hasError('passwordMismatch')">Passwords must match</mat-error>
          </mat-form-field>

          <div class="md:col-span-2 flex items-center gap-3">
            <button mat-flat-button color="primary" type="submit" [disabled]="saving()">
              <mat-spinner *ngIf="saving()" diameter="20" class="!w-5 !h-5"></mat-spinner>
              <span *ngIf="!saving()">Save changes</span>
            </button>
            <p class="text-sm text-slate-300">Updates take effect immediately for your next login.</p>
          </div>
        </form>

        <mat-list class="bg-transparent">
          <mat-list-item>Manage contact email and display name</mat-list-item>
          <mat-list-item>Update your preferred platform and handle</mat-list-item>
          <mat-list-item>Rotate your password directly from the dashboard</mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);

  readonly platforms = PLATFORM_OPTIONS;

  loading = signal(true);
  saving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  private profile = signal<ProfileResponse | null>(null);
  private optimisticProfile = signal<ProfileResponse | null>(null);
  readonly displayProfile = computed(() => this.optimisticProfile() ?? this.profile());
  readonly optimisticUpdate = computed(() => Boolean(this.optimisticProfile()));

  form = this.fb.group(
    {
      email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      displayName: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      platform: this.fb.control<Platform | ''>('', { validators: [Validators.required] }),
      platformHandle: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      profileImageUrl: this.fb.control<string | null>('', { validators: [] }),
      newPassword: this.fb.control('', { nonNullable: true, validators: [this.optionalMinLength(8)] }),
      confirmPassword: this.fb.control('', { nonNullable: true }),
    },
    { validators: this.passwordsMatchValidator() }
  );

  ngOnInit(): void {
    this.profileService
      .loadProfile()
      .pipe(finalize(() => this.loading.set(false)), takeUntilDestroyed())
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.form.patchValue({
            email: profile.email,
            displayName: profile.displayName,
            platform: profile.platform,
            platformHandle: profile.platformHandle,
            profileImageUrl: profile.profileImageUrl ?? '',
          });
        },
        error: () => {
          this.errorMessage.set('Unable to load your profile. Please try again later.');
        },
      });
  }

  saveProfile(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: UpdateProfileRequest = {
      email: this.form.controls.email.value,
      displayName: this.form.controls.displayName.value,
      platform: this.form.controls.platform.value as Platform,
      platformHandle: this.form.controls.platformHandle.value,
      profileImageUrl: this.form.controls.profileImageUrl.value || null,
      newPassword: this.form.controls.newPassword.value ? this.form.controls.newPassword.value : null,
    };

    this.saving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const previousProfile = this.profile();
    if (previousProfile) {
      this.optimisticProfile.set({
        ...previousProfile,
        ...payload,
        profileImageUrl: payload.profileImageUrl ?? null,
        updatedAt: new Date().toISOString(),
      });
    }

    this.profileService
      .updateProfile(payload)
      .pipe(finalize(() => this.saving.set(false)), takeUntilDestroyed())
      .subscribe({
        next: (updated) => {
          this.profile.set(updated);
          this.optimisticProfile.set(null);
          this.successMessage.set('Profile updated successfully.');
          this.form.patchValue({
            email: updated.email,
            displayName: updated.displayName,
            platform: updated.platform,
            platformHandle: updated.platformHandle,
            profileImageUrl: updated.profileImageUrl ?? '',
            newPassword: '',
            confirmPassword: '',
          });
          this.form.markAsPristine();
        },
        error: () => {
          if (previousProfile) {
            this.profile.set(previousProfile);
          }
          this.optimisticProfile.set(null);
          this.errorMessage.set('Saving failed. Please review your inputs and try again.');
        },
      });
  }

  private optionalMinLength(minLength: number): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value as string;
      if (!value) {
        return null;
      }
      return value.length >= minLength ? null : { minlength: true };
    };
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const password = control.get('newPassword')?.value as string;
      const confirmPassword = control.get('confirmPassword')?.value as string;
      if (!password && !confirmPassword) {
        return null;
      }
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }
}
