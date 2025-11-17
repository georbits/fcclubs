import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatListModule],
  template: `
    <mat-card class="bg-slate-900/60 border border-slate-800">
      <mat-card-header>
        <mat-card-title>Profile & security</mat-card-title>
        <mat-card-subtitle>Update contact info and platform handles</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="space-y-3">
        <p>
          Authenticated users will manage their email, display name, avatar, and
          platform handle from this page. Password changes and OAuth linking will
          be surfaced here as the auth flow is connected.
        </p>
        <mat-list>
          <mat-list-item>Profile details (email, name, avatar)</mat-list-item>
          <mat-list-item>Gaming platform selection and handle</mat-list-item>
          <mat-list-item>Password update and logout controls</mat-list-item>
        </mat-list>
      </mat-card-content>
      <mat-card-actions>
        <button mat-flat-button color="accent">Update profile</button>
      </mat-card-actions>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {}
