import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { ClubApiService } from '../../../core/api/club-api.service';
import { ClubDetailsResponse, ClubResultSummary } from '../../../core/api/club-api.models';
import { PLATFORM_OPTIONS, Platform } from '../../../core/models/platform';

@Component({
  selector: 'app-club-details-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <section class="grid gap-4">
      <mat-card class="bg-slate-900/60 border border-slate-800">
        <mat-card-header *ngIf="club() as data">
          <mat-card-title class="flex items-center gap-3">
            <img
              *ngIf="data.logoUrl"
              [src]="data.logoUrl"
              [alt]="data.name + ' logo'"
              class="h-10 w-10 rounded bg-slate-800 object-cover"
            />
            <span>{{ data.name }}</span>
            <mat-chip color="primary" selected>{{ data.shortCode }}</mat-chip>
          </mat-card-title>
          <mat-card-subtitle>Public roster and player handles</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="space-y-4">
          <div *ngIf="loading()" class="flex items-center gap-3 text-slate-200">
            <mat-progress-spinner diameter="28" mode="indeterminate"></mat-progress-spinner>
            <span>Loading club roster...</span>
          </div>

          <div
            *ngIf="error()"
            class="rounded border border-rose-700 bg-rose-900/40 p-3 text-sm text-rose-100"
          >
            {{ error() }}
          </div>

          <ng-container *ngIf="club() as data">
            <p class="text-sm text-slate-200">
              {{ data.name }} is registered under short code {{ data.shortCode }}. Fans can follow the roster and platform
              handles below while we surface their latest results.
            </p>

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
              </mat-list-item>
            </mat-list>

            <p *ngIf="!data.players?.length" class="text-sm text-slate-300">No players registered yet for this club.</p>

            <div class="space-y-2">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-200">Recent results</h3>
              <p *ngIf="!data.recentResults?.length" class="text-sm text-slate-300">No completed fixtures yet.</p>

              <mat-list *ngIf="data.recentResults?.length" class="bg-transparent divide-y divide-slate-800">
                <mat-list-item
                  *ngFor="let result of data.recentResults"
                  class="flex flex-col items-start gap-1 py-3"
                >
                  <div class="flex w-full items-center justify-between">
                    <div class="flex items-center gap-2">
                      <mat-chip color="primary" selected>{{ result.homeClub ? 'Home' : 'Away' }}</mat-chip>
                      <span class="font-semibold text-slate-100">{{ opponentName(result) }}</span>
                    </div>
                    <span class="text-sm text-slate-200">{{ result.homeScore }} - {{ result.awayScore }}</span>
                  </div>
                  <div class="text-xs text-slate-400">{{ result.leagueName }} {{ result.leagueSeason }} · Fixture #{{
                    result.fixtureId
                  }}</div>
                </mat-list-item>
              </mat-list>
            </div>
          </ng-container>
        </mat-card-content>

        <mat-card-actions>
          <a mat-stroked-button color="primary" routerLink="/">Back to standings</a>
        </mat-card-actions>
      </mat-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubDetailsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly clubApi = inject(ClubApiService);

  club = signal<ClubDetailsResponse | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  private readonly platformMap = new Map<Platform, string>(PLATFORM_OPTIONS.map((option) => [option.value, option.label]));

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const clubId = Number(params.get('clubId'));
        if (!clubId) {
          this.error.set('Invalid club id provided.');
          this.loading.set(false);
          return;
        }

        this.fetchClubDetails(clubId);
      });
  }

  platformLabel(platform: Platform): string {
    return this.platformMap.get(platform) ?? platform;
  }

  opponentName(result: ClubResultSummary): string {
    const club = this.club();
    if (!club) {
      return '';
    }

    return result.homeClubId === club.id ? result.awayClubName : result.homeClubName;
  }

  private fetchClubDetails(clubId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.clubApi
      .getDetails(clubId)
      .pipe(finalize(() => this.loading.set(false)), takeUntilDestroyed())
      .subscribe({
        next: (response) => this.club.set(response),
        error: () => this.error.set('Unable to load this club right now. Please try again later.'),
      });
  }
}
