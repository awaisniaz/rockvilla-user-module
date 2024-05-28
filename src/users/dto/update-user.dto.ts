import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password should be greater than 8 character!' })
  password?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Name should be greater than 3 character' })
  name?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  categories?: [string];

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  dob?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  @Expose()
  image?: string;
}
