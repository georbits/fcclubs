import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-club-dashboard-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  template: `
    <mat-card class="bg-slate-900/60 border border-slate-800">
      <mat-card-header>
        <mat-card-title>Club manager workspace</mat-card-title>
        <mat-card-subtitle>Roster, invites, and fixtures</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="space-y-3">
        <p>
          Club managers will manage players, update roles, and submit lineups
          from this dashboard. As fixtures are synced from the backend, managers
          will also be able to enter results directly from here.
        </p>
        <mat-list>
          <mat-list-item>Roster management (add/remove players)</mat-list-item>
          <mat-list-item>Assign club managers</mat-list-item>
          <mat-list-item>Fixture list with quick result entry</mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubDashboardPageComponent {}
