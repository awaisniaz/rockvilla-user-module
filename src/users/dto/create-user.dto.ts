import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password should be greater than 8 character!' })
  password: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Name should be greater than 3 character' })
  name: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  categories?: [string];

  @ApiProperty()
  @Expose()
  @IsOptional()
  dob?: string;
}
