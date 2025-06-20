import { ApiProperty } from '@nestjs/swagger';

export class Todo {
  @ApiProperty({ description: 'Unique identifier', example: '1' })
  id: string;

  @ApiProperty({ description: 'Todo title', example: 'Learn NestJS' })
  title: string;

  @ApiProperty({
    description: 'Todo description',
    example: 'Read the official documentation',
  })
  description?: string;

  @ApiProperty({ description: 'Completion status', example: false })
  completed: boolean;
}
