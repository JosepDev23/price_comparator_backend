import { ApiProperty } from '@nestjs/swagger';

export class DeleteResultDto {
  @ApiProperty({ description: 'Número de productos eliminados' })
  deletedCount?: number;
}
