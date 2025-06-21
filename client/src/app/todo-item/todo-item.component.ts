import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../model/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() update = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<string>();

  editing = false;
  editTitle = '';
  editDescription = '';

  startEdit() {
    this.editing = true;
    this.editTitle = this.todo.title;
    this.editDescription = this.todo.description;
  }

  saveEdit() {
    if (this.editTitle.trim() && this.editDescription.trim()) {
      this.update.emit({
        ...this.todo,
        title: this.editTitle,
        description: this.editDescription,
      });
      this.editing = false;
    }
  }

  cancelEdit() {
    this.editing = false;
  }

  toggleComplete() {
    this.update.emit({
      ...this.todo,
      completed: !this.todo.completed,
      completed_at: !this.todo.completed ? new Date() : null,
    });
  }

  onDelete() {
    this.delete.emit(this.todo._id!);
  }
}
