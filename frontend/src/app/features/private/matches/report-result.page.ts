import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-report-result-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  template: `
    <mat-card class="bg-slate-900/60 border border-slate-800">
      <mat-card-header>
        <mat-card-title>Report a match result</mat-card-title>
        <mat-card-subtitle>Manager/admin workflow</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="space-y-3">
        <p>
          This flow will target the backend\'s result submission endpoint. The
          UI will present fixtures assigned to the logged-in club manager and
          validate against duplicate submissions.
        </p>
        <mat-list>
          <mat-list-item>Select a fixture</mat-list-item>
          <mat-list-item>Enter final score with optional notes</mat-list-item>
          <mat-list-item>Confirm submission and surface standings impact</mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportResultPageComponent {}
