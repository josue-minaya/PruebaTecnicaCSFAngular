import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { User } from '../Models/User.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '../Models/auth-response.interface';
import { Login } from '../Models/login.interface';
import { AuthResponseToken } from '../Models/auth-response.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7005/api/Auth';

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

  login(user: Login): Observable<boolean> {
    return this.http
      .post<AuthResponseToken>(`${this.baseUrl}/login`, user)
      .pipe(map((resp) => this.handleAuthSuccess(resp)));
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }

  private handleAuthSuccess(auth: AuthResponseToken) {
    this._user.set(null);
    this._authStatus.set('authenticated');
    this._token.set(auth.data);
    localStorage.setItem('token', auth.data);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
