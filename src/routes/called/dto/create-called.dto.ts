import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCalledDto {
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
  @IsString()
  @IsIn([
    'COMPUTER_ISSUE',
    'SOFTWARE_ISSUE',
    'PERIPHERAL_ISSUE',
    'PRINT_ISSUE',
    'NETWORK_ACCESS_ISSUE',
    'INTERNET_ACCESS_ISSUE',
  ])
  type: $Enums.CalledType;

  @ApiProperty({ maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;
}
