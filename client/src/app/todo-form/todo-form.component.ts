import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css'],
})
export class TodoFormComponent {
  title = '';
  description = '';
  @Output() todoAdd = new EventEmitter<{ title: string; description: string }>();

  addTodo() {
    if (this.title.trim() && this.description.trim()) {
      this.todoAdd.emit({ title: this.title.trim(), description: this.description.trim() });
      this.title = '';
      this.description = '';
    }
  }
}