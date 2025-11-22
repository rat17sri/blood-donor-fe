// client/src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface LoginResponse {
  token: string;
  user: UserInfo;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';

  private currentUserSubject = new BehaviorSubject<UserInfo | null>(
    AuthService.getUserFromStorage()
  );
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  private static getUserFromStorage(): UserInfo | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  private saveAuth(res: LoginResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUserSubject.next(res.user);
  }

  register(payload: any): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/register`, payload)
      .pipe(tap(res => this.saveAuth(res)));
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(res => this.saveAuth(res)));
  }

  getMe(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  updateMe(payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/me`, payload);
  }

  logout(): void {
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
    const user = AuthService.getUserFromStorage();
    return user?.role === 'admin';
  }

  isDonor(): boolean {
    const user = AuthService.getUserFromStorage();
    return user?.role === 'user';
  }
}
