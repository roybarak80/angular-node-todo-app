import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo } from '../interfaces/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = '/api/todos';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl, {
      headers: new HttpHeaders({ 'Cache-Control': 'no-cache' })
    }).pipe(
      catchError(err => {
        this.showError('Failed to load todos: ' + err.message);
        return of([]);
      })
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      catchError(err => {
        this.showError('Failed to add todo: ' + err.message);
        return throwError(() => err);
      })
    );
  }

  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo).pipe(
      catchError(err => {
        this.showError('Failed to update todo: ' + err.message);
        return throwError(() => err);
      })
    );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        this.showError('Failed to delete todo: ' + err.message);
        return throwError(() => err);
      })
    );
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
