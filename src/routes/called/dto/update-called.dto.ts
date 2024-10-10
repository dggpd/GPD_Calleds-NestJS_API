import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCalledDto {
  @ApiProperty({
    enum: [
      'COMPUTER_ISSUE',
      'SOFTWARE_ISSUE',
      'PERIPHERAL_ISSUE',
      'PRINT_ISSUE',
      'NETWORK_ACCESS_ISSUE',
      'INTERNET_ACCESS_ISSUE',
    ],
  })
  @IsOptional()
  @IsString()
  @IsIn([
    'COMPUTER_ISSUE',
    'SOFTWARE_ISSUE',
    'PERIPHERAL_ISSUE',
    'PRINT_ISSUE',
    'NETWORK_ACCESS_ISSUE',
    'INTERNET_ACCESS_ISSUE',
  ])
  type?: $Enums.CalledType;

  @ApiProperty({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
