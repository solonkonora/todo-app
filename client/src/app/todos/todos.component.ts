import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../service/todo.service';
import { Todo } from '../model/todo.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoListComponent } from '../todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, TodoListComponent],
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
    this.todoService.getTodos().subscribe(todos => (this.todos = todos));
  }

  addTodo(todo: { title: string; description: string }) {
    this.todoService
      .createTodo({ ...todo, completed: false })
      .subscribe(newTodo => this.todos.push(newTodo));
  }

  updateTodo(updated: Todo) {
    this.todoService.updateTodo(updated._id!, updated).subscribe(res => {
      const idx = this.todos.findIndex(t => t._id === res._id);
      if (idx > -1) this.todos[idx] = res;
    });
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter(t => t._id !== id);
    });
  }
}