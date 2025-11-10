import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['cash', 'bank', 'credit', 'investment', 'other'])
  type: string;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
