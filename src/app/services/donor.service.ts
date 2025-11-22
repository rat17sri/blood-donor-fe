import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonorService {
  private apiUrl = 'https://blood-donor-be.onrender.com/api/donors';

  constructor(private http: HttpClient) { }

  getAllDonors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
