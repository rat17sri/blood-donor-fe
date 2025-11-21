import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: FormGroup;
  errorMsg = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMsg = '';
    this.loading = true;

    const { email, password } = this.form.value;

    this.auth.login(email, password).subscribe({
      next: res => {
        this.loading = false;
        if (res.user.role === 'admin') {
          this.router.navigateByUrl('/admin/donors');
        } else {
          this.router.navigateByUrl('/');
        }
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err?.error?.msg || 'Login failed';
      }
    });
  }
}
