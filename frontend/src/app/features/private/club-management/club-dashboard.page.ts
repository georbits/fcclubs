import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { ClubApiService } from '../../../core/api/club-api.service';
import { ClubPlayer, ClubRosterResponse } from '../../../core/api/club-api.models';
import { PLATFORM_OPTIONS, Platform } from '../../../core/models/platform';

@Component({
  selector: 'app-club-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <mat-card class="bg-slate-900/60 border border-slate-800">
      <mat-card-header>
        <mat-card-title>Club manager workspace</mat-card-title>
        <mat-card-subtitle>Roster, invites, and fixtures</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="space-y-3">
        <form class="grid gap-3 md:grid-cols-[1fr_auto]" [formGroup]="clubForm" (ngSubmit)="loadRoster()">
          <mat-form-field appearance="outline" floatLabel="always" class="md:col-span-1">
            <mat-label>Club ID</mat-label>
            <input matInput type="number" min="1" formControlName="clubId" required />
            <mat-icon matSuffix>stadium</mat-icon>
            <mat-error *ngIf="clubForm.controls.clubId.hasError('required')">Club id is required</mat-error>
            <mat-error *ngIf="clubForm.controls.clubId.hasError('min')">Enter a valid id</mat-error>
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" [disabled]="loading() || clubForm.invalid">
            <mat-spinner *ngIf="loading()" diameter="20" class="!w-5 !h-5"></mat-spinner>
            <span *ngIf="!loading()">Load roster</span>
          </button>
        </form>

        <div *ngIf="errorMessage()" class="rounded border border-rose-700 bg-rose-900/40 p-3 text-sm text-rose-100">
          {{ errorMessage() }}
        </div>

        <div *ngIf="loading()" class="flex items-center gap-3 text-slate-200">
          <mat-progress-spinner diameter="28" mode="indeterminate"></mat-progress-spinner>
          <span>Fetching roster...</span>
        </div>

        <ng-container *ngIf="roster() as data">
          <div class="flex items-center gap-3">
            <img
              *ngIf="data.logoUrl"
              [src]="data.logoUrl"
              [alt]="data.name + ' logo'"
              class="h-10 w-10 rounded bg-slate-800 object-cover"
            />
            <div>
              <p class="text-lg font-semibold text-slate-100">{{ data.name }}</p>
              <p class="text-sm text-slate-400">Short code: {{ data.shortCode }}</p>
            </div>
          </div>

          <section class="space-y-2">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-200">Roster</h3>
            <p *ngIf="!data.players?.length" class="text-sm text-slate-300">No players registered for this club yet.</p>

            <mat-list *ngIf="data.players?.length" class="bg-transparent divide-y divide-slate-800">
              <mat-list-item *ngFor="let player of data.players" class="flex items-start gap-3 py-3">
                <img
                  *ngIf="player.profileImageUrl"
                  [src]="player.profileImageUrl"
                  [alt]="player.displayName + ' avatar'"
                  class="h-12 w-12 rounded-full object-cover border border-slate-800"
                />

                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold">{{ player.displayName }}</span>
                    <mat-chip color="accent" selected *ngIf="player.id === data.managerUserId">Manager</mat-chip>
                  </div>
                  <div class="text-sm text-slate-300 flex items-center gap-2">
                    <mat-icon inline class="text-slate-400" fontSet="material-icons">sports_esports</mat-icon>
                    <span>{{ platformLabel(player.platform) }} · {{ player.platformHandle }}</span>
                  </div>
                  <div class="text-xs uppercase tracking-wide text-slate-400">{{ player.role }}</div>
                </div>

                <button mat-icon-button color="warn" (click)="removePlayer(player)" [disabled]="removingId() === player.id">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-list-item>
            </mat-list>
          </section>

          <section class="space-y-2">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-200">Add player</h3>
            <form class="grid gap-3 md:grid-cols-[1fr_auto]" [formGroup]="addPlayerForm" (ngSubmit)="addPlayer()">
              <mat-form-field appearance="outline" floatLabel="always">
                <mat-label>User ID</mat-label>
                <input matInput type="number" min="1" formControlName="userId" required />
                <mat-icon matSuffix>person_add</mat-icon>
                <mat-error *ngIf="addPlayerForm.controls.userId.hasError('required')">User id is required</mat-error>
                <mat-error *ngIf="addPlayerForm.controls.userId.hasError('min')">Enter a valid id</mat-error>
              </mat-form-field>

              <button mat-flat-button color="accent" type="submit" [disabled]="addPlayerForm.invalid || adding()">
                <mat-spinner *ngIf="adding()" diameter="20" class="!w-5 !h-5"></mat-spinner>
                <span *ngIf="!adding()">Add to roster</span>
              </button>
            </form>
          </section>
        </ng-container>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubDashboardPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly clubApi = inject(ClubApiService);
  private readonly destroyRef = inject(DestroyRef);

  roster = signal<ClubRosterResponse | null>(null);
  loading = signal(false);
  adding = signal(false);
  removingId = signal<number | null>(null);
  errorMessage = signal<string | null>(null);

  private readonly platformMap = new Map<Platform, string>(PLATFORM_OPTIONS.map((option) => [option.value, option.label]));

  clubForm = this.fb.group({
    clubId: this.fb.control<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
  });

  addPlayerForm = this.fb.group({
    userId: this.fb.control<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
  });

  ngOnInit(): void {
    this.clubForm.controls.clubId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.errorMessage.set(null);
    });
  }

  platformLabel(platform: Platform): string {
    return this.platformMap.get(platform) ?? platform;
  }

  loadRoster(): void {
    if (this.clubForm.invalid) {
      this.clubForm.markAllAsTouched();
      return;
    }

    const clubId = this.clubForm.controls.clubId.value!;
    this.loading.set(true);
    this.errorMessage.set(null);
    this.roster.set(null);

    this.clubApi
      .getRoster(clubId)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.roster.set(response),
        error: () => this.errorMessage.set('Unable to load roster for this club. Please try again later.'),
      });
  }

  addPlayer(): void {
    if (!this.roster()) {
      this.errorMessage.set('Load a club roster before adding players.');
      return;
    }

    if (this.addPlayerForm.invalid) {
      this.addPlayerForm.markAllAsTouched();
      return;
    }

    const clubId = this.roster()!.id;
    const payload = { userId: this.addPlayerForm.controls.userId.value! };

    this.adding.set(true);
    this.errorMessage.set(null);

    this.clubApi
      .addPlayer(clubId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.adding.set(false)))
      .subscribe({
        next: (updated) => {
          this.roster.set(updated);
          this.addPlayerForm.reset();
        },
        error: () => this.errorMessage.set('Could not add the player. Verify the user id and permissions.'),
      });
  }

  removePlayer(player: ClubPlayer): void {
    const roster = this.roster();
    if (!roster) {
      return;
    }

    this.removingId.set(player.id);
    this.errorMessage.set(null);

    this.clubApi
      .removePlayer(roster.id, player.id)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.removingId.set(null)))
      .subscribe({
        next: (updated) => this.roster.set(updated),
        error: () => this.errorMessage.set('Could not remove the player right now.'),
      });
  }
}
