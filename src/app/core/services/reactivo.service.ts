import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IReactivo } from '../models/reactivo.model';

@Injectable({
  providedIn: 'root'
})

export class ReactivoService {

  private API_URL = process.env['API_URL'] || 'http://localhost:3000';

  private apiUrl = `${this.API_URL}/reactivos`;

  constructor(private http: HttpClient) { }

  getReactivos(): Observable<IReactivo[]> {
    return this.http.get<IReactivo[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getReactivo(id: number): Observable<IReactivo> {
    return this.http.get<IReactivo>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createReactivo(reactivo: IReactivo): Observable<IReactivo> {
    return this.http.post<IReactivo>(this.apiUrl, reactivo).pipe(
      catchError(this.handleError)
    );
  }

  updateReactivo(id: number, reactivo: IReactivo): Observable<IReactivo> {
    return this.http.put<IReactivo>(`${this.apiUrl}/${id}`, reactivo).pipe(
      catchError(this.handleError)
    );
  }

  deleteReactivo(id: number): Observable<void> {
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