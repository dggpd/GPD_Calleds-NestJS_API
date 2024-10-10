import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ pattern: '92987654321' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ maxLength: 16 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  sector?: string;
}
