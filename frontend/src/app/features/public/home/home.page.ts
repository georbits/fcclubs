import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <section class="grid gap-6 lg:grid-cols-2">
      <mat-card appearance="raised" class="bg-slate-900/60 border border-slate-800">
        <mat-card-header>
          <mat-icon mat-card-avatar color="primary">leaderboard</mat-icon>
          <mat-card-title>Current standings</mat-card-title>
          <mat-card-subtitle>Public league table API</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="space-y-3">
          <p>
            Standings are pulled from the backend\'s public endpoint and ordered by
            points, goal difference, goals for, and club name. The table view will
            support filters for league, match day, and recent form.
          </p>
          <p class="text-sm text-slate-300">
            The SPA will query <code>/api/leagues/{leagueId}/standings</code> to populate this
            section once API wiring is added.
          </p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-flat-button color="primary">View standings</button>
        </mat-card-actions>
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
        </mat-card-content>
        <mat-card-actions>
          <button mat-stroked-button color="accent">Browse clubs</button>
        </mat-card-actions>
      </mat-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
