import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IMantenimiento } from '../models/mantenimiento.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {

  private apiUrl = `${environment.API_URL}/mantenimiento`;

  constructor(private http: HttpClient) { }

  getMantenimientos(): Observable<IMantenimiento[]> {
    return this.http.get<IMantenimiento[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getMantenimiento(id: number): Observable<IMantenimiento> {
    return this.http.get<IMantenimiento>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createMantenimiento(mantenimiento: IMantenimiento): Observable<IMantenimiento> {
    return this.http.post<IMantenimiento>(this.apiUrl, mantenimiento).pipe(
      catchError(this.handleError)
    );
  }

  updateMantenimiento(id: number, mantenimiento: IMantenimiento): Observable<IMantenimiento> {
    return this.http.put<IMantenimiento>(`${this.apiUrl}/${id}`, mantenimiento).pipe(
      catchError(this.handleError)
    );
  }

  deleteMantenimiento(id: number): Observable<void> {
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