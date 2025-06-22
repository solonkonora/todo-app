import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { NotFoundException } from '@nestjs/common';
import { jest } from '@jest/globals';

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  const mockTodo = {
    _id: 'test-id',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    created_at: new Date(),
    updated_at: new Date()
  };

  // Mock service methods
  const mockTodosService = {
    findAll: jest.fn().mockResolvedValue([mockTodo]),
    findOne: jest.fn().mockResolvedValue(mockTodo),
    create: jest.fn().mockImplementation((dto) => Promise.resolve({
      _id: 'new-id',
      ...dto,
      created_at: new Date(),
      updated_at: new Date()
    })),
    update: jest.fn().mockImplementation((id, dto) => Promise.resolve({
      _id: id,
      ...mockTodo,
      ...dto,
      updated_at: new Date()
    })),
    remove: jest.fn().mockResolvedValue(mockTodo)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService
        }
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockTodo]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const result = await controller.findOne('test-id');
      expect(result).toEqual(mockTodo);
      expect(service.findOne).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException if todo not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());
      await expect(controller.findOne('unknown-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'New Todo',
        description: 'New Description',
        completed: false
      };
      
      const result = await controller.create(createTodoDto);
      
      expect(result).toHaveProperty('_id');
      expect(result.title).toBe(createTodoDto.title);
      expect(result.description).toBe(createTodoDto.description);
      expect(service.create).toHaveBeenCalledWith(createTodoDto);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
        completed: true
      };
      
      const result = await controller.update('test-id', updateTodoDto);
      
      expect(result._id).toBe('test-id');
      expect(result.title).toBe(updateTodoDto.title);
      expect(result.completed).toBe(updateTodoDto.completed);
      expect(service.update).toHaveBeenCalledWith('test-id', updateTodoDto);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const result = await controller.remove('test-id');
      
      expect(result).toEqual(mockTodo);
      expect(service.remove).toHaveBeenCalledWith('test-id');
    });
  });
});