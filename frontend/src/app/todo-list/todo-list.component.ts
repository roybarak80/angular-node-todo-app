import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../todo.service';
import { Todo } from '../todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle: string = '';

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const newTodo: Todo = {
        title: this.newTodoTitle,
        completed: false
      };
      this.todoService.addTodo(newTodo).subscribe(todo => {
        this.todos.push(todo);
        this.newTodoTitle = '';
      });
    }
  }

  toggleTodo(todo: Todo): void {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.todoService.updateTodo(updatedTodo).subscribe(() => {
      todo.completed = updatedTodo.completed;
    });
  }

  updateTodoTitle(todo: Todo, newTitle: string): void {
    if (newTitle.trim()) {
      const updatedTodo = { ...todo, title: newTitle };
      this.todoService.updateTodo(updatedTodo).subscribe(() => {
        todo.title = newTitle;
      });
    }
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter(todo => todo.id !== id);
    });
  }
}
