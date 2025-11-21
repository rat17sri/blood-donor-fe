import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  form: FormGroup;
  successMsg = '';
  errorMsg = '';
  loading = false;

  bloodGroups = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-'
  ];

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      city: ['', Validators.required],
      lastDonationDate: [''],
      isAvailable: [true]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.successMsg = '';
    this.errorMsg = '';
    this.loading = true;

    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Registered successfully as donor.';
        this.form.reset({ isAvailable: true });
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err?.error?.msg || 'Registration failed';
      }
    });
  }
}
