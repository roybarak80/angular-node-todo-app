import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../interfaces/todo.interface';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodosFilterComponent } from '../todos-filter/todos-filter.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TodoItemComponent,
    TodosFilterComponent
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  newTodoTitle: string = '';
  newTodoDueDate: Date | null = null;

  constructor(private todoService: TodoService, public cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
      this.filteredTodos = todos;
      this.cdr.markForCheck();
    });
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const newTodo: Todo = {
        title: this.newTodoTitle,
        completed: false,
        dueDate: this.newTodoDueDate ? this.newTodoDueDate.toISOString() : null
      };
      this.todoService.addTodo(newTodo).subscribe(todo => {
        this.todos = [...this.todos, todo];
        this.filteredTodos = [...this.todos];
        this.newTodoTitle = '';
        this.newTodoDueDate = null;
        this.cdr.markForCheck();
      });
    }
  }

  updateTodo(todo: Todo): void {
    this.todoService.updateTodo(todo).subscribe(updatedTodo => {
      const index = this.todos.findIndex(t => t.id === updatedTodo.id);
      if (index !== -1) {
        this.todos[index] = updatedTodo;
        this.filteredTodos = [...this.todos];
        this.cdr.markForCheck();
      }
    });
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter(todo => todo.id !== id);
      this.filteredTodos = [...this.todos];
      this.cdr.markForCheck();
    });
  }

  onFilteredTodos(todos: Todo[]): void {
    this.filteredTodos = todos;
    this.cdr.markForCheck();
  }
}
