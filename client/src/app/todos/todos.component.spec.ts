import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodosComponent } from './todos.component';
import { TodoService } from '../service/todo.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Todo } from '../model/todo.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoStatsComponent } from '../todo-stats/todo-stats.component';
import { CommonModule } from '@angular/common';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  const mockTodos: Todo[] = [
    { 
      _id: '1', 
      title: 'Test Todo 1', 
      description: 'Description 1', 
      completed: false 
    },
    { 
      _id: '2', 
      title: 'Test Todo 2', 
      description: 'Description 2', 
      completed: true 
    }
  ];

  beforeEach(async () => {
    const todoServiceSpy = jasmine.createSpyObj('TodoService', [
      'getTodos', 
      'createTodo', 
      'updateTodo', 
      'deleteTodo'
    ]);
    
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule,
        TodosComponent,
        TodoFormComponent, 
        TodoListComponent, 
        TodoStatsComponent
      ],
      providers: [
        { provide: TodoService, useValue: todoServiceSpy }
      ]
    }).compileComponents();

    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
    todoService.getTodos.and.returnValue(of(mockTodos));
    
    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

  it('should load todos on initialization', () => {
    expect(todoService.getTodos).toHaveBeenCalled();
    expect(component.todos.length).toBe(2);
    expect(component.todos).toEqual(mockTodos);
  });

  it('should add a new todo', () => {
    const newTodo = { 
      title: 'New Todo', 
      description: 'New Description' 
    };
    
    const mockResponse: Todo = { 
      _id: '3', 
      ...newTodo, 
      completed: false 
    };
    
    todoService.createTodo.and.returnValue(of(mockResponse));
    
    component.addTodo(newTodo);
    
    expect(todoService.createTodo).toHaveBeenCalledWith({
      ...newTodo,
      completed: false
    });
    expect(component.todos.length).toBe(3);
    expect(component.todos[2]).toEqual(mockResponse);
  });

  it('should update a todo', () => {
    const todoToUpdate = { 
      ...mockTodos[0], 
      title: 'Updated Title' 
    };
    
    todoService.updateTodo.and.returnValue(of(todoToUpdate));
    
    component.updateTodo(todoToUpdate);
    
    expect(todoService.updateTodo).toHaveBeenCalled();
    expect(component.todos[0].title).toBe('Updated Title');
  });

  it('should delete a todo', () => {
    const todoIdToDelete = '1';
    
    todoService.deleteTodo.and.returnValue(of(undefined));
    
    component.deleteTodo(todoIdToDelete);
    
    expect(todoService.deleteTodo).toHaveBeenCalledWith(todoIdToDelete);
    expect(component.todos.length).toBe(1);
    expect(component.todos[0]._id).toBe('2');
  });

  it('should calculate active count correctly', () => {
    expect(component.getActiveCount()).toBe(1);
  });

  it('should calculate completed count correctly', () => {
    expect(component.getCompletedCount()).toBe(1);
  });
});