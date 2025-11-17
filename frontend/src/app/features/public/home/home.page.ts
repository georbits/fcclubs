import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LeagueApiService } from '../../../core/api/league-api.service';
import { LeagueStandingsResponse } from '../../../core/api/league-api.models';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-home-page',
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
    <section class="grid gap-6 xl:grid-cols-3">
      <mat-card appearance="raised" class="bg-slate-900/60 border border-slate-800 xl:col-span-2">
        <mat-card-header>
          <mat-icon mat-card-avatar color="primary">leaderboard</mat-icon>
          <mat-card-title>Current standings</mat-card-title>
          <mat-card-subtitle>Live data from the public league API</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="space-y-4">
          <form class="flex items-end gap-3 flex-wrap" (ngSubmit)="refreshStandings()">
            <mat-form-field appearance="outline" floatLabel="always" class="w-28">
              <mat-label>League ID</mat-label>
              <input
                matInput
                type="number"
                min="1"
                [formControl]="leagueIdControl"
                aria-label="League ID"
                required
              />
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit">Load standings</button>
            <span class="text-sm text-slate-300" *ngIf="standings() as data">{{ data.leagueName }} · Season {{ data.season }}</span>
          </form>

          <div class="flex items-center gap-2" *ngIf="loading()">
            <mat-progress-spinner diameter="28" mode="indeterminate" color="primary"></mat-progress-spinner>
            <span>Loading standings…</span>
          </div>

          <div *ngIf="error()" class="p-3 bg-red-900/50 border border-red-800 rounded text-sm">
            {{ error() }}
          </div>

          <div *ngIf="!loading() && standings()?.table?.length" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-800">
              <thead class="text-left text-slate-200 uppercase text-xs tracking-wide">
                <tr class="align-middle">
                  <th class="py-2 pr-4">Club</th>
                  <th class="py-2 pr-4">P</th>
                  <th class="py-2 pr-4">W</th>
                  <th class="py-2 pr-4">D</th>
                  <th class="py-2 pr-4">L</th>
                  <th class="py-2 pr-4">GF</th>
                  <th class="py-2 pr-4">GA</th>
                  <th class="py-2 pr-4">GD</th>
                  <th class="py-2 pr-4">Pts</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-sm" *ngIf="standings()?.table as rows">
                <tr *ngFor="let row of rows" class="align-middle">
                  <td class="py-2 pr-4">
                    <div class="font-semibold">{{ row.clubName }}</div>
                    <div class="text-xs text-slate-400">{{ row.clubShortCode }}</div>
                  </td>
                  <td class="py-2 pr-4">{{ row.played }}</td>
                  <td class="py-2 pr-4">{{ row.wins }}</td>
                  <td class="py-2 pr-4">{{ row.draws }}</td>
                  <td class="py-2 pr-4">{{ row.losses }}</td>
                  <td class="py-2 pr-4">{{ row.goalsFor }}</td>
                  <td class="py-2 pr-4">{{ row.goalsAgainst }}</td>
                  <td class="py-2 pr-4" [ngClass]="row.goalDifference >= 0 ? 'text-emerald-300' : 'text-rose-300'">
                    {{ row.goalDifference }}
                  </td>
                  <td class="py-2 pr-4 font-semibold">{{ row.points }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="!loading() && !standings()?.table?.length && !error()" class="text-sm text-slate-300">
            No standings available yet for this league.
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined" class="bg-slate-900/60 border border-slate-800">
        <mat-card-header>
          <mat-icon mat-card-avatar color="accent">groups</mat-icon>
          <mat-card-title>Clubs & fixtures</mat-card-title>
          <mat-card-subtitle>Public club detail pages</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="space-y-3">
          <p>
            Every club will have a public profile that lists rostered players,
            platform handles, and recent match results. Once routing is wired to
            real data, visitors will be able to drill into upcoming fixtures and
            final scores.
          </p>
          <p class="text-sm text-slate-300">
            Next up: connect this card to the clubs API and add a fixture preview
            pulled from the backend.
          </p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-stroked-button color="accent">Browse clubs</button>
        </mat-card-actions>
      </mat-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly leagueApi = inject(LeagueApiService);

  leagueIdControl = new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(1)] });
  loading = signal(false);
  error = signal<string | null>(null);
  standings = signal<LeagueStandingsResponse | null>(null);

  constructor() {
    this.refreshStandings();
  }

  refreshStandings(): void {
    if (this.leagueIdControl.invalid) {
      this.leagueIdControl.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const leagueId = this.leagueIdControl.value;

    this.leagueApi
      .getStandings(leagueId)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (response) => this.standings.set(response),
        error: () => this.error.set('Unable to load standings right now. Please try again shortly.'),
      });
  }
}
