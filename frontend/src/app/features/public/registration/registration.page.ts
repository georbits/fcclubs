import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  template: `
    <section class="grid gap-4">
      <mat-card class="bg-slate-900/60 border border-slate-800">
        <mat-card-header>
          <mat-card-title>Create your tournament account</mat-card-title>
          <mat-card-subtitle>Registration form scaffold</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>
            Players sign up with their email, display name, password, and gaming
            platform handle (EA, PS5, or XBOX). Once OAuth login is wired, this
            page will host the form and validation messages.
          </p>
          <mat-list>
            <mat-list-item>Email and display name</mat-list-item>
            <mat-list-item>Secure password and confirmation</mat-list-item>
            <mat-list-item>Platform selection and account handle</mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent {}
