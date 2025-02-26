import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { IUsuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private login_url: string = 'http://localhost:3000/login';
  // private register_url: string = 'http://localhost:3000/users';
  // private profile_img_url: string = 'http://localhost:3000/users/profile_img';
  private tokenKey = 'auth_token';
  private refresh_url: string = 'http://localhost:3000/refresh-token';
  private RefreshTokenKey = 'refresh_token';
  private userImageKey = 'user_image';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string | null>(this.getUserRole());
  userRole$ = this.userRoleSubject.asObservable();

  private userImageSubject = new BehaviorSubject<string | null>(this.getUserImageFromStorage());
  userImage$ = this.userImageSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private usuarioService: UsuarioService) { }

  login(identifier: string, password: string): Observable<any> {
    return this.http.post<any>(this.login_url, { identifier, password }).pipe(
      tap(res => {
        if (res.token) {
          this.setToken(res.token);
          this.setRefreshToken(res.refreshToken);
          this.isAuthenticatedSubject.next(true);
          this.userRoleSubject.next(res.user.role);
          this.userImageSubject.next(res.user.image);
        }
      }),
      catchError(this.handleError)
    );
  }

  // register(usuario: IUsuario): Observable<IUsuario> {
  //   return this.usuarioService.createUsuario(usuario).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  logout(): void {
    this.clearSession();
    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next(null);
    this.userImageSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<any>(this.refresh_url, { refreshToken }).pipe(
      tap(res => {
        if (res.token) {
          this.setToken(res.token);
        }
      }),
      catchError(this.handleError)
    );
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

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.RefreshTokenKey);
    localStorage.removeItem(this.userImageKey);
  }

  private isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private getUserRole(): string | null {
    // Implementa la lógica para obtener el rol del usuario desde el token o el almacenamiento local
    return null;
  }

  private getUserImageFromStorage(): string | null {
    return localStorage.getItem(this.userImageKey);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Algo salió mal, intenta de nuevo.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = error.error.message || 'Error del servidor';
    }
    console.error('An error occurred:', errorMessage);
    return throwError({ status: error.status, message: errorMessage });
  }
}
