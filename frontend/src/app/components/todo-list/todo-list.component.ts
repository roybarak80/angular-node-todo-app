import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../interfaces/todo.interface';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodosFilterComponent } from '../todos-filter/todos-filter.component';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentHeaderComponent } from "../component-header/component-header.component";

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TodoItemComponent,
    TodosFilterComponent,
    MatDividerModule,
    ComponentHeaderComponent
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  form!: FormGroup;
  isSubmitting = false;
  formKey = 0;
  constructor(
    private todoService: TodoService,
    public cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadTodos();
    this.form = this.fb.group({
      newTodoTitle: ['', [Validators.required, Validators.minLength(1)]],
      newTodoDueDate: [null, Validators.required]
    });
    this.form.reset();

  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB- dateA ;
      });
      this.filteredTodos = todos;
      this.cdr.markForCheck();
    });
  }

  addTodo(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.value;

    const newTodo: Todo = {
      title: formValue.newTodoTitle.trim(),
      completed: false,
      dueDate: formValue.newTodoDueDate ? formValue.newTodoDueDate.toISOString() : null
    };

    this.todoService.addTodo(newTodo).subscribe({
      next: (todo) => {
        this.todos = [...this.todos, todo];
        this.filteredTodos = [...this.todos];
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
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
