import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../interfaces/todo.interface';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() update = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<number>();

  toggleCompleted(): void {
    this.todo = { ...this.todo, completed: !this.todo.completed };
    this.update.emit(this.todo);
  }

  updateTitle(newTitle: string): void {
    if (newTitle.trim()) {
      this.todo = { ...this.todo, title: newTitle };
      this.update.emit(this.todo);
    }
  }

  deleteTodo(): void {
    this.delete.emit(this.todo.id!);
  }
}
