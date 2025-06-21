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
    console.log('saveEdit called', this.editTitle, this.editDescription);
    if (this.editTitle.trim() && this.editDescription.trim()) {
      console.log('Emitting update event');
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

  // toggleComplete() {
  //   console.log('Toggle complete called for todo:', this.todo);

  //   // Create a clean update object
  //   const updatedTodo = {
  //     ...this.todo,
  //     completed: !this.todo.completed,
  //     // Only set completed_at if task is being marked complete
  //     completed_at: !this.todo.completed ? new Date() : null,
  //   };

  //   console.log('Emitting updated todo:', updatedTodo);
  //   this.update.emit(updatedTodo);
  // }

  toggleComplete() {
    console.log('Toggle complete called for todo:', this.todo);

    // Create a clean update object and cast it to Todo
    const updatedTodo = {
      ...this.todo,
      completed: !this.todo.completed,
      // Keep as Date object for type compatibility
      completed_at: !this.todo.completed ? new Date() : null,
    } as Todo;

    console.log('Emitting updated todo:', updatedTodo);
    this.update.emit(updatedTodo);
  }

  ngOnChanges() {
    console.log('Todo item received:', this.todo);
  }

  onDelete() {
    this.delete.emit(this.todo._id!);
  }
}
