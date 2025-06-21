import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../model/todo.model';

@Component({
  selector: 'app-todo-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-stats.component.html',
  styleUrls: ['./todo-stats.component.css'],
})
export class TodoStatsComponent {
  @Input() todos: Todo[] = [];

  get total() {
    return this.todos.length;
  }
  get completed() {
    return this.todos.filter(t => t.completed).length;
  }
  get remaining() {
    return this.total - this.completed;
  }
}