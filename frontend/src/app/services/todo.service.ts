import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../interfaces/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = '/api/todos';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache'
    });
    return this.http.get<Todo[]>(this.apiUrl, { headers });
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo);
  }

  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
