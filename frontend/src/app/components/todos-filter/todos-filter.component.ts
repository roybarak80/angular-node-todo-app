import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../interfaces/todo.interface';

@Component({
  selector: 'app-todos-filter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, FormsModule],
  templateUrl: './todos-filter.component.html',
  styleUrls: ['./todos-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosFilterComponent {
  @Input() todos: Todo[] = [];
  @Output() filteredTodos = new EventEmitter<Todo[]>();

  statusFilter: 'all' | 'completed' | 'not-completed' = 'all';
  dateFilter: 'all' | 'today' | 'week' = 'all';

  constructor(private cdr: ChangeDetectorRef) {}

  applyFilters(): void {
    let filtered = [...this.todos];

    // Filter by status
    if (this.statusFilter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    } else if (this.statusFilter === 'not-completed') {
      filtered = filtered.filter(todo => !todo.completed);
    }

    // Filter by createdAt date
    if (this.dateFilter !== 'all' && filtered.length > 0) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (this.dateFilter === 'today') {
        filtered = filtered.filter(todo => {
          const dueDate = new Date(todo.dueDate!);
          return dueDate >= today;
        });
      } else if (this.dateFilter === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filtered = filtered.filter(todo => {
          const createdAt = new Date(todo.createdAt!);
          return createdAt >= weekAgo;
        });
      }
    }

    this.filteredTodos.emit(filtered);
    this.cdr.markForCheck();
  }
}