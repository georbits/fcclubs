import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatchResultService } from './match-result.service';

@Component({
  selector: 'app-report-result-page',
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
  ],
  template: `
    <mat-card class="bg-slate-900/60 border border-slate-800">
      <mat-card-header>
        <mat-card-title>Report a match result</mat-card-title>
        <mat-card-subtitle>Manager/admin workflow</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="space-y-4">
        <div
          *ngIf="successMessage()"
          class="rounded border border-emerald-700 bg-emerald-900/40 p-3 text-sm text-emerald-100"
        >
          {{ successMessage() }}
        </div>

        <div *ngIf="errorMessage()" class="rounded border border-rose-700 bg-rose-900/40 p-3 text-sm text-rose-100">
          {{ errorMessage() }}
        </div>

        <form class="grid gap-4 md:grid-cols-2" [formGroup]="form" (ngSubmit)="submitResult()">
          <mat-form-field appearance="outline" floatLabel="always">
            <mat-label>Fixture ID</mat-label>
            <input matInput type="number" formControlName="fixtureId" min="1" required />
            <mat-icon matSuffix>stadium</mat-icon>
            <mat-error *ngIf="form.controls.fixtureId.hasError('required')">Fixture ID is required</mat-error>
            <mat-error *ngIf="form.controls.fixtureId.hasError('min')">Enter a valid fixture ID</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" floatLabel="always">
            <mat-label>Home score</mat-label>
            <input matInput type="number" formControlName="homeScore" min="0" required />
            <mat-icon matSuffix>home</mat-icon>
            <mat-error *ngIf="form.controls.homeScore.hasError('required')">Home score is required</mat-error>
            <mat-error *ngIf="form.controls.homeScore.hasError('min')">Must be zero or higher</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" floatLabel="always">
            <mat-label>Away score</mat-label>
            <input matInput type="number" formControlName="awayScore" min="0" required />
            <mat-icon matSuffix>flight_takeoff</mat-icon>
            <mat-error *ngIf="form.controls.awayScore.hasError('required')">Away score is required</mat-error>
            <mat-error *ngIf="form.controls.awayScore.hasError('min')">Must be zero or higher</mat-error>
          </mat-form-field>

          <div class="md:col-span-2 flex items-center gap-3">
            <button mat-flat-button color="primary" type="submit" [disabled]="submitting() || form.invalid">
              <mat-spinner *ngIf="submitting()" diameter="20" class="!w-5 !h-5"></mat-spinner>
              <span *ngIf="!submitting()">Submit result</span>
            </button>
            <p class="text-sm text-slate-300">Only club managers and admins can submit official results.</p>
          </div>
        </form>

        <mat-list class="bg-transparent">
          <mat-list-item>Select a fixture assigned to your club</mat-list-item>
          <mat-list-item>Enter final score with optional notes</mat-list-item>
          <mat-list-item>Confirm submission and surface standings impact</mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportResultPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly matchResultService = inject(MatchResultService);
  private readonly destroyRef = inject(DestroyRef);

  submitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    fixtureId: this.fb.control<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
    homeScore: this.fb.control<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    awayScore: this.fb.control<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
  });

  submitResult(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const payload = {
      fixtureId: this.form.controls.fixtureId.value!,
      homeScore: this.form.controls.homeScore.value!,
      awayScore: this.form.controls.awayScore.value!,
    };

    this.matchResultService
      .submitResult(payload)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.successMessage.set(`Result submitted for fixture #${response.fixtureId}.`);
          this.form.reset();
        },
        error: () => this.errorMessage.set('Could not submit the result. Please verify permissions and try again.'),
      });
  }
}
