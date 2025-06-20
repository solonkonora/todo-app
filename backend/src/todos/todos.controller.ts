import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Todo } from './schemas/todo.schema';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({
    status: 201,
    description: 'The todo has been created.',
    type: typeof Todo,
  })
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({ status: 200, description: 'List of todos', type: [Todo] })
  async findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by id' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({ status: 200, description: 'The todo', type: typeof Todo })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async findOne(@Param('id') id: string): Promise<Todo> {
    return this.todosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({
    status: 200,
    description: 'The updated todo',
    type: typeof Todo,
  })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({ status: 200, description: 'Todo deleted' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.todosService.remove(id);
  }
}
