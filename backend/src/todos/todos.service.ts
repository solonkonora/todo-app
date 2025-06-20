import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from 'src/todos/schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = new this.todoModel(createTodoDto);
    return createdTodo.save();
  }

  async findAll(): Promise<Todo[]> {
    return this.todoModel.find().exec();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoModel.findById(id).exec();
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const updated = await this.todoModel
      .findByIdAndUpdate(id, updateTodoDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Todo not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.todoModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Todo not found');
  }
}
