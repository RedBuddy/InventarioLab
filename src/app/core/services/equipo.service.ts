import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IEquipo } from '../models/equipo.model';

@Injectable({
  providedIn: 'root'
})

export class EquipoService {

  private apiUrl = 'http://localhost:3000/equipos';

  constructor(private http: HttpClient) { }

  getEquipos(): Observable<IEquipo[]> {
    return this.http.get<IEquipo[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getEquipo(id: number): Observable<IEquipo> {
    return this.http.get<IEquipo>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createEquipo(equipo: IEquipo): Observable<IEquipo> {
    return this.http.post<IEquipo>(this.apiUrl, equipo).pipe(
      catchError(this.handleError)
    );
  }

  updateEquipo(id: number, equipo: IEquipo): Observable<IEquipo> {
    return this.http.put<IEquipo>(`${this.apiUrl}/${id}`, equipo).pipe(
      catchError(this.handleError)
    );
  }

  deleteEquipo(id: number): Observable<void> {
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