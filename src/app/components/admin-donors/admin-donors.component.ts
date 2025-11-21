import { Component, OnInit } from '@angular/core';
import { DonorService } from '../../services/donor.service';

@Component({
  selector: 'app-admin-donors',
  templateUrl: './admin-donors.component.html'
})
export class AdminDonorsComponent implements OnInit {
  donors: any[] = [];
  loading = false;
  errorMsg = '';

  constructor(private donorService: DonorService) {}

  ngOnInit(): void {
    this.fetchDonors();
  }

  fetchDonors() {
    this.loading = true;
    this.errorMsg = '';
    this.donorService.getAllDonors().subscribe({
      next: res => {
        this.loading = false;
        this.donors = res;
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err?.error?.msg || 'Failed to load donors';
      }
    });
  }
}
