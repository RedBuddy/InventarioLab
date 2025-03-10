import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // Clave secreta para firmar el token (debería estar en una variable de entorno)
  private API_URL = process.env['API_URL'] || 'http://localhost:3000';

  private login_url: string = `${this.API_URL}/login`;
  private requestPasswordResetUrl: string = `${this.API_URL}/request-password-reset`;
  private resetPasswordUrl: string = `${this.API_URL}/reset-password`;
  private refresh_url: string = `${this.API_URL}/refresh-token`;

  private tokenKey = 'auth_token';
  private RefreshTokenKey = 'refresh_token';
  private userImageKey = 'user_image';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string | null>(this.getUserRole());
  userRole$ = this.userRoleSubject.asObservable();

  private userImageSubject = new BehaviorSubject<string | null>(this.getUserImageFromStorage());
  userImage$ = this.userImageSubject.asObservable();

  constructor(private HttpClient: HttpClient, private router: Router) { }

  login(email: string, contrasena: string): Observable<any> {
    return this.HttpClient.post<any>(this.login_url, { email, contrasena }).pipe(
      tap(res => {
        if (res.token) {
          this.setToken(res.token);
          this.setRefreshToken(res.refreshToken);
          this.autoRefreshToken();
          this.isAuthenticatedSubject.next(true);
          this.userRoleSubject.next(this.getUserRole());
          this.fetchUserProfileImage(res.imagen); // Obtener la imagen del usuario
          this.router.navigate(['inicio']);
        }
      }),
      catchError(this.handleError)
    );
  }


  requestPasswordReset(email: string): Observable<any> {
    return this.HttpClient.post(this.requestPasswordResetUrl, { email }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(token: string, new_password: string): Observable<any> {
    return this.HttpClient.post(this.resetPasswordUrl, { token, new_password }).pipe(
      catchError(this.handleError)
    );
  }

  private fetchUserProfileImage(imagen: { type: string; data: number[] }): void {
    if (!imagen) {
      console.error('No image data found');
      return;
    }

    const byteArray = new Uint8Array(imagen.data);
    const blob = new Blob([byteArray], { type: imagen.type });
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      this.userImageSubject.next(imageUrl);
      this.setUserImage(imageUrl); // Guardar la imagen en el localStorage
    };
    reader.readAsDataURL(blob);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.RefreshTokenKey, refreshToken);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.RefreshTokenKey);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.error('No refresh token found');
      return throwError('No refresh token found');
    }

    return this.HttpClient.post<any>(this.refresh_url, { refreshToken }).pipe(
      tap(res => {
        if (res.token) {
          this.setToken(res.token);
          this.setRefreshToken(res.refreshToken);
          this.autoRefreshToken();
        } else {
          console.error('No token in response');
        }
      }),
      catchError(error => {
        console.error('Error refreshing token:', error);
        return throwError(error);
      })
    );
  }

  autoRefreshToken(): void {
    const token = this.getToken();
    if (!token) {
      console.error('No token found for auto-refresh');
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const timeout = exp - Date.now() - 60000; // Refresh 1 minute before expiration

    if (timeout > 0) {
      setTimeout(() => {
        this.refreshToken().subscribe();
      }, timeout);
    } else {
      console.error('Token already expired');
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) {
      return false
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  getUserRole(): string | null {
    if (!this.isAuthenticated()) {
      return null;
    }

    const token = this.getToken();
    if (!token) {
      return null;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rol || null; // Asume que el rol está en el campo 'role' del payload
  }

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.usuario_id;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.RefreshTokenKey);
    localStorage.removeItem(this.userImageKey);
    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next(null);
    this.userImageSubject.next(null);
    this.router.navigate(['/login']);
  }

  private setUserImage(imageUrl: string): void {
    localStorage.setItem(this.userImageKey, imageUrl);
  }

  private getUserImageFromStorage(): string | null {
    return localStorage.getItem(this.userImageKey);
  }

  getUserImage(): string | null {
    return this.userImageSubject.value;
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Algo salió mal, intenta de nuevo.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = error.error.message || 'Error del servidor';
    }
    return throwError({ status: error.status, message: errorMessage });
  }
}
