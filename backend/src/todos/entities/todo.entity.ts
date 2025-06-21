import { ApiProperty } from '@nestjs/swagger';

export class Todo {
  @ApiProperty({ description: 'Unique identifier', example: '1' })
  id: string;

  @ApiProperty({
    description: 'Todo title',
    example: 'Learn NestJS',
    maxLength: 255,
  })
  title: string;

  @ApiProperty({
    description: 'Todo description',
    example: 'Read the official documentation',
  })
  description: string;

  @ApiProperty({ description: 'Completion status', example: false })
  completed: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-06-20T12:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-06-20T12:30:00.000Z',
  })
  updated_at: Date;
}
