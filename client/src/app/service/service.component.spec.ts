import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { Todo } from '../model/todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve todos from the API', () => {
    const mockTodos: Todo[] = [
      { _id: '1', title: 'Test Todo', description: 'Test Description', completed: false }
    ];

    service.getTodos().subscribe(todos => {
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne('http://localhost:3000/todos');
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });

  it('should create a new todo', () => {
    // Define input with required fields
    const newTodo: Partial<Todo> = { 
      title: 'New Todo', 
      description: 'New Description',
      completed: false 
    };
    
    // Define complete response with all required fields
    const mockResponse = { 
      _id: '2', 
      title: 'New Todo',              // Required field
      description: 'New Description', // Required field
      completed: false,               // Required field
      created_at: new Date(),
      updated_at: new Date()
    } as Todo;

    service.createTodo(newTodo).subscribe(todo => {
      expect(todo._id).toBe('2');
      expect(todo.title).toBe('New Todo'); // Use explicit string value
    });

    const req = httpMock.expectOne('http://localhost:3000/todos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTodo);
    req.flush(mockResponse);
  });

  it('should update a todo', () => {
    const todoId = '1';
    const updateData: Partial<Todo> = { 
      title: 'Updated Todo',
      completed: true
    };
    
    const mockResponse = { 
      _id: todoId, 
      title: 'Updated Todo', 
      description: 'Test Description',
      completed: true,
      created_at: new Date(),
      updated_at: new Date()
    } as Todo;

    service.updateTodo(todoId, updateData).subscribe(todo => {
      expect(todo.title).toBe('Updated Todo');
      expect(todo.completed).toBeTrue();
    });

    const req = httpMock.expectOne(`http://localhost:3000/todos/${todoId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

  it('should delete a todo', () => {
    const todoId = '1';

    service.deleteTodo(todoId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:3000/todos/${todoId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});