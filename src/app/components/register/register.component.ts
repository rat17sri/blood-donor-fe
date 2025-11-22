// client/src/app/components/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  successMsg = '';
  errorMsg = '';
  loading = false;
  isUpdateMode = false;

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
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

  ngOnInit(): void {
    // If logged in as donor, this page works as "Update Donor Details"
    if (this.auth.isLoggedIn() && this.auth.isDonor()) {
      this.isUpdateMode = true;

      // Password is not needed in update mode
      const passwordCtrl = this.form.get('password');
      if (passwordCtrl) {
        passwordCtrl.clearValidators();
        passwordCtrl.updateValueAndValidity();
      }

      // Load existing profile and prefill the form
      this.auth.getMe().subscribe({
        next: user => {
          this.form.patchValue({
            name: user.name,
            email: user.email,
            phone: user.phone,
            bloodGroup: user.bloodGroup,
            city: user.city,
            lastDonationDate: user.lastDonationDate
              ? user.lastDonationDate.substring(0, 10)
              : '',
            isAvailable: user.isAvailable
          });
        },
        error: err => {
          console.error('Error loading profile', err);
          // If something goes wrong, fallback to registration mode
          this.isUpdateMode = false;
        }
      });
    }
  }

  submit(): void {
    this.successMsg = '';
    this.errorMsg = '';

    if (!this.isUpdateMode && this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    if (this.isUpdateMode) {
      this.updateDonor();
    } else {
      this.registerDonor();
    }
  }

  private registerDonor(): void {
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

  private updateDonor(): void {
    const { name, phone, bloodGroup, city, lastDonationDate, isAvailable } =
      this.form.value;

    const payload = {
      name,
      phone,
      bloodGroup,
      city,
      lastDonationDate,
      isAvailable
    };

    this.auth.updateMe(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Donor details updated successfully.';
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err?.error?.msg || 'Update failed';
      }
    });
  }

  cancelUpdate(): void {
    if (this.isUpdateMode) {
      this.router.navigateByUrl('/');
    } else {
      this.form.reset({ isAvailable: true });
    }
  }
}
