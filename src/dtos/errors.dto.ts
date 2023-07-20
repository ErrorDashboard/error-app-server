import {
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class Component {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsNumber()
  line: number;
}

export class ErrorLogFilterDto {
  @IsNumber()
  @IsOptional()
  statusCode?: number;

  @IsString()
  @IsOptional()
  id?: string;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsBoolean()
  @IsOptional()
  resolved?: boolean;
}

export class CreateErrorDto {
  @IsNumber()
  @IsNotEmpty()
  statusCode: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Component)
  component: Component;

  @IsString()
  @IsOptional()
  userAffected?: string;

  @IsString()
  @IsNotEmpty()
  stackTrace: string;

  @IsBoolean()
  @IsOptional()
  resolved?: boolean;
}
