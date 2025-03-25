import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IMovimiento } from '../models/movimiento.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {

  private apiUrl = `${environment.API_URL}/movimientos`;

  constructor(private http: HttpClient) { }

  getMovimientos(): Observable<IMovimiento[]> {
    return this.http.get<IMovimiento[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getMovimiento(id: number): Observable<IMovimiento> {
    return this.http.get<IMovimiento>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createMovimiento(movimiento: IMovimiento): Observable<IMovimiento> {
    return this.http.post<IMovimiento>(this.apiUrl, movimiento).pipe(
      catchError(this.handleError)
    );
  }

  updateMovimiento(id: number, movimiento: IMovimiento): Observable<IMovimiento> {
    return this.http.put<IMovimiento>(`${this.apiUrl}/${id}`, movimiento).pipe(
      catchError(this.handleError)
    );
  }

  deleteMovimiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getUltimosMovimientos(): Observable<IMovimiento[]> {
    return this.http.get<IMovimiento[]>(`${this.apiUrl}-ultimos`).pipe(
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
