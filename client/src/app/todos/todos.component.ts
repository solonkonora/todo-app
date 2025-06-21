import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../service/todo.service';
import { Todo } from '../model/todo.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoStatsComponent } from '../todo-stats/todo-stats.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TodoFormComponent,
    TodoListComponent,
    TodoStatsComponent,
  ],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe((todos) => (this.todos = todos));
  }

  // Helper methods for statistics
  getActiveCount(): number {
    if (!this.todos) return 0;
    return this.todos.filter((t) => !t.completed).length;
  }

  getCompletedCount(): number {
    if (!this.todos) return 0;
    return this.todos.filter((t) => t.completed).length;
  }

  addTodo(todo: { title: string; description: string }) {
    this.todoService
      .createTodo({ ...todo, completed: false })
      .subscribe((newTodo) => this.todos.push(newTodo));
  }

  updateTodo(updated: Todo) {
    console.log('updateTodo called with', updated);

    // Create a clean update object with only the fields the API needs
    const updateData: any = {
      title: updated.title,
      description: updated.description,
      completed: updated.completed,
    };

    console.log('Sending to API:', updateData);

    this.todoService.updateTodo(updated._id!, updateData).subscribe({
      next: (res) => {
        console.log('Update successful', res);
        const idx = this.todos.findIndex((t) => t._id === res._id);
        if (idx > -1) this.todos[idx] = res;
      },
      error: (err) => {
        console.error('Update failed', err);
        if (err.error && err.error.message) {
          console.error('Backend error:', err.error.message);
        }
      },
    });
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter((t) => t._id !== id);
    });
  }
}
