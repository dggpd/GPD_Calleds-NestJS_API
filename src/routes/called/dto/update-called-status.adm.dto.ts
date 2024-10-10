import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class UpdateCalledStatusAdmDto {
  @ApiProperty({ enum: ['OPENED', 'NO_ANSWER', 'RESOLVED', 'NO_SOLUTION'] })
  @IsString()
  @IsIn(['OPENED', 'NO_ANSWER', 'RESOLVED', 'NO_SOLUTION'])
  status: 'OPENED' | 'NO_ANSWER' | 'RESOLVED' | 'NO_SOLUTION';

  @ApiProperty({
    maxLength: 24,
    description: 'Obrigatório se status="RESOLVED" || "NO_SOLUTION"',
  })
  @ValidateIf(obj => obj.status === 'RESOLVED' || obj.status === 'NO_SOLUTION')
  @IsDefined()
  @IsString()
  @MaxLength(24)
  code?: string;

  @ApiProperty({
    enum: ['EASY', 'MEDIUM', 'HARD'],
    description: 'Obrigatório se status="RESOLVED" || "NO_SOLUTION"',
  })
  @ValidateIf(obj => obj.status === 'RESOLVED' || obj.status === 'NO_SOLUTION')
  @IsDefined()
  @IsString()
  @IsIn(['EASY', 'MEDIUM', 'HARD'])
  difficulty?: $Enums.CalledDifficulty;

  @ApiProperty({
    maxLength: 500,
    description: 'Obrigatório se status="RESOLVED" || "NO_SOLUTION"',
  })
  @ValidateIf(obj => obj.status === 'RESOLVED' || obj.status === 'NO_SOLUTION')
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  notes?: string;
}
