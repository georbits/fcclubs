import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-club-details-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatListModule],
  template: `
    <section class="grid gap-4">
      <mat-card class="bg-slate-900/60 border border-slate-800">
        <mat-card-header>
          <mat-card-title>Club overview</mat-card-title>
          <mat-card-subtitle>Public roster and recent form</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="space-y-3">
          <p>
            This page will surface the club badge, name, platform, and a roster
            pulled from the backend. Once connected to the API, fans can track
            results, fixtures, and player handles from here.
          </p>
          <mat-list>
            <mat-list-item>Rostered players with platform handles</mat-list-item>
            <mat-list-item>Recent results and upcoming fixtures</mat-list-item>
            <mat-list-item>Links to report issues or contact managers</mat-list-item>
          </mat-list>
        </mat-card-content>
        <mat-card-actions>
          <button mat-stroked-button color="primary">Back to standings</button>
        </mat-card-actions>
      </mat-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubDetailsPageComponent {}
