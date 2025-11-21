import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';

  private currentUserSubject = new BehaviorSubject<LoginResponse['user'] | null>(
    this.getUserFromStorage()
  );

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  private getUserFromStorage() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  register(payload: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  private handleAuth(res: LoginResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUserSubject.next(res.user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUserFromStorage();
    return user?.role === 'admin';
  }
}
