import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IUsuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<IUsuario[]> {
    return this.http.get<IUsuario[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getUsuario(id: number): Observable<IUsuario> {
    return this.http.get<IUsuario>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createUsuario(usuario: IUsuario): Observable<IUsuario> {
    return this.http.post<IUsuario>(this.apiUrl, usuario).pipe(
      catchError(this.handleError)
    );
  }

  updateUsuario(id: number, usuario: IUsuario): Observable<IUsuario> {
    return this.http.put<IUsuario>(`${this.apiUrl}/${id}`, usuario).pipe(
      catchError(this.handleError)
    );
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
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