import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICategoria } from '../models/categoria.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = `${environment.API_URL}/categorias`;

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<ICategoria[]> {
    return this.http.get<ICategoria[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getCategoria(id: number): Observable<ICategoria> {
    return this.http.get<ICategoria>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createCategoria(categoria: ICategoria): Observable<ICategoria> {
    return this.http.post<ICategoria>(this.apiUrl, categoria).pipe(
      catchError(this.handleError)
    );
  }

  updateCategoria(id: number, categoria: ICategoria): Observable<ICategoria> {
    return this.http.put<ICategoria>(`${this.apiUrl}/${id}`, categoria).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategoria(id: number): Observable<void> {
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