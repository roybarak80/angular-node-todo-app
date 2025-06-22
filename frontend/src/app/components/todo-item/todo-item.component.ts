import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../interfaces/todo.interface';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import { DueDateCheckerPipe } from "../../pipes/due-date-checker.pipe";
@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DueDateCheckerPipe
],
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
