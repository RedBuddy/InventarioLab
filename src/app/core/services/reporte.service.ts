import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IReporteGenerado } from '../models/reporte_generado.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private apiUrl = `${environment.API_URL}/reportes`;

  constructor(private http: HttpClient) { }

  generarReporte(tipo: string, fechaInicio: string, fechaFin: string, equipo: string, usuarioId: number): Observable<any> {
    const params = { tipo, fechaInicio, fechaFin, equipo, usuarioId };
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getReportesGenerados(): Observable<IReporteGenerado[]> {
    return this.http.get<IReporteGenerado[]>(`${this.apiUrl}/generados`).pipe(
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