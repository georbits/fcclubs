import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration-success-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, RouterModule],
  template: `
    <section class="flex justify-center">
      <mat-card class="bg-slate-900/60 border border-slate-800 max-w-xl w-full">
        <mat-card-header>
          <mat-icon mat-card-avatar color="primary">check_circle</mat-icon>
          <mat-card-title>Account created</mat-card-title>
          <mat-card-subtitle>Welcome to the tournament</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="space-y-4 text-slate-200">
          <p class="text-lg font-semibold">Hi {{ displayName() }}!</p>
          <p>
            Your registration was received. Check your email for a verification link to activate your account before signing in
            to manage your club or profile.
          </p>
          <p class="text-sm text-slate-400">Having trouble? Contact an administrator to complete your onboarding.</p>
        </mat-card-content>
        <mat-card-actions>
          <a mat-stroked-button color="primary" routerLink="/">Return to standings</a>
        </mat-card-actions>
      </mat-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationSuccessPageComponent {
  private readonly router = inject(Router);

  readonly displayName = computed(() => this.router.getCurrentNavigation()?.extras.state?.['displayName'] ?? 'there');
}
