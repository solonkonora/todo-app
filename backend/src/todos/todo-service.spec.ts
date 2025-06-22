import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { getModelToken } from '@nestjs/mongoose';
import { Todo } from './schemas/todo.schema';
import { NotFoundException } from '@nestjs/common';

describe('TodosService', () => {
  let service: TodosService;
  
  // Mock todo data
  const mockTodo = {
    _id: 'test-id',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    created_at: new Date(),
    updated_at: new Date()
  };

  // Mock todo model methods
  const mockTodoModel = {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockTodo])
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockTodo)
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockTodo)
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockTodo)
    }),
    create: jest.fn().mockImplementation((dto) => ({
      ...dto,
      _id: 'new-id',
      created_at: new Date(),
      updated_at: new Date()
    }))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getModelToken(Todo.name),
          useValue: mockTodoModel
        }
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockTodo]);
      expect(mockTodoModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const result = await service.findOne('test-id');
      expect(result).toEqual(mockTodo);
      expect(mockTodoModel.findById).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException if todo not found', async () => {
      mockTodoModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null)
      });
      
      await expect(service.findOne('unknown-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoDto = {
        title: 'New Todo',
        description: 'New Description',
        completed: false
      };
      
      const result = await service.create(createTodoDto);
      
      expect(result).toHaveProperty('_id', 'new-id');
      expect(result.title).toEqual(createTodoDto.title);
      expect(result.description).toEqual(createTodoDto.description);
      expect(mockTodoModel.create).toHaveBeenCalledWith(createTodoDto);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodoDto = { 
        title: 'Updated Todo',
        completed: true
      };
      
      const result = await service.update('test-id', updateTodoDto);
      
      expect(result).toEqual(mockTodo);
      expect(mockTodoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'test-id',
        updateTodoDto,
        { new: true }
      );
    });

    it('should throw NotFoundException if todo to update not found', async () => {
      mockTodoModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null)
      });
      
      await expect(service.update('unknown-id', { title: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a todo', async () => {
      const result = await service.remove('test-id');
      
      expect(result).toEqual(mockTodo);
      expect(mockTodoModel.findByIdAndDelete).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException if todo to delete not found', async () => {
      mockTodoModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null)
      });
      
      await expect(service.remove('unknown-id')).rejects.toThrow(NotFoundException);
    });
  });
});

function beforeEach(arg0: () => Promise<void>) {
    throw new Error('Function not implemented.');
}


