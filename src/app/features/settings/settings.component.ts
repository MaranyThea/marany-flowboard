import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  private readonly fb = new FormBuilder();

  profileForm = this.fb.nonNullable.group({
    name: ['Marany Thea', [Validators.required]],
    email: ['marany@example.com', [Validators.required, Validators.email]]
  });

  notificationForm = this.fb.nonNullable.group({
    emailNotifications: [true],
    issueUpdates: [true],
    projectUpdates: [false]
  });

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    console.log('Profile saved:', this.profileForm.getRawValue());
  }

  saveNotifications(): void {
    console.log(
      'Notifications saved:',
      this.notificationForm.getRawValue()
    );
  }
}
