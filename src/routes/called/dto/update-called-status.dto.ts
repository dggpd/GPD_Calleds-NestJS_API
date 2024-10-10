import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class UpdateCalledStatusDto {
  @ApiProperty({ enum: ['PENDING', 'CANCELED'] })
  @IsString()
  @IsIn(['PENDING', 'CANCELED'])
  status: 'PENDING' | 'CANCELED';
}
